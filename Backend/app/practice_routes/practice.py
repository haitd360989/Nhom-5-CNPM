from datetime import datetime, timezone
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import case, func
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import Question, Test, User, UserAnswer, UserRole
from app.rbac import require_roles


router = APIRouter(prefix="/api/practice", tags=["Practice"])


class PracticeQuestionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    content: str
    choices: dict
    subject: str
    topic: Optional[str] = None
    difficulty: str
    explanation: Optional[str] = None


class PracticeAnswerIn(BaseModel):
    question_id: int = Field(gt=0)
    selected_option: Optional[str] = Field(default=None, max_length=255)


class PracticeSubmitRequest(BaseModel):
    answers: List[PracticeAnswerIn] = Field(min_length=1)


class PracticeQuestionResult(BaseModel):
    question_id: int
    selected_option: Optional[str] = None
    correct_option: str
    is_correct: bool
    explanation: Optional[str] = None


class PracticeSubmitResponse(BaseModel):
    test_id: int
    user_id: int
    test_type: str
    score: float
    correct_answers: int
    total_questions: int
    status: str
    completed_at: datetime
    question_results: List[PracticeQuestionResult]


class PracticeHistoryItem(BaseModel):
    test_id: int
    test_type: str
    score: float
    status: str
    started_at: datetime
    completed_at: Optional[datetime] = None
    total_questions: int
    correct_answers: int


@router.get("/questions", response_model=List[PracticeQuestionOut])
def get_practice_questions(
    subject: Optional[str] = Query(default=None, min_length=1),
    topic: Optional[str] = Query(default=None, min_length=1),
    difficulty: Optional[str] = Query(default=None, min_length=1),
    limit: int = Query(default=10, ge=1, le=50),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.STUDENT)),
):
    """Return practice questions from the questions table using the supplied filters."""
    query = db.query(Question)

    if subject is not None:
        query = query.filter(Question.subject == subject)

    if topic is not None:
        query = query.filter(Question.topic == topic)

    if difficulty is not None:
        difficulty_value = difficulty.upper()
        query = query.filter(func.upper(Question.difficulty) == difficulty_value)

    questions = query.order_by(Question.id.asc()).limit(limit).all()
    return questions


@router.post(
    "/submit",
    response_model=PracticeSubmitResponse,
    status_code=status.HTTP_201_CREATED,
)
def submit_practice(
    data: PracticeSubmitRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.STUDENT)),
):
    """Grade a practice attempt and save it to tests + user_answers."""
    question_ids = [answer.question_id for answer in data.answers]

    if len(question_ids) != len(set(question_ids)):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mỗi câu hỏi chỉ được trả lời một lần.",
        )

    questions = (
        db.query(Question)
        .filter(Question.id.in_(question_ids))
        .all()
    )
    question_map = {question.id: question for question in questions}

    missing_ids = [question_id for question_id in question_ids if question_id not in question_map]
    if missing_ids:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Câu hỏi không tồn tại: {missing_ids}",
        )

    correct_count = 0
    question_results = []

    for answer in data.answers:
        question = question_map[answer.question_id]
        selected = answer.selected_option
        is_correct = selected is not None and selected == question.correct_answer

        if is_correct:
            correct_count += 1

        question_results.append(
            PracticeQuestionResult(
                question_id=question.id,
                selected_option=selected,
                correct_option=question.correct_answer,
                is_correct=is_correct,
                explanation=question.explanation,
            )
        )

    total_questions = len(data.answers)
    score = round((correct_count / total_questions) * 100, 2)

    now = datetime.now(timezone.utc)

    new_test = Test(
        user_id=current_user.id,
        type="PRACTICE",
        score=score,
        status="COMPLETED",
        started_at=now,
        completed_at=now,
    )
    db.add(new_test)
    db.flush()

    db.add_all(
        [
            UserAnswer(
                test_id=new_test.id,
                question_id=answer.question_id,
                user_answer=answer.selected_option,
                is_correct=(
                    answer.selected_option is not None
                    and answer.selected_option == question_map[answer.question_id].correct_answer
                ),
                answered_at=now,
            )
            for answer in data.answers
        ]
    )

    db.commit()
    db.refresh(new_test)

    return PracticeSubmitResponse(
        test_id=new_test.id,
        user_id=current_user.id,
        test_type=new_test.type,
        score=float(new_test.score or 0),
        correct_answers=correct_count,
        total_questions=total_questions,
        status=new_test.status,
        completed_at=new_test.completed_at,
        question_results=question_results,
    )


@router.get("/history", response_model=List[PracticeHistoryItem])
def get_practice_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.STUDENT)),
):
    """Return completed PRACTICE tests for the authenticated student."""
    tests = (
        db.query(Test)
        .filter(
            Test.user_id == current_user.id,
            Test.type == "PRACTICE",
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
                case((UserAnswer.is_correct == True, 1), else_=0)
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
        PracticeHistoryItem(
            test_id=test.id,
            test_type=test.type,
            score=float(test.score or 0),
            status=test.status,
            started_at=test.started_at,
            completed_at=test.completed_at,
            total_questions=stats_map.get(test.id, {}).get("total_questions", 0),
            correct_answers=stats_map.get(test.id, {}).get("correct_answers", 0),
        )
        for test in tests
    ]
