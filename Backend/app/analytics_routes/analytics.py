from collections import defaultdict
from statistics import mean, pstdev
from typing import Dict, List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import Question, Test, User, UserAnswer, UserRole
from app.rbac import require_roles
from app.analytics_schemas.analytics import (
    AnalyticsProgressResponse,
    DailyScoreItem,
    ScorePrediction,
    SubjectAccuracyItem,
)

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
    Tính analytics cho học sinh hiện tại từ tests, user_answers và questions.

    - accuracy theo từng subject
    - danh sách điểm theo ngày
    - S-predict dạng baseline trên thang 1200

    Lưu ý: database hiện tại không có tests.type nên endpoint dùng
    toàn bộ Test COMPLETED của current_user.
    """
    completed_tests = (
        db.query(Test)
        .filter(
            Test.user_id == current_user.id,
            Test.status == "COMPLETED",
        )
        .order_by(Test.completed_at.asc(), Test.id.asc())
        .all()
    )

    if not completed_tests:
        return AnalyticsProgressResponse(
            user_id=current_user.id,
            total_tests=0,
            total_answered_questions=0,
            overall_accuracy_percent=0.0,
            subject_accuracy=[],
            daily_scores=[],
            score_prediction=ScorePrediction(
                s_predict=None,
                range_min=None,
                range_max=None,
                basis="Chưa có bài kiểm tra COMPLETED để phân tích.",
            ),
        )

    test_ids = [test.id for test in completed_tests]

    answer_rows = (
        db.query(
            UserAnswer.test_id,
            UserAnswer.is_correct,
            Question.subject,
        )
        .join(
            Question,
            Question.id == UserAnswer.question_id,
        )
        .filter(UserAnswer.test_id.in_(test_ids))
        .all()
    )

    total_answers = len(answer_rows)
    correct_answers = sum(
        1 for row in answer_rows if bool(row.is_correct)
    )

    overall_accuracy_percent = (
        round((correct_answers / total_answers) * 100, 2)
        if total_answers
        else 0.0
    )

    subject_totals: Dict[str, int] = defaultdict(int)
    subject_correct: Dict[str, int] = defaultdict(int)

    for row in answer_rows:
        subject = row.subject or "Không xác định"
        subject_totals[subject] += 1

        if bool(row.is_correct):
            subject_correct[subject] += 1

    subject_accuracy = [
        SubjectAccuracyItem(
            subject=subject,
            total_answers=subject_totals[subject],
            correct_answers=subject_correct.get(subject, 0),
            accuracy_percent=round(
                (
                    subject_correct.get(subject, 0)
                    / subject_totals[subject]
                ) * 100,
                2,
            ),
        )
        for subject in sorted(subject_totals)
    ]

    daily_scores: List[DailyScoreItem] = []

    for test in completed_tests:
        if test.completed_at is None:
            continue

        daily_scores.append(
            DailyScoreItem(
                date=test.completed_at.date().isoformat(),
                score=float(test.score or 0),
            )
        )

    recent_percentages = [
        float(test.score or 0)
        for test in completed_tests[-10:]
    ]

    recent_exam_scores = [
        max(0.0, min(1200.0, score * 12.0))
        for score in recent_percentages
    ]

    if recent_exam_scores:
        predicted_score = round(mean(recent_exam_scores))

        spread = (
            pstdev(recent_exam_scores)
            if len(recent_exam_scores) > 1
            else 0.0
        )

        margin = max(50, round(spread))

        range_min = max(
            0,
            int(predicted_score - margin),
        )
        range_max = min(
            1200,
            int(predicted_score + margin),
        )
    else:
        predicted_score = None
        range_min = None
        range_max = None

    return AnalyticsProgressResponse(
        user_id=current_user.id,
        total_tests=len(completed_tests),
        total_answered_questions=total_answers,
        overall_accuracy_percent=overall_accuracy_percent,
        subject_accuracy=subject_accuracy,
        daily_scores=daily_scores,
        score_prediction=ScorePrediction(
            s_predict=(
                float(predicted_score)
                if predicted_score is not None
                else None
            ),
            range_min=range_min,
            range_max=range_max,
            basis=(
                "Baseline: trung bình 10 bài COMPLETED gần nhất, "
                "quy đổi từ phần trăm sang thang 1200; "
                "dải điểm dùng độ lệch chuẩn quan sát được."
            ),
        ),
    )
