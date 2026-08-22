import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pytest
from unittest.mock import AsyncMock, patch
from fastapi.testclient import TestClient
from app.main import app
import app.rbac as rbac_module
from app.models import UserRole, UserStatus

# Class giả lập User hợp lệ vượt qua RBAC
class DummyUser:
    def __init__(self):
        self.id = 1
        self.role = UserRole.STUDENT
        self.status = UserStatus.ACTIVE.value if hasattr(UserStatus.ACTIVE, 'value') else UserStatus.ACTIVE

mock_student_user = DummyUser()

# Ghi đè require_roles để bypass middleware phân quyền
def mock_require_roles(*roles):
    def dependency():
        return mock_student_user
    return dependency

if hasattr(rbac_module, "get_current_user"):
    app.dependency_overrides[rbac_module.get_current_user] = lambda: mock_student_user
if hasattr(rbac_module, "require_roles"):
    app.dependency_overrides[rbac_module.require_roles] = mock_require_roles

client = TestClient(app)


@patch("app.routes.generate_tutor_response", new_callable=AsyncMock)
def test_ask_ai_tutor_success(mock_generate):
    mock_generate.return_value = "Đây là lời giải chi tiết cho câu hỏi của bạn."

    payload = {
        "user_message": "Hướng dẫn em giải câu này với ạ",
        "question_id": 1
    }

    headers = {"Authorization": "Bearer fake_token"}
    response = client.post("/api/v1/rbac/tutor/ask", json=payload, headers=headers)
    assert response.status_code == 200


@patch("app.routes.generate_tutor_response", new_callable=AsyncMock)
def test_ask_ai_tutor_without_question_id(mock_generate):
    mock_generate.return_value = "Tôi có thể giúp gì cho bạn?"

    # Truyền None cho question_id thay vì bỏ hẳn để khớp validation
    payload = {
        "user_message": "Chào AI tutor",
        "question_id": None
    }

    headers = {"Authorization": "Bearer fake_token"}
    response = client.post("/api/v1/rbac/tutor/ask", json=payload, headers=headers)
    assert response.status_code == 200