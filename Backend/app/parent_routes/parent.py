from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import (
    StudentParent,
    StudyPlan,
    User,
    UserRole,
)
from app.parent_schemas.parent import (
    ParentOverviewResponse,
    StudentOverviewItem,
    StudentProgressResponse,
)
from app.rbac import require_roles
from app.analytics.service import calculate_student_progress


router = APIRouter(
    prefix="/api/parent",
    tags=["Parent Analytics"],
)


def _get_student_ids(
    db: Session,
    parent_id: int,
) -> List[int]:
    student_ids = [
        row.student_id
        for row in (
            db.query(StudentParent)
            .filter(StudentParent.parent_id == parent_id)
            .order_by(StudentParent.student_id.asc())
            .all()
        )
    ]

    if not student_ids:
        raise HTTPException(
            status_code=404,
            detail="Phụ huynh chưa được liên kết với học sinh.",
        )

    return student_ids


def _get_latest_active_plan(
    db: Session,
    student_id: int,
):
    return (
        db.query(StudyPlan)
        .filter(
            StudyPlan.user_id == student_id,
            StudyPlan.status == "ACTIVE",
        )
        .order_by(
            StudyPlan.updated_at.desc(),
            StudyPlan.id.desc(),
        )
        .first()
    )


@router.get(
    "/overview",
    response_model=ParentOverviewResponse,
)
def get_parent_overview(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.PARENT, UserRole.ADMIN)
    ),
):
    student_ids = _get_student_ids(
        db,
        current_user.id,
    )

    students = (
        db.query(User)
        .filter(User.id.in_(student_ids))
        .all()
    )

    student_map = {
        student.id: student
        for student in students
    }

    result = []

    for student_id in student_ids:
        student = student_map.get(student_id)

        # Relationship may reference a deleted/missing user in
        # test data; skip that orphan row instead of returning it.
        if student is None:
            continue

        plan = _get_latest_active_plan(
            db,
            student.id,
        )

        result.append(
            StudentOverviewItem(
                student_id=student.id,
                student_name=student.full_name,
                target_score=(
                    float(plan.target_score)
                    if plan and plan.target_score is not None
                    else None
                ),
                total_days=(
                    plan.total_days
                    if plan is not None
                    else None
                ),
            )
        )

    if not result:
        raise HTTPException(
            status_code=404,
            detail="Không tìm thấy học sinh được liên kết.",
        )

    return ParentOverviewResponse(
        parent_id=current_user.id,
        students=result,
    )


@router.get(
    "/progress",
    response_model=List[StudentProgressResponse],
)
def get_parent_progress(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.PARENT, UserRole.ADMIN)
    ),
):
    student_ids = _get_student_ids(
        db,
        current_user.id,
    )

    students = (
        db.query(User)
        .filter(User.id.in_(student_ids))
        .all()
    )

    student_map = {
        student.id: student
        for student in students
    }

    result = []

    for student_id in student_ids:
        student = student_map.get(student_id)

        if student is None:
            continue

        progress = calculate_student_progress(
            db,
            student.id,
        )

        result.append(
            StudentProgressResponse(
                student_id=student.id,
                student_name=student.full_name,
                subject_accuracy=progress["subject_accuracy"],
                daily_scores=progress["daily_scores"],
                score_prediction=progress["score_prediction"],
            )
        )

    if not result:
        raise HTTPException(
            status_code=404,
            detail="Không tìm thấy học sinh được liên kết.",
        )

    return result
