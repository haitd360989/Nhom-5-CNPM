from typing import List, Optional

from pydantic import BaseModel

from app.analytics_schemas.analytics import (
    DailyScoreItem,
    ScorePrediction,
    SubjectAccuracyItem,
)


class StudentOverviewItem(BaseModel):
    student_id: int
    student_name: str
    target_score: Optional[float] = None
    total_days: Optional[int] = None


class ParentOverviewResponse(BaseModel):
    parent_id: int
    students: List[StudentOverviewItem]


class StudentProgressResponse(BaseModel):
    student_id: int
    student_name: str
    subject_accuracy: List[SubjectAccuracyItem]
    daily_scores: List[DailyScoreItem]
    score_prediction: ScorePrediction
