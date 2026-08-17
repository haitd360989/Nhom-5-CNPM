## 1. THIẾT LẬP CƠ SỞ DỮ LIỆU (SUPABASE POSTGRESQL)

Hệ thống sử dụng cơ sở dữ liệu quan hệ PostgreSQL lưu trữ trên nền tảng đám mây Supabase. Toàn bộ cấu trúc thực thể và quan hệ dữ liệu đã được triển khai và xác thực thành công.

### 1.1. Thứ tự thực thi Script SQL khởi tạo
Để khởi tạo môi trường từ đầu, thực thi tuần tự 4 file script trong **Supabase SQL Editor**:
1. **`1_schema.sql`**: Khởi tạo cấu trúc các bảng cốt lõi (`users`, `profiles`, `roles`, `permissions`, `user_roles`, `role_permissions`).
2. **`2_migration.sql`**: Cập nhật và bổ sung các bảng phục vụ Đánh giá năng lực và Lộ trình học tập (`questions`, `tests`, `user_answers`, `study_plans`, `plan_tasks`).
3. **`3_indexes_and_dictionary.sql`**: Thiết lập khóa ngoại, ràng buộc toàn vẹn dữ liệu, chỉ mục (Index) tăng tốc độ truy vấn và bảng từ điển danh mục.
4. **`seed_questions.sql`**: Nạp dữ liệu mẫu ban đầu gồm 15 câu hỏi trắc nghiệm đa lĩnh vực (Toán học, Logic, Tiếng Việt).

### 1.2. Sơ đồ thực thể liên kết (Schema Visualizer)
Minh chứng toàn bộ cấu trúc bảng và các quan hệ khóa ngoại (Foreign Keys) đã được triển khai hoàn chỉnh trên Supabase:

![Sơ đồ kiến trúc CSDL Supabase](images/supabase_schema_visualizer.png)

## 2. CẤU HÌNH KẾT NỐI HỆ THỐNG (`config.py`)

Do cơ sở dữ liệu triển khai qua **Supabase Connection Pooler (PgBouncer ở Transaction Mode)**, cấu hình kết nối cần sử dụng đúng Port `6543` và trình điều khiển tương thích `psycopg` (psycopg3).

### 2.1. Cấu hình chuỗi kết nối
Mở file `Backend/app/core/config.py` và khai báo biến môi trường:

```python
DATABASE_URL = "postgresql+psycopg://postgres.cglyxxlkuzbdcxiofklb:7JS78%23eX-%23XS%23Wx@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres?sslmode=require"
```
### 2.2. Lưu ý kỹ thuật đối với Supabase Pooler
Trong chế độ Transaction Pooler, PostgreSQL không hỗ trợ các câu lệnh Prepared Statement mặc định khi thực hiện kiểm tra DDL tự động. Do bảng đã được tạo sẵn qua migration SQL, file Backend/app/main.py cần comment dòng tạo bảng tự động:

```python
# Base.metadata.create_all(bind=engine)
```
## 3. THIẾT LẬP MÔI TRƯỜNG ẢO VÀ CÀI ĐẶT THƯ VIỆN
Mở terminal tại thư mục gốc của dự án (Nhom-5-CNPM) và thực hiện tuần tự các bước sau:

### 3.1. Khởi tạo và kích hoạt môi trường ảo Python
* **Trên hệ điều hành Windows (PowerShell):**
```powershell
# Tạo môi trường ảo .venv tại thư mục gốc (nếu chưa có)
python -m venv .venv

# Kích hoạt môi trường ảo
.\.venv\Scripts\Activate.ps1
``` 
* **Trên hệ điều hành macOS / Linux:**
```Bash
# Tạo môi trường ảo .venv
python3 -m venv .venv

# Kích hoạt môi trường ảo
source .venv/bin/activate
```

### 3.2. Cài đặt các gói phụ thuộc
```Bash
# Cài đặt toàn bộ thư viện cần thiết vào môi trường ảo
pip install -r Backend/requirements.txt
```
* **Danh sách gói phụ thuộc chính:**

* **fastapi: Web framework bất đồng bộ hiệu năng cao.**

* **uvicorn: ASGI Web Server chạy ứng dụng.**

* **sqlalchemy: ORM quản lý mô hình dữ liệu.**

* **psycopg: Driver kết nối PostgreSQL.**

* **pydantic: Xác thực cấu trúc dữ liệu Request/Response.**

* **python-jose, passlib: Xử lý mã hóa và xác thực bảo mật JWT Token.**

## 4. CẤU TRÚC MÃ NGUỒN VÀ XỬ LÝ XUNG ĐỘT MODULE

Để ngăn ngừa lỗi xung đột tên package trong Python (`ModuleNotFoundError: 'app.routes' is not a package`), các module của Task 2 được tách biệt thành `diagnostic_routes` và `diagnostic_schemas`. Cấu trúc mã nguồn thực tế của thư mục Backend:

