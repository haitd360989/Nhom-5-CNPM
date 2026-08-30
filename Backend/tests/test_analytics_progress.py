from datetime import datetime, timezone
import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.db import Base, SessionLocal, engine
from app.models import User, UserRole, UserStatus, Question, Test, UserAnswer
from app.core.security import create_access_token, hash_password

client = TestClient(app)


@pytest.fixture(scope="module", autouse=True)
def setup_analytics_test_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Học sinh có dữ liệu bài thi
    student_with_tests = User(
        email="analytics_student@example.com",
        full_name="Analytics Student",
        password=hash_password("Password123"),
        role=UserRole.STUDENT.value,
        status=UserStatus.ACTIVE.value,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    # Học sinh mới chưa làm bài thi nào
    student_empty = User(
        email="empty_student@example.com",
        full_name="Empty Student",
        password=hash_password("Password123"),
        role=UserRole.STUDENT.value,
        status=UserStatus.ACTIVE.value,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    db.add_all([student_with_tests, student_empty])
    db.commit()
    db.refresh(student_with_tests)

    # Tạo 2 câu hỏi thuộc 2 môn: Toán học và Logic
    q_math = Question(
        content="Đạo hàm của $y = x^2$ là gì?",
        choices={"A": "2x", "B": "x", "C": "x^2", "D": "2"},
        correct_answer="A",
        subject="Toán học",
        topic="Đạo hàm",
        difficulty="EASY",
    )
    q_logic = Question(
        content="Mệnh đề kéo theo đúng khi nào?",
        choices={"A": "A", "B": "B"},
        correct_answer="A",
        subject="Logic",
        topic="Mệnh đề",
        difficulty="MEDIUM",
    )
    db.add_all([q_math, q_logic])
    db.commit()
    db.refresh(q_math)
    db.refresh(q_logic)

    # Tạo 1 bài thi COMPLETED 100 điểm
    test1 = Test(
        user_id=student_with_tests.id,
        score=100.0,
        status="COMPLETED",
        completed_at=datetime.now(timezone.utc),
    )
    db.add(test1)
    db.commit()
    db.refresh(test1)

    # Lưu 2 câu trả lời đúng
    ans1 = UserAnswer(test_id=test1.id, question_id=q_math.id, user_answer="A", is_correct=True)
    ans2 = UserAnswer(test_id=test1.id, question_id=q_logic.id, user_answer="A", is_correct=True)
    db.add_all([ans1, ans2])
    db.commit()
    db.close()

    yield

    Base.metadata.drop_all(bind=engine)


def get_token(email: str, role: str) -> str:
    db = SessionLocal()
    user = db.query(User).filter(User.email == email).first()
    db.close()
    return create_access_token(user.id, role)


def test_get_progress_unauthorized():
    """Chưa đăng nhập trả về 401."""
    response = client.get("/api/analytics/progress")
    assert response.status_code == 401


def test_get_progress_empty_student():
    """Học sinh mới chưa làm bài trả về cấu trúc rỗng mặc định."""
    token = get_token("empty_student@example.com", UserRole.STUDENT.value)
    response = client.get(
        "/api/analytics/progress",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["total_tests"] == 0
    assert data["overall_accuracy_percent"] == 0.0
    assert data["subject_accuracy"] == []
    assert data["score_prediction"]["s_predict"] is None


def test_get_progress_with_data_success():
    """Học sinh đã làm bài trả về phân tích độ chính xác theo môn và điểm dự đoán."""
    token = get_token("analytics_student@example.com", UserRole.STUDENT.value)
    response = client.get(
        "/api/analytics/progress",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["total_tests"] == 1
    assert data["total_answered_questions"] == 2
    assert data["overall_accuracy_percent"] == 100.0

    subjects = {item["subject"]: item["accuracy_percent"] for item in data["subject_accuracy"]}
    assert "Toán học" in subjects
    assert subjects["Toán học"] == 100.0
    assert "Logic" in subjects

    assert data["score_prediction"]["s_predict"] == 1200.0
    assert data["score_prediction"]["range_min"] is not None