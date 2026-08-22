from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import case, func
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import User, UserRole, Question, Test, UserAnswer
from app.rbac import require_roles
from app.practice_schemas.practice import (
    QuestionOut,
    SubmitRequest,
    SubmitResponse,
    QuestionResult,
    HistoryItem,
)


router = APIRouter(prefix="/api/practice", tags=["Practice"])


@router.get("/questions", response_model=List[QuestionOut])
def get_practice_questions(
    subject: Optional[str] = Query(default=None, min_length=1),
    topic: Optional[str] = Query(default=None, min_length=1),
    difficulty: Optional[str] = Query(default=None, min_length=1),
    limit: int = Query(default=10, ge=1, le=50),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.STUDENT)),
):
    """Lấy câu hỏi luyện tập trực tiếp từ bảng questions theo bộ lọc."""
    query = db.query(Question)

    if subject is not None:
        query = query.filter(Question.subject == subject)

    if topic is not None:
        query = query.filter(Question.topic == topic)

    if difficulty is not None:
        query = query.filter(
            func.upper(Question.difficulty) == difficulty.upper()
        )

    questions = query.order_by(Question.id.asc()).limit(limit).all()

    if not questions:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy câu hỏi luyện tập trong hệ thống",
        )

    return questions


@router.post(
    "/submit",
    response_model=SubmitResponse,
    status_code=status.HTTP_201_CREATED,
)
def submit_practice(
    data: SubmitRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.STUDENT)),
):
    """Chấm bài luyện tập, lưu Test và các UserAnswer theo schema DB hiện tại."""
    q_ids = [answer.question_id for answer in data.answers]

    if not q_ids:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Danh sách câu trả lời không được để trống",
        )

    if len(q_ids) != len(set(q_ids)):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mỗi câu hỏi chỉ được trả lời một lần.",
        )

    questions = db.query(Question).filter(Question.id.in_(q_ids)).all()
    question_map = {question.id: question for question in questions}

    missing_ids = [qid for qid in q_ids if qid not in question_map]
    if missing_ids:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Câu hỏi không tồn tại: {missing_ids}",
        )

    correct_map = {question.id: question.correct_answer for question in questions}

    raw_score = sum(
        1
        for answer in data.answers
        if correct_map.get(answer.question_id) == answer.selected_option
    )

    total_questions = len(data.answers)
    percentage = round((raw_score / total_questions) * 100, 2)

    # Keep this identical in persistence style to the working diagnostic module.
    new_test = Test(
        user_id=current_user.id,
        score=percentage,
        status="COMPLETED",
        completed_at=datetime.utcnow(),
    )
    db.add(new_test)
    db.commit()
    db.refresh(new_test)

    answers_to_insert = [
        UserAnswer(
            test_id=new_test.id,
            question_id=answer.question_id,
            user_answer=answer.selected_option,
            is_correct=(
                correct_map.get(answer.question_id) == answer.selected_option
            ),
        )
        for answer in data.answers
    ]

    db.add_all(answers_to_insert)
    db.commit()

    question_results = []
    for answer in data.answers:
        question = question_map[answer.question_id]
        selected_option = answer.selected_option

        question_results.append(
            QuestionResult(
                question_id=question.id,
                content=question.content,
                selected_option=selected_option,
                selected_answer=question.choices.get(selected_option),
                correct_option=question.correct_answer,
                correct_answer=question.choices.get(
                    question.correct_answer,
                    question.correct_answer,
                ),
                is_correct=(
                    selected_option == question.correct_answer
                ),
                explanation=question.explanation,
            )
        )

    return SubmitResponse(
        test_id=new_test.id,
        user_id=current_user.id,
        test_type="PRACTICE",
        raw_score=raw_score,
        total_questions=total_questions,
        percentage=percentage,
        message="Nộp bài luyện tập thành công!",
        question_results=question_results,
    )


@router.get("/history", response_model=List[HistoryItem])
def get_practice_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.STUDENT)),
):
    """
    Trả về các bài COMPLETED của Student hiện tại.

    Database hiện tại không có tests.type, vì vậy endpoint không thể
    phân biệt PRACTICE và DIAGNOSTIC ở tầng SQL. Kết quả của endpoint
    /practice/history được gắn nhãn PRACTICE ở tầng response.
    """
    tests = (
        db.query(Test)
        .filter(
            Test.user_id == current_user.id,
            Test.status == "COMPLETED",
        )
        .order_by(Test.completed_at.desc(), Test.id.desc())
        .all()
    )

    if not tests:
        return []

    test_ids = [test.id for test in tests]

    answer_stats = (
        db.query(
            UserAnswer.test_id,
            func.count(UserAnswer.id).label("total_questions"),
            func.sum(
                case(
                    (UserAnswer.is_correct.is_(True), 1),
                    else_=0,
                )
            ).label("correct_answers"),
        )
        .filter(UserAnswer.test_id.in_(test_ids))
        .group_by(UserAnswer.test_id)
        .all()
    )

    stats_map = {
        row.test_id: {
            "total_questions": int(row.total_questions or 0),
            "correct_answers": int(row.correct_answers or 0),
        }
        for row in answer_stats
    }

    return [
        HistoryItem(
            test_id=test.id,
            user_id=current_user.id,
            test_type="PRACTICE",
            score=float(test.score or 0),
            status=test.status,
            started_at=(
                test.started_at.isoformat()
                if test.started_at is not None
                else None
            ),
            completed_at=(
                test.completed_at.isoformat()
                if test.completed_at is not None
                else None
            ),
            total_questions=stats_map.get(test.id, {}).get(
                "total_questions", 0
            ),
            correct_answers=stats_map.get(test.id, {}).get(
                "correct_answers", 0
            ),
        )
        for test in tests
    ]
