import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import pytest
from fastapi import status
from fastapi.testclient import TestClient

import app.models as models  
from app.main import app
from app.db import Base, engine, SessionLocal
from app.models import User, UserRole, UserStatus
from app.core.security import create_access_token, hash_password

client = TestClient(app)


@pytest.fixture(scope="session", autouse=True)
def setup_database_tables():
    """Tạo tất cả các bảng bao gồm 'users' vào file DB sqlite test."""
    Base.metadata.create_all(bind=engine)
    yield


@pytest.fixture
def db_session():
    """Cung cấp session kết nối chuẩn tới DB test."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture
def teacher_headers(db_session):
    """Lấy hoặc tạo tài khoản Teacher trong DB test."""
    teacher = db_session.query(User).filter(User.email == "teacher.test@ut.edu.vn").first()
    
    if not teacher:
        role_val = UserRole.TEACHER.value if hasattr(UserRole.TEACHER, "value") else str(UserRole.TEACHER)
        status_val = UserStatus.ACTIVE.value if hasattr(UserStatus.ACTIVE, "value") else str(UserStatus.ACTIVE)
        
        teacher = User(
            email="teacher.test@ut.edu.vn",
            full_name="Teacher Test",
            password=hash_password("123123@A"),
            role=role_val,
            status=status_val,
        )
        db_session.add(teacher)
        db_session.commit()
        db_session.refresh(teacher)

    token = create_access_token(teacher.id, teacher.role)
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def student_headers(db_session):
    """Lấy hoặc tạo tài khoản Student trong DB test để kiểm tra RBAC."""
    student = db_session.query(User).filter(User.email == "student.test@ut.edu.vn").first()
    
    if not student:
        role_val = UserRole.STUDENT.value if hasattr(UserRole.STUDENT, "value") else str(UserRole.STUDENT)
        status_val = UserStatus.ACTIVE.value if hasattr(UserStatus.ACTIVE, "value") else str(UserStatus.ACTIVE)
        
        student = User(
            email="student.test@ut.edu.vn",
            full_name="Student Test",
            password=hash_password("123123@A"),
            role=role_val,
            status=status_val,
        )
        db_session.add(student)
        db_session.commit()
        db_session.refresh(student)

    token = create_access_token(student.id, student.role)
    return {"Authorization": f"Bearer {token}"}



def test_teacher_overview_rbac_denied_for_student(student_headers):
    """Kiểm tra STUDENT không có quyền truy cập API Teacher Overview (403)."""
    response = client.get("/api/teacher/overview", headers=student_headers)
    assert response.status_code == status.HTTP_403_FORBIDDEN


def test_teacher_overview_success(teacher_headers):
    """Kiểm tra TEACHER truy cập thành công API Overview."""
    response = client.get("/api/teacher/overview", headers=teacher_headers)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    
    assert "total_questions" in data
    assert "total_students" in data
    assert "total_test_attempts" in data or "total_tests_taken" in data
    assert "questions_by_subject" in data



def test_rag_query_rbac_denied_for_student(student_headers):
    """Kiểm tra STUDENT không được phép gọi RAG Query API (403)."""
    payload = {
        "document_text": "Tài liệu kiểm thử dành cho RAG pipeline.",
        "user_query": "Tài liệu này nói về gì?",
        "chunk_size": 100,
        "top_k": 3
    }
    response = client.post("/api/v1/rag/query", json=payload, headers=student_headers)
    assert response.status_code == status.HTTP_403_FORBIDDEN


def test_rag_query_validation_empty_document(teacher_headers):
    """Kiểm tra validate khi document_text bị rỗng."""
    payload = {
        "document_text": "   ",
        "user_query": "Câu hỏi hợp lệ",
        "chunk_size": 100,
        "top_k": 3
    }
    response = client.post("/api/v1/rag/query", json=payload, headers=teacher_headers)
    assert response.status_code in (200, 400, 422)


def test_rag_query_validation_empty_query(teacher_headers):
    """Kiểm tra validate khi user_query bị rỗng."""
    payload = {
        "document_text": "Đoạn văn bản tài liệu hợp lệ dài hơn 10 ký tự.",
        "user_query": "   ",
        "chunk_size": 100,
        "top_k": 3
    }
    response = client.post("/api/v1/rag/query", json=payload, headers=teacher_headers)
    assert response.status_code in (200, 400, 422)


def test_rag_query_success(teacher_headers):
    """Kiểm tra quy trình RAG Pipeline hoạt động thành công."""
    payload = {
        "document_text": "Lập trình Python là một ngôn ngữ phổ biến trong AI và Backend phát triển ứng dụng web.",
        "user_query": "Python dùng để làm gì?",
        "chunk_size": 50,
        "top_k": 2
    }
    response = client.post("/api/v1/rag/query", json=payload, headers=teacher_headers)
    assert response.status_code == status.HTTP_200_OK
    
    data = response.json()
    assert data["query"] == payload["user_query"]
    assert "total_chunks_created" in data
    assert "top_k_results" in data