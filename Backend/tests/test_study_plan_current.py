from datetime import datetime, timezone
import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.db import Base, SessionLocal, engine
from app.models import User, UserRole, UserStatus, StudyPlan, PlanTask
from app.core.security import create_access_token, hash_password

client = TestClient(app)


@pytest.fixture(scope="module", autouse=True)
def setup_study_plan_test_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Tạo học sinh có lộ trình
    student_with_plan = User(
        email="plan_student@example.com",
        full_name="Plan Student",
        password=hash_password("Password123"),
        role=UserRole.STUDENT.value,
        status=UserStatus.ACTIVE.value,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    # Tạo học sinh chưa có lộ trình
    student_no_plan = User(
        email="no_plan_student@example.com",
        full_name="No Plan Student",
        password=hash_password("Password123"),
        role=UserRole.STUDENT.value,
        status=UserStatus.ACTIVE.value,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    db.add_all([student_with_plan, student_no_plan])
    db.commit()
    db.refresh(student_with_plan)

    # Khởi tạo lộ trình ACTIVE và các Task cho student_with_plan
    active_plan = StudyPlan(
        user_id=student_with_plan.id,
        title="Lộ trình cá nhân hóa - Luyện thi ĐGNL",
        target_score=900.0,
        total_days=30,
        current_day=1,
        status="ACTIVE",
    )
    db.add(active_plan)
    db.commit()
    db.refresh(active_plan)

    task1 = PlanTask(
        plan_id=active_plan.id,
        day_no=1,
        title="Ôn tập kiến thức Toán cơ bản",
        type="READING",
        status="PENDING",
    )
    task2 = PlanTask(
        plan_id=active_plan.id,
        day_no=2,
        title="Luyện tập Logic & Bảng số liệu",
        type="QUIZ",
        status="PENDING",
    )
    db.add_all([task1, task2])
    db.commit()
    db.close()

    yield

    Base.metadata.drop_all(bind=engine)


def get_token(email: str, role: str) -> str:
    db = SessionLocal()
    user = db.query(User).filter(User.email == email).first()
    db.close()
    return create_access_token(user.id, role)


def test_get_current_study_plan_unauthorized():
    """Truy cập endpoint khi chưa đăng nhập sẽ trả về 401."""
    response = client.get("/api/study-plan/current")
    assert response.status_code == 401


def test_get_current_study_plan_not_found():
    """Học sinh chưa có lộ trình ACTIVE sẽ trả về 404."""
    token = get_token("no_plan_student@example.com", UserRole.STUDENT.value)
    response = client.get(
        "/api/study-plan/current",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 404
    assert "Không tìm thấy" in response.json()["detail"]


def test_get_current_study_plan_success():
    """Học sinh có lộ trình ACTIVE sẽ nhận được đầy đủ lộ trình và danh sách Tasks."""
    token = get_token("plan_student@example.com", UserRole.STUDENT.value)
    response = client.get(
        "/api/study-plan/current",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ACTIVE"
    assert data["target_score"] == 900.0
    assert len(data["tasks"]) == 2
    assert data["tasks"][0]["title"] == "Ôn tập kiến thức Toán cơ bản"