from pydantic import BaseModel, ConfigDict, Field
from typing import Dict, List, Optional


class QuestionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    content: str
    choices: Dict[str, str]
    subject: str
    topic: Optional[str] = None
    difficulty: Optional[str] = "MEDIUM"
    explanation: Optional[str] = None


class AnswerItem(BaseModel):
    question_id: int
    selected_option: str = Field(
        ...,
        max_length=10,
        description="Lựa chọn của sinh viên (A, B, C, D)",
    )


class SubmitRequest(BaseModel):
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
    test_type: str
    raw_score: int
    total_questions: int
    percentage: float
    message: str
    question_results: List[QuestionResult]


class HistoryItem(BaseModel):
    test_id: int
    user_id: int
    test_type: str
    score: float
    status: str
    started_at: Optional[str] = None
    completed_at: Optional[str] = None
    total_questions: int
    correct_answers: int
