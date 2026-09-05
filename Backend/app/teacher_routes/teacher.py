from typing import Optional, List, Dict
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.db import get_db
from app.models import User, UserRole, Question, Test 
from app.rbac import require_roles
from app.teacher_schemas.teacher import (
    QuestionCreate,
    QuestionUpdate,
    QuestionResponse,
    AnalyticsOverviewResponse,
    TeacherOverviewResponse,
)

router = APIRouter(prefix="/api/teacher", tags=["Teacher Management"])


@router.get("/questions", response_model=List[QuestionResponse])
def get_teacher_questions(
    subject: Optional[str] = Query(None, description="Lọc theo môn học"),
    topic: Optional[str] = Query(None, description="Lọc theo chủ đề"),
    difficulty: Optional[str] = Query(None, description="Lọc theo độ khó"),
    skip: int = Query(0, ge=0, description="Số lượng bản ghi bỏ qua (Phân trang)"),
    limit: int = Query(10, ge=1, le=100, description="Số lượng bản ghi lấy ra (Phân trang)"),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.TEACHER, UserRole.ADMIN))
):
    query = db.query(Question)

    if subject:
        query = query.filter(Question.subject == subject)
    if topic:
        query = query.filter(Question.topic == topic)
    if difficulty:
        query = query.filter(Question.difficulty == difficulty)

    questions = query.offset(skip).limit(limit).all()
    return questions


@router.post("/questions", response_model=QuestionResponse, status_code=status.HTTP_201_CREATED)
def create_question(
    question_in: QuestionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.TEACHER, UserRole.ADMIN))
):
    new_question = Question(**question_in.model_dump())
    db.add(new_question)
    db.commit()
    db.refresh(new_question)
    return new_question


@router.put("/questions/{id}", response_model=QuestionResponse)
def update_question(
    id: int,
    question_in: QuestionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.TEACHER, UserRole.ADMIN))
):
    question = db.query(Question).filter(Question.id == id).first()
    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy câu hỏi với ID: {id}"
        )

    update_data = question_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(question, field, value)

    db.commit()
    db.refresh(question)
    return question


@router.delete("/questions/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_question(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.TEACHER, UserRole.ADMIN))
):
    question = db.query(Question).filter(Question.id == id).first()
    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy câu hỏi với ID: {id}"
        )

    db.delete(question)
    db.commit()
    return None


@router.get("/analytics/overview", response_model=AnalyticsOverviewResponse)
def get_analytics_overview(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.TEACHER, UserRole.ADMIN))
):
    total_students = db.query(User).filter(User.role == UserRole.STUDENT).count()

    completed_test_ids = db.query(Test.id).filter(Test.status == "COMPLETED").all()
    total_completed_tests = len(completed_test_ids)

    completed_scores = (
        db.query(Test.score)
        .filter(Test.status == "COMPLETED", Test.score.isnot(None))
        .all()
    )

    average_score_by_subject = {}
    if completed_scores:
        scores = [s[0] for s in completed_scores]
        if scores:
            average_score_by_subject["General"] = round(float(sum(scores) / len(scores)), 2)

    return AnalyticsOverviewResponse(
        total_students=total_students,
        total_completed_tests=total_completed_tests,
        average_score_by_subject=average_score_by_subject
    )
    

@router.get("/overview", response_model=TeacherOverviewResponse)
def get_teacher_overview(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.TEACHER, UserRole.ADMIN))
):
    total_questions = db.query(Question).count()

    questions_by_subject_raw = (
        db.query(Question.subject, func.count(Question.id))
        .group_by(Question.subject)
        .all()
    )
    questions_by_subject = {
        (subject if subject else "Unassigned"): count 
        for subject, count in questions_by_subject_raw
    }

    total_students = db.query(User).filter(User.role == UserRole.STUDENT).count()

    total_test_attempts = db.query(Test.id).count()

    return TeacherOverviewResponse(
        total_questions=total_questions,
        questions_by_subject=questions_by_subject,
        total_students=total_students,
        total_test_attempts=total_test_attempts
    )