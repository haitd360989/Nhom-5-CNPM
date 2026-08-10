import os
import sys
import types

# The execution sandbox used for verification does not have pwdlib installed.
# Production requirements.txt installs pwdlib[argon2]. This test-only fallback
# keeps the API/RBAC integration tests executable here without changing production code.
if "pwdlib" not in sys.modules:
    class _PasswordHash:
        @classmethod
        def recommended(cls):
            return cls()

        def hash(self, password):
            return "TEST_HASH$" + password

        def verify(self, password, hashed):
            return hashed == "TEST_HASH$" + password

    shim = types.ModuleType("pwdlib")
    shim.PasswordHash = _PasswordHash
    sys.modules["pwdlib"] = shim

os.environ["DATABASE_URL"] = "sqlite+pysqlite:////tmp/task3_test.db"
os.environ["JWT_SECRET_KEY"] = "test-secret-key-0123456789-abcdef"
os.environ["ACCESS_TOKEN_EXPIRE_MINUTES"] = "30"
os.environ["REFRESH_TOKEN_EXPIRE_DAYS"] = "7"
