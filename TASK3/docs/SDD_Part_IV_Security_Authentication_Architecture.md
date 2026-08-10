# SDD – Phần IV: Kiến trúc Bảo mật & Xác thực (TASK 3)

## 1. Mục đích
Đặc tả kiến trúc Authentication và Authorization của Backend Python/FastAPI cho nền tảng cá nhân hóa lộ trình học và luyện thi ĐGNL tích hợp AI.

## 2. Phạm vi
- Đăng ký và đăng nhập người dùng.
- Hash mật khẩu.
- JWT Access Token và Refresh Token.
- Kiểm tra token type, chữ ký và thời hạn.
- RBAC cho `ADMIN`, `TEACHER`, `STUDENT`, `PARENT`.
- Chuẩn lỗi `401 Unauthorized` và `403 Forbidden`.
- Tương thích với bảng `users` của TASK 2.

## 3. Contract với TASK 2
TASK 2 (`subtask_2.2.sql`) là nguồn chuẩn cho cấu trúc bảng `users`:

```text
users
├── id            BIGSERIAL PRIMARY KEY
├── email         VARCHAR(255) UNIQUE NOT NULL
├── password      VARCHAR(255) NOT NULL
├── full_name     VARCHAR(100) NOT NULL
├── role          VARCHAR(20) NOT NULL
├── status        VARCHAR(20) NOT NULL
├── created_at    TIMESTAMP WITH TIME ZONE
└── updated_at    TIMESTAMP WITH TIME ZONE
```

TASK 3 map **đúng tên cột** `password` và `status`; không dùng `password_hash` hoặc `is_active`.

### Role compatibility
SRS/TASK 3 yêu cầu bốn role: `ADMIN`, `TEACHER`, `STUDENT`, `PARENT`. Trong `subtask_2.2.sql`, CHECK hiện tại của `users.role` mới cho phép ba role đầu. Vì vậy file `task2_compatibility_patch.sql` trong Subtask 1 mở rộng CHECK để cho phép `PARENT`. Đây là một migration compatibility nhỏ, không thay đổi tên cột hay quan hệ của TASK 2.

### Password compatibility
TASK 2 mock data hiện dùng chuỗi hash dạng bcrypt (`$2a$...`). TASK 3 tạo hash mới bằng Argon2 nhưng vẫn có đường xác minh bcrypt cho dữ liệu mock hiện hữu. Phụ thuộc `bcrypt` được khai báo trong `requirements.txt`.

## 4. Kiến trúc tổng thể

```text
React / Flutter
      |
      | HTTPS + Authorization: Bearer <access_token>
      v
FastAPI
      |
      +--> Authentication
      |      +--> verify password hash
      |      +--> verify JWT signature
      |      +--> check exp / type
      |      +--> load User from PostgreSQL
      |
      +--> RBAC
      |      +--> ADMIN
      |      +--> TEACHER
      |      +--> STUDENT
      |      +--> PARENT
      |
      v
Business Services / AI Services
      |
      v
PostgreSQL (TASK 2)
```

## 5. Authentication – Subtask 1

### 5.1 Register
`POST /api/v1/auth/register`

Input:
- `email`
- `full_name`
- `password`

Rules:
1. Email must be unique.
2. Public registration creates `STUDENT` only.
3. Password is hashed before storage in `users.password`.
4. `status` is initialized to `ACTIVE`.
5. `created_at` and `updated_at` are recorded.

### 5.2 Login
`POST /api/v1/auth/login`

Rules:
1. Find the user by email.
2. Verify the stored password hash.
3. Reject `INACTIVE` or `SUSPENDED` users.
4. Issue an Access Token and Refresh Token.

### 5.3 Refresh
`POST /api/v1/auth/refresh`

Input is a Refresh Token. The server verifies the token type, signature and expiration, loads the current user, checks `status = ACTIVE`, and issues a new token pair using the **current database role**.

### 5.4 Me
`GET /api/v1/auth/me`

Requires an Access Token and returns the authenticated user's profile without exposing the password hash.

