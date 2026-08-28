from pydantic import BaseModel, ConfigDict, Field
from typing import List, Dict, Optional


class QuestionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    content: str
    choices: Dict[str, str]
    subject: str
    topic: Optional[str] = None
    difficulty: Optional[str] = "MEDIUM"


class AnswerItem(BaseModel):
    question_id: int
    selected_option: str = Field(..., max_length=10, description="Lựa chọn của sinh viên (A, B, C, D)")


class SubmitRequest(BaseModel):
    completion_time_seconds: int = Field(..., ge=1, description="Thời gian làm bài (giây)")
    answers: List[AnswerItem]


class QuestionResult(BaseModel):
    question_id: int
    content: str
    selected_option: Optional[str] = None
    selected_answer: Optional[str] = None
    correct_option: str
    correct_answer: str
    is_correct: bool
    explanation: Optional[str] = None


class SubmitResponse(BaseModel):
    test_id: int
    user_id: int
    raw_score: int
    total_questions: int
    percentage: float
    message: str
    question_results: List[QuestionResult]


class StudyPlanInitRequest(BaseModel):
    target_goal: Optional[str] = Field(default="Luyện thi ĐGNL", max_length=255)
    target_score: Optional[float] = Field(default=850.0, ge=1, le=1200)
    total_days: Optional[int] = Field(default=30, ge=1)


class StudyPlanInitResponse(BaseModel):
    plan_id: int
    user_id: int
    title: str
    status: str
    total_tasks: int


class PlanTaskCurrentResponse(BaseModel):
    id: int
    plan_id: int
    day_no: int
    title: str
    type: str
    ref_id: Optional[int] = None
    status: str
    created_at: Optional[str] = None


class StudyPlanCurrentResponse(BaseModel):
    plan_id: int
    user_id: int
    title: str
    target_score: Optional[float] = None
    total_days: int
    current_day: int
    status: str
    tasks: List[PlanTaskCurrentResponse]
