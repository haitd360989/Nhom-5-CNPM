# import sys
# import os
# sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# import pytest
# from unittest.mock import AsyncMock, patch
# from fastapi.testclient import TestClient
# from app.main import app
# import app.rbac as rbac_module
# from app.models import UserRole, UserStatus

# # Class giả lập User hợp lệ vượt qua RBAC
# class DummyUser:
#     def __init__(self):
#         self.id = 1
#         self.role = UserRole.STUDENT
#         self.status = UserStatus.ACTIVE.value if hasattr(UserStatus.ACTIVE, 'value') else UserStatus.ACTIVE

# mock_student_user = DummyUser()

# # Ghi đè require_roles để bypass middleware phân quyền
# def mock_require_roles(*roles):
#     def dependency():
#         return mock_student_user
#     return dependency

# if hasattr(rbac_module, "get_current_user"):
#     app.dependency_overrides[rbac_module.get_current_user] = lambda: mock_student_user
# if hasattr(rbac_module, "require_roles"):
#     app.dependency_overrides[rbac_module.require_roles] = mock_require_roles

# client = TestClient(app)


# @patch("app.routes.generate_tutor_response", new_callable=AsyncMock)
# def test_ask_ai_tutor_success(mock_generate):
#     mock_generate.return_value = "Đây là lời giải chi tiết cho câu hỏi của bạn."

#     payload = {
#         "user_message": "Hướng dẫn em giải câu này với ạ",
#         "question_id": 1
#     }

#     headers = {"Authorization": "Bearer fake_token"}
#     response = client.post("/api/v1/rbac/tutor/ask", json=payload, headers=headers)
#     assert response.status_code == 200


# @patch("app.routes.generate_tutor_response", new_callable=AsyncMock)
# def test_ask_ai_tutor_without_question_id(mock_generate):
#     mock_generate.return_value = "Tôi có thể giúp gì cho bạn?"

#     # Truyền None cho question_id thay vì bỏ hẳn để khớp validation
#     payload = {
#         "user_message": "Chào AI tutor",
#         "question_id": None
#     }

#     headers = {"Authorization": "Bearer fake_token"}
#     response = client.post("/api/v1/rbac/tutor/ask", json=payload, headers=headers)
#     assert response.status_code == 200



import os
import sys
from datetime import datetime, timezone
from unittest.mock import AsyncMock, patch

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.db import Base, SessionLocal, engine
from app.models import User, UserRole, UserStatus, Question
from app.core.security import create_access_token, hash_password

client = TestClient(app)


@pytest.fixture(scope="module", autouse=True)
def setup_tutor_test_database():
    """Khởi tạo database test và nạp câu hỏi cho AI Tutor."""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    student = User(
        email="tutor_student@example.com",
        full_name="Tutor Student",
        password=hash_password("Password123"),
        role=UserRole.STUDENT.value,
        status=UserStatus.ACTIVE.value,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    parent = User(
        email="tutor_parent@example.com",
        full_name="Tutor Parent",
        password=hash_password("Password123"),
        role=UserRole.PARENT.value,
        status=UserStatus.ACTIVE.value,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    db.add_all([student, parent])
    db.commit()

    sample_question = Question(
        id=101,
        content="Cho hàm số $y = x^3 - 3x + 2$. Tìm giá trị cực đại.",
        choices={"A": "2", "B": "4", "C": "0", "D": "1"},
        correct_answer="B",
        subject="Toán học",
        topic="Hàm số",
        difficulty="MEDIUM",
        explanation="Đạo hàm $y' = 3x^2 - 3 = 0$. Cực đại tại $x = -1, y = 4$.",
    )
    db.add(sample_question)
    db.commit()
    db.close()

    yield

    Base.metadata.drop_all(bind=engine)


def get_token(email: str, role: str) -> str:
    db = SessionLocal()
    user = db.query(User).filter(User.email == email).first()
    db.close()
    return create_access_token(user.id, role)


def test_ask_ai_tutor_unauthorized():
    """Không truyền Token vào endpoint AI Tutor sẽ bị 401."""
    payload = {"question_id": 101, "user_message": "Giải thích câu này giúp em."}
    response = client.post("/api/v1/rbac/tutor/ask", json=payload)
    assert response.status_code == 401


def test_ask_ai_tutor_forbidden_role():
    """Tài khoản PARENT không có quyền hỏi AI Tutor, trả về 403."""
    token = get_token("tutor_parent@example.com", UserRole.PARENT.value)
    payload = {"question_id": 101, "user_message": "Con tôi làm bài này thế nào?"}
    response = client.post(
        "/api/v1/rbac/tutor/ask",
        json=payload,
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 403


@patch("app.routes.generate_tutor_response", new_callable=AsyncMock)
def test_ask_ai_tutor_with_question_context_success(mock_generate):
    """Học sinh gửi thắc mắc kèm question_id, AI lấy đúng ngữ cảnh đề bài và trả lời 200."""
    mock_generate.return_value = "Chào em, để tìm cực đại ta tính đạo hàm $y' = 3x^2 - 3 = 0$."

    token = get_token("tutor_student@example.com", UserRole.STUDENT.value)
    payload = {
        "question_id": 101,
        "user_message": "Tại sao cực đại lại là 4 ạ?",
    }

    response = client.post(
        "/api/v1/rbac/tutor/ask",
        json=payload,
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "answer" in data
    assert "Chào em" in data["answer"]

    # Xác minh hàm generate_tutor_response được gọi kèm ngữ cảnh câu 101
    mock_generate.assert_called_once()
    called_context = mock_generate.call_args[1]["question_context"]
    assert "Môn học: Toán học" in called_context
    assert "Tìm giá trị cực đại" in called_context


def test_ask_ai_tutor_question_not_found():
    """Truyền ID câu hỏi không tồn tại sẽ trả về lỗi 404."""
    token = get_token("tutor_student@example.com", UserRole.STUDENT.value)
    payload = {
        "question_id": 99999,
        "user_message": "Câu hỏi này làm sao?",
    }

    response = client.post(
        "/api/v1/rbac/tutor/ask",
        json=payload,
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 404