# RBAC Test Cases

1. Admin -> GET /api/v1/rbac/admin -> 200
2. Admin -> GET /api/v1/rbac/teacher -> 200
3. Admin -> GET /api/v1/rbac/student -> 200
4. Admin -> GET /api/v1/rbac/parent -> 200
5. Teacher -> GET /api/v1/rbac/teacher -> 200
6. Student -> GET /api/v1/rbac/student -> 200
7. Parent -> GET /api/v1/rbac/parent -> 200
8. Student -> GET /api/v1/rbac/admin -> 403
9. Parent -> GET /api/v1/rbac/teacher -> 403
10. No token -> protected endpoint -> 401
11. Expired/invalid token -> protected endpoint -> 401

## Standalone unit test
`pytest -q` can be run inside this Subtask 2 folder. The test injects test-only upstream stubs; the real RBAC module still integrates with Subtask 1's JWT/User contract when the three subtasks are merged.