```text
Backend/
├── app/
│   ├── core/                  # Cấu hình hệ thống, bảo mật JWT
│   │   ├── __init__.py
│   │   ├── config.py
│   │   └── security.py
│   ├── diagnostic_routes/     # Router chuyên biệt cho bài Test & Lộ trình
│   │   └── diagnostic.py
│   ├── diagnostic_schemas/    # Schema Pydantic cho bài Test & Lộ trình
│   │   └── diagnostic.py
│   ├── rag/                   # Module tích hợp AI RAG Pipeline
│   │   ├── __init__.py
│   │   ├── chunking.py
│   │   ├── embeddings.py
│   │   └── router.py
│   ├── __init__.py
│   ├── api.py                 # Endpoint xác thực tài khoản & đăng nhập
│   ├── db.py                  # Khởi tạo SQLAlchemy Engine & Session
│   ├── main.py                # Điểm khởi chạy ứng dụng FastAPI
│   ├── models.py              # Ánh xạ ORM Models đồng bộ schema CSDL
│   ├── rbac.py                # Kiểm soát quyền truy cập Role-Based
│   ├── routes.py              # Router điều hướng chung
│   └── schemas.py             # Schemas validation chung
├── docs/                      # Tài liệu kỹ thuật Backend
│   └── SDD_Part_IV_Security_Authentication_...
├── tests/                     # Kịch bản kiểm thử tự động
├── .gitignore
├── README.md
├── requirements.txt           # Danh sách thư viện phụ thuộc
├── seed_questions.sql         # Script nạp 15 câu hỏi mẫu ban đầu
└── task2_compatibility_patch.sql
```

## 5. KHỞI CHẠY HỆ THỐNG VÀ MINH CHỨNG KIỂM THỬ API
### 5.1. Khởi chạy Backend Server
* **Từ terminal (đã kích hoạt môi trường ảo và di chuyển vào thư mục Backend):**

```Bash
cd Backend
uvicorn app.main:app --reload
```
Server khởi chạy thành công tại địa chỉ: [http://127.0.0.1:8000](http://127.0.0.1:8000) hoặc (http://127.0.0.1:8000/docs)
### 5.2. Kết quả kiểm thử các API cốt lõi trên Swagger UI (`/docs`)

#### Bước A: Đăng nhập và xác thực phân quyền
* **Endpoint:** `POST /api/v1/auth/login`
* **Quyền hạn:** `STUDENT`
* **Kết quả:** Trả về `access_token` định dạng JWT để gán vào mục **Authorize** trên giao diện Swagger UI.

![Ảnh minh chứng nhập tài khoản và mật khẩu đã được đăng kí](Images/api_login_success_1.png) 
![Ảnh minh chứng đã lấy được access token của tài khoản](Images/api_login_success_2.png) 
![Ảnh minh chứng đã thành công authorize token của tài khoản](Images/api_login_success_3.png)

---

#### Bước B: Lấy danh sách câu hỏi kiểm tra chẩn đoán
* **Endpoint:** `GET /api/diagnostic/questions`
* **Kết quả kiểm thử:** HTTP `200 OK`, trả về đủ 15 câu hỏi thuộc 3 môn học Toán học, Logic và Tiếng Việt.

![Ảnh minh chứng API lấy câu hỏi thành công](Images/api_get_questions_success_1.png)
![Ảnh minh chứng API lấy câu hỏi thành công](Images/api_get_questions_success_2.png)

---

#### Bước C: Nộp bài và chấm điểm tự động
* **Endpoint:** `POST /api/diagnostic/submit`
* **Payload kiểm thử:** Dữ liệu JSON chứa danh sách 15 câu trả lời của thí sinh.
* **Kết quả kiểm thử:** HTTP `200 OK`, hệ thống chấm điểm tự động đạt `raw_score: 15/15`, `percentage: 100`, ghi nhận phiên làm bài mới vào bảng `tests` và lưu chi tiết 15 câu trả lời vào bảng `user_answers`.

![Ảnh minh chứng API nhập thông tin bài làm - câu trả lời](Images/api_submit_diagnostic_success_1.png)
![Ảnh minh chứng API nộp bài thành công](Images/api_submit_diagnostic_success_2.png)
![Ảnh minh chứng API chuẩn đoán điểm thành công](Images/api_submit_diagnostic_success_3.png)
---

#### Bước D: Khởi tạo lộ trình học tập cá nhân hóa
* **Endpoint:** `POST /api/study-plan/init`
* **Payload kiểm thử:** Dữ liệu JSON thiết lập mục tiêu điểm số và thời gian.
* **Kết quả kiểm thử:** HTTP `200 OK`, khởi tạo thành công lộ trình trong bảng `study_plans` và tự động tạo 3 nhiệm vụ học tập theo ngày vào bảng `plan_tasks`.

![Ảnh minh chứng API nhập dữ liệu tạo lộ trình học](Images/api_init_study_plan_success_1.png)
![Ảnh minh chứng API tạo lộ trình học thành công](Images/api_init_study_plan_success_2.png)