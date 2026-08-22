from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db import get_db
from app.schemas import TutorAskRequest, TutorAskResponse
from app.rag.tutor_service import generate_tutor_response
from app.models import User, UserRole, Question 
from app.rbac import require_roles

router = APIRouter(prefix="/api/v1/rbac", tags=["RBAC"])


@router.get("/admin")
def admin_resource(user: User = Depends(require_roles(UserRole.ADMIN))):
    return {"message": "Admin resource", "user_id": user.id, "role": user.role}


@router.get("/teacher")
def teacher_resource(user: User = Depends(require_roles(UserRole.ADMIN, UserRole.TEACHER))):
    return {"message": "Teacher resource", "user_id": user.id, "role": user.role}


@router.get("/student")
def student_resource(user: User = Depends(require_roles(UserRole.ADMIN, UserRole.STUDENT))):
    return {"message": "Student resource", "user_id": user.id, "role": user.role}


@router.get("/parent")
def parent_resource(user: User = Depends(require_roles(UserRole.ADMIN, UserRole.PARENT))):
    return {"message": "Parent resource", "user_id": user.id, "role": user.role}

@router.post("/tutor/ask", response_model=TutorAskResponse)
async def ask_ai_tutor(
    body: TutorAskRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.STUDENT, UserRole.ADMIN))
):
    question = db.query(Question).filter(Question.id == body.question_id).first()

    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy câu hỏi có ID {body.question_id}"
        )

    question_context = (
        f"Môn học: {question.subject} | Chủ đề: {question.topic}\n"
        f"Đề bài: {question.content}\n"
        f"Các lựa chọn: {question.choices}\n"
        f"Đáp án đúng: {question.correct_answer}\n"
        f"Lời giải chi tiết: {question.explanation}"
    )

    ai_answer = await generate_tutor_response(
        question_context=question_context,
        user_message=body.user_message
    )

    return TutorAskResponse(answer=ai_answer)