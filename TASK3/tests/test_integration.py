from datetime import datetime, timezone

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import inspect

from app.main import app
from app.db import Base, SessionLocal, engine
from app.models import User, UserRole, UserStatus
from app.core.security import create_access_token



Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

client = TestClient(app)


def create_user(email, role, password="Password123"):
    from app.core.security import hash_password

    db = SessionLocal()
    now = datetime.now(timezone.utc)
    user = User(
        email=email,
        full_name=email.split("@")[0],
        password=hash_password(password),
        role=role.value,
        status=UserStatus.ACTIVE.value,
        created_at=now,
        updated_at=now,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    db.close()
    return user


def token_for(user):
    return create_access_token(user.id, user.role)


def test_task2_users_schema_mapping_is_exact():
    columns = {c["name"] for c in inspect(engine).get_columns("users")}
    assert columns == {
        "id", "email", "password", "full_name", "role", "status", "created_at", "updated_at"
    }
    assert "password_hash" not in columns
    assert "is_active" not in columns


def test_register_creates_student_with_task2_column_names():
    response = client.post(
        "/api/v1/auth/register",
        json={"email": "newstudent@example.com", "full_name": "New Student", "password": "Password123"},
    )
    assert response.status_code == 201, response.text
    body = response.json()
    assert body["role"] == "STUDENT"
    assert body["status"] == "ACTIVE"
    assert "password" not in body

    db = SessionLocal()
    user = db.query(User).filter(User.email == "newstudent@example.com").first()
    assert user is not None
    assert user.password != "Password123"
    assert user.role == "STUDENT"
    db.close()


def test_register_duplicate_email_returns_409():
    response = client.post(
        "/api/v1/auth/register",
        json={"email": "dup@example.com", "full_name": "Dup", "password": "Password123"},
    )
    assert response.status_code == 201
    response = client.post(
        "/api/v1/auth/register",
        json={"email": "dup@example.com", "full_name": "Dup 2", "password": "Password123"},
    )
    assert response.status_code == 409


def test_login_me_refresh_and_wrong_token_type():
    user = create_user("student@example.com", UserRole.STUDENT)
    login = client.post(
        "/api/v1/auth/login",
        json={"email": "student@example.com", "password": "Password123"},
    )
    assert login.status_code == 200, login.text
    tokens = login.json()
    assert tokens["token_type"] == "bearer"

    me = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {tokens['access_token']}"})
    assert me.status_code == 200
    assert me.json()["role"] == "STUDENT"
    assert me.json()["status"] == "ACTIVE"

    refresh = client.post("/api/v1/auth/refresh", json={"refresh_token": tokens["refresh_token"]})
    assert refresh.status_code == 200

    wrong = client.post("/api/v1/auth/refresh", json={"refresh_token": tokens["access_token"]})
    assert wrong.status_code == 401


def test_inactive_user_cannot_login_or_use_access_token():
    user = create_user("inactive@example.com", UserRole.STUDENT)
    db = SessionLocal()
    db.query(User).filter(User.id == user.id).update({"status": UserStatus.INACTIVE.value})
    db.commit()
    db.close()

    login = client.post(
        "/api/v1/auth/login",
        json={"email": "inactive@example.com", "password": "Password123"},
    )
    assert login.status_code == 403


def test_rbac_matrix():
    users = {
        role: create_user(f"rbac-{role.value.lower()}@example.com", role)
        for role in UserRole
    }
    matrix = {
        UserRole.ADMIN: {"admin": 200, "teacher": 200, "student": 200, "parent": 200},
        UserRole.TEACHER: {"admin": 403, "teacher": 200, "student": 403, "parent": 403},
        UserRole.STUDENT: {"admin": 403, "teacher": 403, "student": 200, "parent": 403},
        UserRole.PARENT: {"admin": 403, "teacher": 403, "student": 403, "parent": 200},
    }
    for role, expected in matrix.items():
        token = token_for(users[role])
        headers = {"Authorization": f"Bearer {token}"}
        for resource, status_code in expected.items():
            response = client.get(f"/api/v1/rbac/{resource}", headers=headers)
            assert response.status_code == status_code, (role, resource, response.text)


def test_rbac_requires_authentication():
    for resource in ("admin", "teacher", "student", "parent"):
        response = client.get(f"/api/v1/rbac/{resource}")
        assert response.status_code == 401


def test_invalid_and_expired_tokens_return_401():
    invalid = client.get("/api/v1/auth/me", headers={"Authorization": "Bearer invalid"})
    assert invalid.status_code == 401

    payload = {
        "sub": "1", "role": "STUDENT", "type": "access",
        "iat": datetime(1970, 1, 1, tzinfo=timezone.utc),
        "exp": datetime(1970, 1, 1, tzinfo=timezone.utc),
    }
    import jwt
    from app.core.config import settings
    expired = jwt.encode(payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)
    response = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {expired}"})
    assert response.status_code == 401
