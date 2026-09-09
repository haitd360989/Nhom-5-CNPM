import pytest
from fastapi import status
from fastapi.testclient import TestClient

from app.main import app
import app.models as models
from app.models import User, UserRole, UserStatus, StudentParent
from app.db import Base, engine, SessionLocal
from app.core.security import create_access_token, hash_password

client = TestClient(app)

@pytest.fixture(scope="session", autouse=True)
def setup_database_tables():
    """Tự động khởi tạo cấu trúc bảng trong DB test trước khi chạy test case."""
    Base.metadata.create_all(bind=engine)
    yield

@pytest.fixture
def db_session():
    """Cung cấp session DB test và tự động dọn dẹp sau khi chạy."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@pytest.fixture
def auth_headers(db_session):
    """Fixture tạo các header xác thực theo Role để kiểm thử RBAC."""
    def _create_header(email: str, role: UserRole, full_name: str):
        user = db_session.query(User).filter(User.email == email).first()
        if not user:
            role_val = role.value if hasattr(role, "value") else str(role)
            status_val = UserStatus.ACTIVE.value if hasattr(UserStatus.ACTIVE, "value") else "ACTIVE"
            user = User(
                email=email,
                full_name=full_name,
                password=hash_password("Password123"),
                role=role_val,
                status=status_val
            )
            db_session.add(user)
            db_session.commit()
            db_session.refresh(user)
        token = create_access_token(user.id, user.role)
        return {"Authorization": f"Bearer {token}"}, user

    return _create_header


def test_parent_endpoints_unauthorized():
    """Kiểm tra không truyền token xác thực -> trả về 401 Unauthorized."""
    resp_overview = client.get("/api/parent/overview")
    resp_progress = client.get("/api/parent/progress")
    assert resp_overview.status_code == status.HTTP_401_UNAUTHORIZED
    assert resp_progress.status_code == status.HTTP_401_UNAUTHORIZED


def test_parent_endpoints_forbidden_for_student(auth_headers):
    """Kiểm tra tài khoản STUDENT truy cập endpoint PARENT -> trả về 403 Forbidden."""
    headers, _ = auth_headers("test_student_rbac@example.com", UserRole.STUDENT, "Student RBAC Test")
    
    resp_overview = client.get("/api/parent/overview", headers=headers)
    resp_progress = client.get("/api/parent/progress", headers=headers)
    assert resp_overview.status_code == status.HTTP_403_FORBIDDEN
    assert resp_progress.status_code == status.HTTP_403_FORBIDDEN


def test_parent_without_children_returns_empty_or_404(auth_headers, db_session):
    """Kiểm tra tài khoản PARENT mới chưa liên kết học sinh nào."""
    headers, parent_user = auth_headers("parent_empty@example.com", UserRole.PARENT, "Parent Solo")
    
    # Xóa liên kết cũ nếu tồn tại trong student_parents
    db_session.query(StudentParent).filter(StudentParent.parent_id == parent_user.id).delete()
    db_session.commit()

    response = client.get("/api/parent/overview", headers=headers)
    assert response.status_code in [status.HTTP_200_OK, status.HTTP_404_NOT_FOUND]
    if response.status_code == status.HTTP_200_OK:
        data = response.json()
        assert "students" in data
        assert len(data["students"]) == 0


def test_parent_overview_and_progress_success(auth_headers, db_session):
    """Kiểm tra tài khoản PARENT có liên kết học sinh -> trả về 200 OK và đúng schema."""
    parent_headers, parent_user = auth_headers("parent_valid@example.com", UserRole.PARENT, "Parent Main")
    _, student_user = auth_headers("student_child@example.com", UserRole.STUDENT, "Child Student")

    # Đảm bảo có bản ghi liên kết giữa parent và student
    link = db_session.query(StudentParent).filter(
        StudentParent.parent_id == parent_user.id,
        StudentParent.student_id == student_user.id
    ).first()
    if not link:
        link = StudentParent(parent_id=parent_user.id, student_id=student_user.id)
        db_session.add(link)
        db_session.commit()

    # 1. Test GET /api/parent/overview
    resp_overview = client.get("/api/parent/overview", headers=parent_headers)
    assert resp_overview.status_code == status.HTTP_200_OK
    overview_data = resp_overview.json()
    assert "parent_id" in overview_data
    assert "students" in overview_data
    assert any(s["student_id"] == student_user.id for s in overview_data["students"])

    # 2. Test GET /api/parent/progress
    resp_progress = client.get("/api/parent/progress", headers=parent_headers)
    assert resp_progress.status_code == status.HTTP_200_OK
    progress_data = resp_progress.json()
    assert isinstance(progress_data, list)
    assert len(progress_data) > 0
    child_entry = progress_data[0]
    assert "student_id" in child_entry
    assert "subject_accuracy" in child_entry
    assert "daily_scores" in child_entry
    assert "score_prediction" in child_entry