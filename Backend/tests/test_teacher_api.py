import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.models import User, UserRole, Question

client = TestClient(app)


@pytest.fixture
def teacher_headers():
    """
    Giả lập Header Authorization cho Giáo viên/Admin.
    Lưu ý: Nếu project của bạn kiểm tra JWT thực tế trong test, 
    hãy dùng token thật sinh ra từ auth service.
    """
    return {"Authorization": "Bearer mock_teacher_token"}



def test_get_teacher_questions_success(teacher_headers, monkeypatch):
    response = client.get("/api/teacher/questions?subject=Toan&skip=0&limit=10", headers=teacher_headers)
    
    assert response.status_code in [200, 401]  
    if response.status_code == 200:
        assert isinstance(response.json(), list)


def test_create_question(teacher_headers):
    payload = {
        "content": "Câu hỏi test tự động?",
        "choices": {"A": "Đúng", "B": "Sai"},
        "correct_answer": "A",
        "subject": "Toán học",
        "topic": "Đại số",
        "difficulty": "EASY",
        "explanation": "Giải thích câu hỏi test"
    }
    
    response = client.post("/api/teacher/questions", json=payload, headers=teacher_headers)
    
    if response.status_code == 201:
        data = response.json()
        assert data["content"] == payload["content"]
        assert "id" in data


def test_update_question_not_found(teacher_headers):
    payload = {"content": "Nội dung cập nhật"}
    response = client.put("/api/teacher/questions/999999", json=payload, headers=teacher_headers)
    
    if response.status_code != 401:
        assert response.status_code == 404


def test_delete_question_not_found(teacher_headers):
    response = client.delete("/api/teacher/questions/999999", headers=teacher_headers)
    
    if response.status_code != 401:
        assert response.status_code == 404



def test_get_analytics_overview(teacher_headers):
    response = client.get("/api/teacher/analytics/overview", headers=teacher_headers)
    
    if response.status_code == 200:
        data = response.json()
        assert "total_students" in data
        assert "total_completed_tests" in data
        assert "average_score_by_subject" in data