import sys, types
from enum import Enum

# Subtask 2 depends on Subtask 1 at integration time. These test-only stubs
# allow RBAC authorization logic to be unit-tested independently.
if "app.core.security" not in sys.modules:
    core = types.ModuleType("app.core")
    security = types.ModuleType("app.core.security")
    security.decode_token = lambda token: {"sub": "1", "type": "access"}
    sys.modules["app.core"] = core
    sys.modules["app.core.security"] = security

if "app.db" not in sys.modules:
    db = types.ModuleType("app.db")
    db.get_db = lambda: None
    sys.modules["app.db"] = db

if "app.models" not in sys.modules:
    models = types.ModuleType("app.models")
    class UserRole(str, Enum):
        ADMIN = "Admin"
        TEACHER = "Teacher"
        STUDENT = "Student"
        PARENT = "Parent"
    class User: pass
    models.UserRole = UserRole
    models.User = User
    sys.modules["app.models"] = models

import pytest
from fastapi import HTTPException
from app.rbac import require_roles
from app.models import UserRole

class FakeUser:
    def __init__(self, role):
        self.role = role

def test_admin_can_access_admin():
    dependency = require_roles(UserRole.ADMIN)
    assert dependency(FakeUser(UserRole.ADMIN)).role == UserRole.ADMIN

def test_teacher_cannot_access_admin():
    dependency = require_roles(UserRole.ADMIN)
    with pytest.raises(HTTPException) as exc:
        dependency(FakeUser(UserRole.TEACHER))
    assert exc.value.status_code == 403

@pytest.mark.parametrize("role", [
    UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT, UserRole.PARENT
])
def test_each_role_can_access_its_own_resource(role):
    dependency = require_roles(role)
    assert dependency(FakeUser(role)).role == role
