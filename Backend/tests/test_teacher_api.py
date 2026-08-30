# import pytest
# from fastapi.testclient import TestClient
# from app.main import app
# from app.models import User, UserRole, Question

# client = TestClient(app)


# @pytest.fixture
# def teacher_headers():
#     """
#     Giả lập Header Authorization cho Giáo viên/Admin.
#     Lưu ý: Nếu project của bạn kiểm tra JWT thực tế trong test, 
#     hãy dùng token thật sinh ra từ auth service.
#     """
#     return {"Authorization": "Bearer mock_teacher_token"}



# def test_get_teacher_questions_success(teacher_headers, monkeypatch):
#     response = client.get("/api/teacher/questions?subject=Toan&skip=0&limit=10", headers=teacher_headers)
    
#     assert response.status_code in [200, 401]  
#     if response.status_code == 200:
#         assert isinstance(response.json(), list)


# def test_create_question(teacher_headers):
#     payload = {
#         "content": "Câu hỏi test tự động?",
#         "choices": {"A": "Đúng", "B": "Sai"},
#         "correct_answer": "A",
#         "subject": "Toán học",
#         "topic": "Đại số",
#         "difficulty": "EASY",
#         "explanation": "Giải thích câu hỏi test"
#     }
    
#     response = client.post("/api/teacher/questions", json=payload, headers=teacher_headers)
    
#     if response.status_code == 201:
#         data = response.json()
#         assert data["content"] == payload["content"]
#         assert "id" in data


# def test_update_question_not_found(teacher_headers):
#     payload = {"content": "Nội dung cập nhật"}
#     response = client.put("/api/teacher/questions/999999", json=payload, headers=teacher_headers)
    
#     if response.status_code != 401:
#         assert response.status_code == 404


# def test_delete_question_not_found(teacher_headers):
#     response = client.delete("/api/teacher/questions/999999", headers=teacher_headers)
    
#     if response.status_code != 401:
#         assert response.status_code == 404



# def test_get_analytics_overview(teacher_headers):
#     response = client.get("/api/teacher/analytics/overview", headers=teacher_headers)
    
#     if response.status_code == 200:
#         data = response.json()
#         assert "total_students" in data
#         assert "total_completed_tests" in data
#         assert "average_score_by_subject" in data


from datetime import datetime, timezone
import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.db import Base, SessionLocal, engine
from app.models import User, UserRole, UserStatus, Question, Test
from app.core.security import create_access_token, hash_password

client = TestClient(app)


@pytest.fixture(scope="module", autouse=True)
def setup_teacher_test_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    teacher = User(
        email="teacher_suite@example.com",
        full_name="Teacher Suite",
        password=hash_password("Password123"),
        role=UserRole.TEACHER.value,
        status=UserStatus.ACTIVE.value,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    student = User(
        email="student_forbidden@example.com",
        full_name="Student Forbidden",
        password=hash_password("Password123"),
        role=UserRole.STUDENT.value,
        status=UserStatus.ACTIVE.value,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    db.add_all([teacher, student])
    db.commit()
    db.refresh(teacher)

    q1 = Question(
        content="Câu hỏi mẫu của giáo viên số 1?",
        choices={"A": "Đáp án A", "B": "Đáp án B"},
        correct_answer="A",
        subject="Toán học",
        topic="Hàm số",
        difficulty="EASY",
        explanation="Lời giải mẫu 1",
    )
    test1 = Test(
        user_id=student.id,
        score=80.0,
        status="COMPLETED",
        completed_at=datetime.now(timezone.utc),
    )
    db.add_all([q1, test1])
    db.commit()
    db.close()

    yield

    Base.metadata.drop_all(bind=engine)


def get_token(email: str, role: str) -> str:
    db = SessionLocal()
    user = db.query(User).filter(User.email == email).first()
    db.close()
    return create_access_token(user.id, role)


def test_teacher_endpoints_forbidden_for_student():
    """Học sinh cố tình truy cập Teacher API sẽ bị trả về 403 Forbidden."""
    token = get_token("student_forbidden@example.com", UserRole.STUDENT.value)
    headers = {"Authorization": f"Bearer {token}"}

    res_get = client.get("/api/teacher/questions", headers=headers)
    assert res_get.status_code == 403

    res_overview = client.get("/api/teacher/analytics/overview", headers=headers)
    assert res_overview.status_code == 403


def test_get_teacher_questions_with_filters():
    """Giáo viên lấy danh sách câu hỏi có lọc môn và phân trang thành công."""
    token = get_token("teacher_suite@example.com", UserRole.TEACHER.value)
    headers = {"Authorization": f"Bearer {token}"}

    response = client.get("/api/teacher/questions?subject=Toán học&skip=0&limit=10", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert data[0]["subject"] == "Toán học"


def test_create_update_delete_question_crud_flow():
    """Kiểm thử toàn bộ vòng đời CRUD câu hỏi của giáo viên."""
    token = get_token("teacher_suite@example.com", UserRole.TEACHER.value)
    headers = {"Authorization": f"Bearer {token}"}

    # 1. CREATE
    payload_create = {
        "content": "Tính giá trị của biểu thức $P = \\log_2(8)$.",
        "choices": {"A": "2", "B": "3", "C": "4", "D": "8"},
        "correct_answer": "B",
        "subject": "Toán học",
        "topic": "Mũ - Logarit",
        "difficulty": "EASY",
        "explanation": "2 mũ 3 bằng 8 nên kết quả là 3.",
    }
    res_create = client.post("/api/teacher/questions", json=payload_create, headers=headers)
    assert res_create.status_code == 201
    created_id = res_create.json()["id"]

    # 2. UPDATE
    payload_update = {
        "difficulty": "MEDIUM",
        "explanation": "Lời giải chi tiết đã được cập nhật.",
    }
    res_update = client.put(f"/api/teacher/questions/{created_id}", json=payload_update, headers=headers)
    assert res_update.status_code == 200
    assert res_update.json()["difficulty"] == "MEDIUM"

    # 3. DELETE
    res_delete = client.delete(f"/api/teacher/questions/{created_id}", headers=headers)
    assert res_delete.status_code == 204

    # 4. VERIFY DELETED
    res_check = client.put(f"/api/teacher/questions/{created_id}", json=payload_update, headers=headers)
    assert res_check.status_code == 404


def test_get_teacher_analytics_overview():
    """Giáo viên xem thống kê tổng quan của toàn bộ hệ thống."""
    token = get_token("teacher_suite@example.com", UserRole.TEACHER.value)
    headers = {"Authorization": f"Bearer {token}"}

    response = client.get("/api/teacher/analytics/overview", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["total_students"] >= 1
    assert data["total_completed_tests"] >= 1
    assert "average_score_by_subject" in data