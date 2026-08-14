from datetime import datetime
from typing import Optional, List, Any
from pydantic import BaseModel, Field

class QuestionModel(BaseModel):
    id: Optional[int] = None
    content: str
    options: List[str]        
    correct_option: int         
    category: Optional[str] = "General"
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class UserAnswerModel(BaseModel):
    id: Optional[int] = None
    user_id: str
    question_id: int
    selected_option: int
    is_correct: bool
    completion_time_seconds: Optional[int] = 0
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class StudyPlanModel(BaseModel):
    id: Optional[int] = None
    user_id: str
    title: str
    description: Optional[str] = None
    overall_score: Optional[float] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class PlanTaskModel(BaseModel):
    id: Optional[int] = None
    plan_id: int
    title: str
    status: Optional[str] = "pending"
    due_week: Optional[int] = 1
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True