from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db import get_db
from app.models import Question, UserAnswer, StudyPlan, PlanTask
from app.schemas.diagnostic import (
    QuestionOut,
    SubmitRequest,
    SubmitResponse,
    StudyPlanInitRequest,
    StudyPlanInitResponse,
)

router = APIRouter(prefix="/api", tags=["Diagnostic Assessment"])


@router.get("/diagnostic/questions", response_model=List[QuestionOut])
def get_questions(db: Session = Depends(get_db)):
    questions = db.query(Question).all()
    return questions


@router.post("/diagnostic/submit", response_model=SubmitResponse)
def submit_diagnostic(payload: SubmitRequest, db: Session = Depends(get_db)):
    questions = db.query(Question).all()
    q_map = {q.id: q.correct_answer for q in questions}

    correct_count = 0
    for item in payload.answers:
        if q_map.get(item.question_id) == item.selected_option:
            correct_count += 1

    total = len(questions) if questions else 1
    percentage = round((correct_count / total) * 100, 2)

    user_id = 1

    user_answer = UserAnswer(
        user_id=user_id,
        answers=[item.model_dump() for item in payload.answers],
        score=correct_count,
        total_questions=total,
        completion_time_seconds=payload.completion_time_seconds,
    )
    db.add(user_answer)
    db.commit()

    return SubmitResponse(
        user_id=user_id,
        raw_score=correct_count,
        total_questions=total,
        percentage=percentage,
        message="Nộp bài và chấm điểm thành công!",
    )


@router.post("/study-plan/init", response_model=StudyPlanInitResponse)
def init_study_plan(payload: StudyPlanInitRequest, db: Session = Depends(get_db)):
    user_id = 1

    plan = StudyPlan(
        user_id=user_id,
        title=payload.target_goal or "Luyện thi ĐGNL",
        status="active",
    )
    db.add(plan)
    db.commit()
    db.refresh(plan)

    sample_tasks = [
        PlanTask(plan_id=plan.id, title="Củng cố kiến thức Toán học cơ bản", day_number=1),
        PlanTask(plan_id=plan.id, title="Luyện bài tập Tư duy Logic", day_number=2),
        PlanTask(plan_id=plan.id, title="Rèn luyện kỹ năng Đọc hiểu Tiếng Việt", day_number=3),
    ]
    db.add_all(sample_tasks)
    db.commit()

    return StudyPlanInitResponse(
        plan_id=plan.id,
        user_id=user_id,
        title=plan.title,
        status=plan.status,
        total_tasks=len(sample_tasks),
    )