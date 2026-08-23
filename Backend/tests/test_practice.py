import os
import sys
from datetime import datetime, timezone

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.db import Base, SessionLocal, engine
from app.models import User, UserRole, UserStatus, Question, Test, UserAnswer
from app.core.security import create_access_token, hash_password

client = TestClient(app)


@pytest.fixture(scope="module", autouse=True)
def setup_practice_test_database():
    """Khởi tạo bảng và seed dữ liệu mẫu vào database test trước khi chạy suite."""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Tạo học sinh và giáo viên mẫu
    student = User(
        email="practice_student@example.com",
        full_name="Practice Student",
        password=hash_password("Password123"),
        role=UserRole.STUDENT.value,
        status=UserStatus.ACTIVE.value,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    teacher = User(
        email="practice_teacher@example.com",
        full_name="Practice Teacher",
        password=hash_password("Password123"),
        role=UserRole.TEACHER.value,
        status=UserStatus.ACTIVE.value,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    db.add_all([student, teacher])
    db.commit()
    db.refresh(student)

    # Tạo danh sách câu hỏi mẫu cho Practice
    q1 = Question(
        content="Tính tích phân $I = \\int_0^1 (2x + 1) dx$.",
        choices={"A": "1", "B": "2", "C": "3", "D": "4"},
        correct_answer="B",
        subject="Toán học",
        topic="Tích phân",
        difficulty="EASY",
        explanation="Nguyên hàm là $x^2 + x$, thay cận từ 0 đến 1 được 2.",
    )
    q2 = Question(
        content="Tìm số tiếp theo trong dãy số: 2, 6, 12, 20, 30, ...",
        choices={"A": "36", "B": "40", "C": "42", "D": "48"},
        correct_answer="C",
        subject="Logic",
        topic="Quy luật số",
        difficulty="MEDIUM",
        explanation="Hiệu giữa hai số tăng dần: +4, +6, +8, +10, +12 => 42.",
    )
    db.add_all([q1, q2])
    db.commit()
    db.close()

    yield

    Base.metadata.drop_all(bind=engine)


def get_token(email: str, role: str) -> str:
    db = SessionLocal()
    user = db.query(User).filter(User.email == email).first()
    db.close()
    return create_access_token(user.id, role)


def test_get_practice_questions_unauthorized():
    """Không có Token sẽ trả về 401."""
    response = client.get("/api/practice/questions")
    assert response.status_code == 401


def test_get_practice_questions_role_restriction():
    """TEACHER truy cập endpoint của STUDENT sẽ bị 403."""
    token = get_token("practice_teacher@example.com", UserRole.TEACHER.value)
    response = client.get(
        "/api/practice/questions",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 403


def test_get_practice_questions_success_with_filter():
    """STUDENT lấy danh sách câu hỏi và lọc theo môn học thành công."""
    token = get_token("practice_student@example.com", UserRole.STUDENT.value)
    response = client.get(
        "/api/practice/questions?subject=Toán học&limit=5",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert data[0]["subject"] == "Toán học"
    assert "choices" in data[0]


def test_submit_practice_scoring_and_persistence():
    """Chấm điểm bài làm luyện tập và lưu vào tests / user_answers."""
    token = get_token("practice_student@example.com", UserRole.STUDENT.value)
    db = SessionLocal()
    questions = db.query(Question).all()
    q1_id = questions[0].id
    q2_id = questions[1].id
    db.close()

    # Nộp 1 câu đúng và 1 câu sai
    payload = {
        "answers": [
            {"question_id": q1_id, "selected_option": "B"},  # Đúng
            {"question_id": q2_id, "selected_option": "A"},  # Sai (Đáp án đúng là C)
        ]
    }

    response = client.post(
        "/api/practice/submit",
        json=payload,
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 201
    body = response.json()
    assert body["test_type"] == "PRACTICE"
    assert body["raw_score"] == 1
    assert body["total_questions"] == 2
    assert body["percentage"] == 50.0
    assert len(body["question_results"]) == 2
    assert body["question_results"][0]["is_correct"] is True
    assert body["question_results"][1]["is_correct"] is False


def test_get_practice_history():
    """Kiểm tra lấy lịch sử các bài thi luyện tập đã hoàn thành."""
    token = get_token("practice_student@example.com", UserRole.STUDENT.value)
    response = client.get(
        "/api/practice/history",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert data[0]["test_type"] == "PRACTICE"
    assert data[0]["total_questions"] == 2
    assert data[0]["correct_answers"] == 1