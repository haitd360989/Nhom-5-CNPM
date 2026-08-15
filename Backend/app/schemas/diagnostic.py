from pydantic import BaseModel, ConfigDict, Field
from typing import List, Dict, Optional

# --- Response / Request Models cho Diagnostic & Study Plan ---

class QuestionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    content: str
    options: Dict[str, str]
    category: str

class AnswerItem(BaseModel):
    question_id: int
    selected_option: str = Field(..., max_length=10, description="Lựa chọn của sinh viên (A, B, C, D)")

class SubmitRequest(BaseModel):
    completion_time_seconds: int = Field(..., ge=1, description="Thời gian làm bài (giây)")
    answers: List[AnswerItem]

class SubmitResponse(BaseModel):
    user_id: int
    raw_score: int
    total_questions: int
    percentage: float
    message: str

class StudyPlanInitRequest(BaseModel):
    target_goal: Optional[str] = Field(default="Luyện thi ĐGNL", max_length=255)

class StudyPlanInitResponse(BaseModel):
    plan_id: int
    user_id: int
    title: str
    status: str
    total_tasks: int