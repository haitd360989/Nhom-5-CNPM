# TASK 3 - Merge Instructions

The three deliverables are separate ZIP files but are intentionally path-compatible.

1. Extract Subtask 1 at the backend project root.
2. Extract Subtask 2 at the SAME backend project root.
3. Extract Subtask 3 at the SAME backend project root.

Subtask 1 owns the shared authentication/database/security modules.
Subtask 2 adds only RBAC-specific modules and tests.
Subtask 3 adds the SDD document under docs/.

Do NOT replace app/core/config.py, app/core/security.py, app/db.py, or
app/models.py with a second copy from another subtask.

After extraction:
    pip install -r requirements.txt
    uvicorn app.main:app --reload

API:
    POST /api/v1/auth/register
    POST /api/v1/auth/login
    POST /api/v1/auth/refresh
    POST /api/v1/auth/logout
    GET  /api/v1/auth/me

    GET /api/v1/rbac/admin
    GET /api/v1/rbac/teacher
    GET /api/v1/rbac/student
    GET /api/v1/rbac/parent
