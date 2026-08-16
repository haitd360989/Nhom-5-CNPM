from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import User, UserRole, Question, Test, UserAnswer, StudyPlan, PlanTask
from app.rbac import require_roles
from app.diagnostic_schemas.diagnostic import (
    QuestionOut,
    SubmitRequest,
    SubmitResponse,
    StudyPlanInitRequest,
    StudyPlanInitResponse,
)

router = APIRouter(prefix="/api", tags=["Diagnostic Assessment & Study Plan"])


@router.get("/diagnostic/questions", response_model=List[QuestionOut])
def get_diagnostic_questions(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.STUDENT, UserRole.ADMIN, UserRole.TEACHER))
):
    """Lấy 10–15 câu hỏi chẩn đoán ban đầu từ bảng questions trên Supabase"""
    questions = db.query(Question).limit(15).all()
    if not questions:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy câu hỏi chẩn đoán trong hệ thống"
        )
    return questions


@router.post("/diagnostic/submit", response_model=SubmitResponse)
def submit_diagnostic(
    data: SubmitRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.STUDENT, UserRole.ADMIN))
):
    """Nhận danh sách câu trả lời, lưu bài thi vào tests và chi tiết vào user_answers"""
    q_ids = [a.question_id for a in data.answers]
    if not q_ids:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Danh sách câu trả lời không được để trống"
        )

    questions = db.query(Question).filter(Question.id.in_(q_ids)).all()
    correct_map = {q.id: q.correct_answer for q in questions}

    raw_score = sum(1 for a in data.answers if correct_map.get(a.question_id) == a.selected_option)
    total = len(data.answers)
    percentage = round((raw_score / total) * 100, 2) if total > 0 else 0.0

    # 1. Tạo phiên làm bài thi trong bảng tests
    new_test = Test(
        user_id=current_user.id,
        score=percentage,
        status="COMPLETED",
        completed_at=datetime.utcnow()
    )
    db.add(new_test)
    db.commit()
    db.refresh(new_test)

    # 2. Lưu chi tiết từng câu trả lời vào bảng user_answers
    answers_to_insert = [
        UserAnswer(
            test_id=new_test.id,
            question_id=a.question_id,
            user_answer=a.selected_option,
            is_correct=(correct_map.get(a.question_id) == a.selected_option)
        )
        for a in data.answers
    ]
    db.add_all(answers_to_insert)
    db.commit()

    return SubmitResponse(
        test_id=new_test.id,
        user_id=current_user.id,
        raw_score=raw_score,
        total_questions=total,
        percentage=percentage,
        message="Nộp bài test chẩn đoán thành công!"
    )


@router.post("/study-plan/init", response_model=StudyPlanInitResponse)
def init_study_plan(
    data: StudyPlanInitRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.STUDENT, UserRole.ADMIN))
):
    """Tự động khởi tạo 1 bản ghi lộ trình mẫu trong study_plans và plan_tasks"""
    new_plan = StudyPlan(
        user_id=current_user.id,
        title=f"Lộ trình cá nhân hóa - {data.target_goal}",
        target_score=data.target_score,
        total_days=data.total_days or 30,
        current_day=1,
        status="ACTIVE"
    )
    db.add(new_plan)
    db.commit()
    db.refresh(new_plan)

    sample_tasks = [
        PlanTask(plan_id=new_plan.id, title="Ôn tập kiến thức Toán định lượng cơ bản", day_no=1, type="READING", status="PENDING"),
        PlanTask(plan_id=new_plan.id, title="Luyện tập chuyên đề Logic & Bảng số liệu", day_no=2, type="QUIZ", status="PENDING"),
        PlanTask(plan_id=new_plan.id, title="Rèn kỹ năng đọc hiểu văn bản & Ngôn ngữ", day_no=3, type="VIDEO", status="PENDING"),
    ]
    db.add_all(sample_tasks)
    db.commit()

    return StudyPlanInitResponse(
        plan_id=new_plan.id,
        user_id=current_user.id,
        title=new_plan.title,
        status=new_plan.status,
        total_tasks=len(sample_tasks)
    )