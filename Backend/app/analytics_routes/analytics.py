from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import User, UserRole
from app.rbac import require_roles

from app.analytics_schemas.analytics import AnalyticsProgressResponse
from app.analytics.service import calculate_student_progress


router = APIRouter(
    prefix="/api/analytics",
    tags=["Student Analytics"],
)


@router.get("/progress", response_model=AnalyticsProgressResponse)
def get_student_progress(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.STUDENT)),
):
    """
    Tính analytics cho học sinh hiện tại.
    Logic tính toán được dùng chung với Parent Progress API.
    """
    progress = calculate_student_progress(
        db,
        current_user.id,
    )

    return AnalyticsProgressResponse(
        user_id=current_user.id,
        total_tests=progress["total_tests"],
        total_answered_questions=progress["total_answered_questions"],
        overall_accuracy_percent=progress["overall_accuracy_percent"],
        subject_accuracy=progress["subject_accuracy"],
        daily_scores=progress["daily_scores"],
        score_prediction=progress["score_prediction"],
    )
