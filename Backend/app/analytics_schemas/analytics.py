from typing import List, Optional

from pydantic import BaseModel


class SubjectAccuracyItem(BaseModel):
    subject: str
    total_answers: int
    correct_answers: int
    accuracy_percent: float


class DailyScoreItem(BaseModel):
    date: str
    score: float


class ScorePrediction(BaseModel):
    s_predict: Optional[float] = None
    range_min: Optional[int] = None
    range_max: Optional[int] = None
    basis: str


class AnalyticsProgressResponse(BaseModel):
    user_id: int
    total_tests: int
    total_answered_questions: int
    overall_accuracy_percent: float
    subject_accuracy: List[SubjectAccuracyItem]
    daily_scores: List[DailyScoreItem]
    score_prediction: ScorePrediction
