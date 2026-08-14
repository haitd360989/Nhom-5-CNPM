from pydantic import BaseModel
from typing import List, Optional

class QuestionOut(BaseModel):
    id: int
    content: str
    options: List[str]
    category: str

class SingleAnswer(BaseModel):
    question_id: int
    selected_option: int

class SubmitRequest(BaseModel):
    user_id: str
    completion_time_seconds: int
    answers: List[SingleAnswer]

class SubmitResponse(BaseModel):
    user_id: str
    total_questions: int
    correct_count: int
    score_percentage: float

class StudyPlanInitRequest(BaseModel):
    user_id: str
    score_percentage: float

class TaskOut(BaseModel):
    title: str
    due_week: int

class StudyPlanInitResponse(BaseModel):
    plan_id: int
    user_id: str
    title: str
    tasks: List[TaskOut]