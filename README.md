# Personalized Adaptive Learning Platform with Integrated AI Tutor

Nền tảng học tập thích ứng cá nhân hóa tích hợp Trợ lý Gia sư AI (AI Tutor) hỗ trợ ôn luyện kỳ thi Đánh giá năng lực (ĐGNL) và đánh giá chuẩn hóa học thuật.

Danh sách tài khoản thử nghiệm (Demo Credentials)

Hệ thống triển khai cơ chế kiểm soát truy cập dựa trên vai trò (**RBAC** - Role-Based Access Control) nghiêm ngặt gồm 4 nhóm đối tượng: `STUDENT`, `TEACHER`, `PARENT`, `ADMIN`.

Vai trò (Role) | Email | Mật khẩu | Ghi chú quyền hạn 

**Học sinh (Student)** | `tdh2007.thn@gmail.com` | `12345678` | Tài khoản học sinh chính, làm bài test chẩn đoán, luyện tập thích ứng, hỏi đáp AI Tutor
**Giáo viên (Teacher)** | `teacher.test@ut.edu.vn` | `123123@A` | Quản trị ngân hàng câu hỏi (CRUD), xem thống kê lớp học, tra cứu kho tri thức RAG
**Phụ huynh (Parent)** | `parent@example.com` | `Password123` | Giám sát tiến độ học tập, điểm thi và dự đoán phổ điểm của con (liên kết với học sinh trên)

### Quy định về cấp phát & liên kết tài khoản:
* **Tài khoản Giáo viên:** Được Quản trị viên (Admin) và Ban quản trị nhà trường cấp phát trực tiếp nhằm đảm bảo tính an toàn, bảo mật nội dung đề thi và hệ thống.
* **Tài khoản Phụ huynh:** Được liên kết trực tiếp với hồ sơ học sinh và kích hoạt bởi Ban quản trị / Admin khi học sinh nhập học. Cơ chế này đảm bảo tính xác thực pháp lý, ngăn chặn việc người lạ tùy tiện liên kết vào dữ liệu học tập cá nhân của học sinh.

## Tech Stack

* **Backend:** Python 3.10+, FastAPI, SQLAlchemy ORM, Pydantic v2.
* **Security & Auth:** JWT Bearer (HS256), Bcrypt Cryptographic Hashing, RBAC Middleware.
* **Database & Vector Search:** PostgreSQL / Supabase, Custom In-memory Vector Store (L2-norm, Cosine Similarity).
* **AI Engine:** Google Gemini API (`gemini-1.5-flash` / Socratic prompts), RAG Pipeline.
* **Frontend:** React.js 19, Vite, Material-UI (MUI v7), Recharts, KaTeX math typesetting.
* **Automated Testing:** Pytest, Isolated SQLite Test Engine, `unittest.mock`.

### Cấu hình biến môi trường (`.env`) cho AI Tutor & Database

> **Lưu ý quan trọng:** Để tính năng **AI Tutor**, cơ sở dữ liệu Supabase và hệ thống xác thực hoạt động, bạn bắt buộc phải tạo file `.env` tại thư mục `Backend/` theo đúng vị trí cấu trúc:
>
> ```text
> Nhom-5-CNPM/
>  -- Backend/
>     -- .env    <- Tạo file tại đây (cùng cấp với requirements.txt)
>     --  app/
>     --  requirements.txt
>     --  ...
> ```

Nội dung file `Backend/.env`:

```env
PROJECT_NAME="AI Tutor & Diagnostic Test API"
API_V1_STR="/api/v1"

GEMINI_API_KEY="......" 

DATABASE_URL="postgresql+psycopg://postgres.cglyxxlkuzbdcxiofklb:7JS78%23eX-%23XS%23Wx@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres"

SECRET_KEY="c690c91c4b2a6eb7c5fb2dd5047d6ece4e554f3e4c358a952385a30162816aa6"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=11520
```
Để sử dụng tính năng AI Tutor , giảng viên vui lòng sử dụng API Key tạo nhanh Key miễn phí trong 30 giây tại Google AI Studio rồi dán vào biến GEMINI_API_KEY 
