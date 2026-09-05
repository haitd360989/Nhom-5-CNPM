from typing import Optional, Dict, Any, List
from pydantic import BaseModel, ConfigDict, Field


class QuestionBase(BaseModel):
    content: str = Field(..., description="Nội dung câu hỏi")
    choices: Dict[str, Any] = Field(..., description="Các lựa chọn dạng JSON / Dict")
    correct_answer: str = Field(..., description="Đáp án đúng (A, B, C, D...)")
    subject: str = Field(..., description="Môn học (vd: Toán học, Logic...)")
    topic: str = Field(..., description="Chủ đề bài học")
    difficulty: str = Field(..., description="Độ khó: EASY, MEDIUM, HARD")
    explanation: Optional[str] = Field(None, description="Lời giải chi tiết")


class QuestionCreate(QuestionBase):
    pass


class QuestionUpdate(BaseModel):
    content: Optional[str] = None
    choices: Optional[Dict[str, Any]] = None
    correct_answer: Optional[str] = None
    subject: Optional[str] = None
    topic: Optional[str] = None
    difficulty: Optional[str] = None
    explanation: Optional[str] = None


class QuestionResponse(QuestionBase):
    model_config = ConfigDict(from_attributes=True)
    id: int


class AnalyticsOverviewResponse(BaseModel):
    total_students: int = Field(..., description="Tổng số học sinh có role='STUDENT'")
    total_completed_tests: int = Field(..., description="Tổng số bài test đã hoàn thành status='COMPLETED'")
    average_score_by_subject: Dict[str, float] = Field(..., description="Điểm trung bình chia theo từng môn học")
    
class TeacherOverviewResponse(BaseModel):
    total_questions: int = Field(..., description="Tổng số câu hỏi")
    questions_by_subject: Dict[str, int] = Field(..., description="Thống kê số câu hỏi theo môn")
    total_students: int = Field(..., description="Tổng số học sinh")
    total_test_attempts: int = Field(..., description="Tổng số lượt làm bài thi")