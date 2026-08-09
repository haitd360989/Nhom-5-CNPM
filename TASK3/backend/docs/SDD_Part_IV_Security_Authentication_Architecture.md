# SDD – Phần IV: Security & Authentication Architecture

## 1. Mục đích
Đặc tả kiến trúc bảo mật cho Backend Python/FastAPI của nền tảng cá nhân hóa lộ trình học và luyện thi ĐGNL tích hợp AI.

## 2. Phạm vi
- Xác thực người dùng.
- Hash mật khẩu.
- JWT Access/Refresh Token.
- Kiểm tra vòng đời token.
- RBAC cho Admin, Teacher, Student, Parent.
- Chuẩn lỗi 401/403.
- Hợp đồng tích hợp giữa Authentication và Authorization.

## 3. Kiến trúc

```text
React / Flutter
      |
      | HTTPS + Authorization: Bearer <access_token>
      v
FastAPI
      |
      +--> Authentication
      |      +--> verify JWT
      |      +--> check exp/type
      |      +--> load User
      |
      +--> RBAC
      |      +--> Admin
      |      +--> Teacher
      |      +--> Student
      |      +--> Parent
      |
      v
Business Services
      |
      v
PostgreSQL (Task 2)
```

## 4. Authentication – Subtask 1

### 4.1 Register
`POST /api/v1/auth/register`

Input:
- email
- full_name
- password

Password is hashed using Argon2 before storage. Public registration creates Student only.

### 4.2 Login
`POST /api/v1/auth/login`

The system:
1. Finds the account.
2. Verifies password hash.
3. Checks `is_active`.
4. Creates Access Token and Refresh Token.

### 4.3 Refresh
`POST /api/v1/auth/refresh`

A valid refresh token produces a new access/refresh pair.

### 4.4 Me
`GET /api/v1/auth/me`

Requires an access token and returns the authenticated user's basic profile.

### 4.5 Logout
`POST /api/v1/auth/logout`

Baseline implementation acknowledges logout and the client discards tokens. For production, refresh-token rotation/revocation should be persisted in PostgreSQL/Redis.

## 5. JWT Specification

| Claim | Meaning |
|---|---|
| `sub` | User ID |
| `role` | User role |
| `type` | `access` or `refresh` |
| `jti` | Token ID |
| `iat` | Issued time |
| `exp` | Expiration time |

Access Token is short-lived. Refresh Token has a longer lifetime.

## 6. RBAC – Subtask 2

RBAC is evaluated only after JWT authentication succeeds.

| Resource | Admin | Teacher | Student | Parent |
|---|---:|---:|---:|---:|
| Admin | ✓ | ✗ | ✗ | ✗ |
| Teacher | ✓ | ✓ | ✗ | ✗ |
| Student | ✓ | ✗ | ✓ | ✗ |
| Parent | ✓ | ✗ | ✗ | ✓ |

This is the baseline TASK 3 matrix. More detailed business permissions must be derived from the approved SRS rather than invented.

## 7. Request flow

```text
HTTP Request
    |
    v
Bearer Token?
    | no -> 401
    v
Decode JWT
    | invalid/expired/wrong type -> 401
    v
Load active User
    | unavailable -> 401
    v
Check required role
    | denied -> 403
    v
Controller / Service
```

## 8. API contract

### Authentication
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`

### RBAC verification
- `GET /api/v1/rbac/admin`
- `GET /api/v1/rbac/teacher`
- `GET /api/v1/rbac/student`
- `GET /api/v1/rbac/parent`

## 9. NFR mapping

### Performance
JWT validation is local and role checks are lightweight. User lookup should use indexed `id` and `email`.

### Security
- Password hashing with Argon2.
- JWT signature + expiry validation.
- RBAC least privilege.
- HTTPS/TLS in deployment.
- Secrets must not be committed to Git.

### Scalability
JWT access validation is stateless, so multiple FastAPI instances can run behind an Azure load balancer. Shared refresh-token revocation should use a shared datastore.

### Integration
REST endpoints are OpenAPI-compatible and can be consumed by React/Flutter clients from Task 1.

### Data
The `User` entity must be mapped to the PostgreSQL `Users` table from Task 2. No plaintext password is stored.

## 10. Integration with other TASKs

### Task 1
- Frontend sends `Authorization: Bearer <access_token>`.
- API contract can be published automatically through FastAPI OpenAPI.

### Task 2
- Authentication uses the `Users` table.
- User ID and role are read from the relational database.
- Production implementation should use the Task 2 PostgreSQL schema instead of a separate auth database.

### Task 4
Authentication/RBAC can be represented as the security boundary in sequence diagrams.

### Task 5
AI endpoints must be protected by the same RBAC mechanism. AI services must not bypass API authorization.

## 11. Production recommendations
1. Store JWT secret in Azure Key Vault.
2. Use PostgreSQL from Task 2.
3. Add refresh-token rotation and revocation.
4. Add rate limiting for login.
5. Add authentication/audit logs.
6. Enforce HTTPS.
7. Add automated unit/integration tests.
8. Never commit `.env` or production secrets.

## 12. Traceability
- Subtask 1 = Authentication + JWT lifecycle.
- Subtask 2 = RBAC authorization.
- Subtask 3 = Architecture documentation of Subtasks 1 and 2.
