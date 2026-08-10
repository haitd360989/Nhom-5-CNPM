import importlib
import sys
import types
from enum import Enum

import pytest
from fastapi import HTTPException


def load_rbac_with_test_stubs():
    """Load the real app.rbac module once with isolated test-only dependencies.

    The stubs are removed from sys.modules immediately afterwards so this
    standalone unit test cannot contaminate an integrated TASK 3 test run.
    """
    original = {name: sys.modules.get(name) for name in (
        "app.core.security", "app.db", "app.models", "app.rbac"
    )}

    security = types.ModuleType("app.core.security")
    security.decode_token = lambda token: {"sub": "1", "type": "access"}

    db = types.ModuleType("app.db")
    db.get_db = lambda: None

    models = types.ModuleType("app.models")

    class UserRole(str, Enum):
        ADMIN = "ADMIN"
        TEACHER = "TEACHER"
        STUDENT = "STUDENT"
        PARENT = "PARENT"

    class UserStatus(str, Enum):
        ACTIVE = "ACTIVE"
        INACTIVE = "INACTIVE"
        SUSPENDED = "SUSPENDED"

    class User:
        pass

    models.UserRole = UserRole
    models.UserStatus = UserStatus
    models.User = User

    sys.modules["app.core.security"] = security
    sys.modules["app.db"] = db
    sys.modules["app.models"] = models
    sys.modules.pop("app.rbac", None)

    try:
        module = importlib.import_module("app.rbac")
        return module, UserRole
    finally:
        sys.modules.pop("app.rbac", None)
        for name, value in original.items():
            if value is None:
                sys.modules.pop(name, None)
            else:
                sys.modules[name] = value


rbac, UserRole = load_rbac_with_test_stubs()


class FakeUser:
    def __init__(self, role):
        self.role = role.value


@pytest.mark.parametrize("role", list(UserRole))
def test_each_role_can_access_its_own_resource(role):
    dependency = rbac.require_roles(role)
    assert dependency(FakeUser(role)).role == role.value


@pytest.mark.parametrize(
    "actual, allowed",
    [
        (UserRole.TEACHER, (UserRole.ADMIN,)),
        (UserRole.STUDENT, (UserRole.ADMIN, UserRole.TEACHER)),
        (UserRole.PARENT, (UserRole.ADMIN, UserRole.STUDENT)),
    ],
)
def test_denied_roles_return_403(actual, allowed):
    dependency = rbac.require_roles(*allowed)
    with pytest.raises(HTTPException) as exc:
        dependency(FakeUser(actual))
    assert exc.value.status_code == 403