### 5.5 Logout
`POST /api/v1/auth/logout`

The baseline implementation validates the Access Token and acknowledges logout. The client discards both tokens. Server-side refresh-token revocation is not stored because TASK 2 has no refresh-token table; a production shared revocation store can be added later without changing the `users` contract.

## 6. JWT specification

| Claim | Meaning |
|---|---|
| `sub` | User ID as string |
| `role` | `ADMIN`, `TEACHER`, `STUDENT`, or `PARENT` |
| `type` | `access` or `refresh` |
| `jti` | Unique token ID |
| `iat` | Issued time |
| `exp` | Expiration time |

Access Tokens are short-lived; Refresh Tokens have a longer lifetime.

## 7. Authorization – Subtask 2

RBAC runs only after successful JWT authentication.

| Resource | ADMIN | TEACHER | STUDENT | PARENT |
|---|---:|---:|---:|---:|
| Admin | ✓ | ✗ | ✗ | ✗ |
| Teacher | ✓ | ✓ | ✗ | ✗ |
| Student | ✓ | ✗ | ✓ | ✗ |
| Parent | ✓ | ✗ | ✗ | ✓ |

The matrix is a baseline for TASK 3. Additional business permissions must come from the approved SRS.

## 8. Request flow

```text
HTTP Request
    |
    v
Bearer Token?
    | no -> 401
    v
Decode + Verify JWT
    | invalid / expired / wrong type -> 401
    v
Load User from users
    | missing / INACTIVE / SUSPENDED -> 401
    v
Check required role
    | denied -> 403
    v
Controller / Service
```

## 9. API contract

### Authentication
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`

### RBAC
- `GET /api/v1/rbac/admin`
- `GET /api/v1/rbac/teacher`
- `GET /api/v1/rbac/student`
- `GET /api/v1/rbac/parent`

## 10. NFR mapping

### Performance
JWT signature/claim validation is local. User lookup uses the primary key for protected requests and the indexed unique email for login.

### Security
- Argon2 for newly registered passwords.
- Legacy bcrypt verification for the existing TASK 2 mock hashes.
- JWT signature and expiration validation.
- Role-based least privilege.
- HTTPS/TLS in deployment.
- Secret stored outside source control.

### Scalability
Access-token verification is stateless. Multiple FastAPI instances can therefore sit behind a load balancer. Any future server-side token revocation store must be shared between instances.

### Integration
FastAPI automatically exposes OpenAPI documentation. React/Flutter can send `Authorization: Bearer <access_token>`.

### Data
The authentication layer uses the TASK 2 `users` table and exact column names. Passwords are never returned by API responses.

## 11. Testing and verification

The revised TASK 3 was checked with:
- exact `users` column mapping against the executable TASK 2 schema;
- registration and duplicate-email handling;
- login, `/me`, refresh and wrong-token-type rejection;
- inactive-account rejection;
- invalid and expired JWT rejection;
- all four RBAC roles and the full resource matrix;
- unauthenticated RBAC requests;
- legacy bcrypt verification path;
- standalone RBAC unit tests.

Verification result for the local test suite: **17 passed**.

The automated suite uses SQLite as a local test database because a live PostgreSQL server is not available in the verification environment. The production/integration database remains the PostgreSQL schema from TASK 2.

## 12. Production recommendations
1. Use a strong random `JWT_SECRET_KEY` and store it in Azure Key Vault or another secret manager.
2. Run `subtask_2.2.sql`, then `task2_compatibility_patch.sql` for the four-role contract.
3. Use the TASK 2 PostgreSQL database in `.env`.
4. Add shared refresh-token rotation/revocation for production.
5. Add login rate limiting and audit logs.
6. Enforce HTTPS.
7. Keep `.env` and production secrets out of Git.

## 13. Traceability
- **Subtask 1:** User Authentication + JWT lifecycle.
- **Subtask 2:** RBAC authorization for four SRS roles.
- **Subtask 3:** Security & Authentication Architecture documentation.
