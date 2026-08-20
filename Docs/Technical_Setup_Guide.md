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

![Sơ đồ kiến trúc CSDL Supabase](Images/supabase_schema_visualizer.png)

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

## 6. KHỞI CHẠY VÀ TRẢI NGHIỆM GIAO DIỆN NGƯỜI DÙNG (FRONTEND)

Giao diện người dùng được xây dựng trên nền tảng **React / Vite**, tối ưu hóa trải nghiệm làm bài thi trực quan, hiển thị công thức toán học thời gian thực và quản lý lộ trình học tập cá nhân hóa.

### 6.1. Cài đặt phụ thuộc và khởi chạy Frontend

Mở một cửa sổ Terminal mới tại thư mục gốc của dự án (`Nhom-5-CNPM`) và thực hiện tuần tự:
* **Bước 1: Kích hoạt môi trường ảo của dự án**
* *Trên Windows (PowerShell):*
    ```powershell
    .\.venv\Scripts\Activate.ps1
    ```
* *Trên macOS / Linux:*
    ```bash
    source .venv/bin/activate
    ```

* **Bước 2: Di chuyển vào thư mục Frontend và cài đặt thư viện**
  ```bash
  cd Frontend
  npm install
  ```
* **Bước 3: Khởi chạy Frontend**
  ```bash
  npm run dev
  ```
  Giao diện sẽ khởi chạy thành công tại địa chỉ (http://localhost:5173/) như trong ảnh :
  ![Ảnh minh chứng khởi chạy Frontend thành công](Images/LaunchFrontend.png)

  > **LƯU Ý QUAN TRỌNG TRƯỚC KHI KHỞI CHẠY:**
  > * Máy chủ **Backend API (`FastAPI` chạy tại cổng `8000`) phải được khởi chạy trước** (theo hướng dẫn ở Mục 5.1) và luôn duy trì hoạt động trong một cửa sổ Terminal riêng.
  > * Toàn bộ các thao tác trên Frontend (Đăng ký, Đăng nhập, Tải đề thi, Nộp bài chấm điểm và Khởi tạo lộ trình) đều gọi API trực tiếp sang Backend để xác thực JWT Token và đồng bộ CSDL Supabase. Nếu chưa bật Backend, hệ thống sẽ gặp lỗi mất kết nối (`Network Error`).

### 6.2. Minh chứng luồng trải nghiệm người dùng trên hệ thống

#### Bước A: Đăng ký và Đăng nhập tài khoản (Authentication)
* **Chức năng:** Cho phép học viên khởi tạo tài khoản mới hoặc đăng nhập vào hệ thống, kết nối trực tiếp với Backend API để xác thực và đồng bộ dữ liệu người dùng về CSDL Supabase.
* **Giao diện & Nghiệp vụ:**
  * **Tạo tài khoản:** Nhập *Họ và tên*, *Email*, *Mật khẩu* và chọn *Đăng ký và đăng nhập* để tự động gán vai trò `STUDENT`.
  * **Đăng nhập:** Nhập *Email*, *Mật khẩu* để lấy `access_token` (JWT Token) lưu trữ tại trình duyệt và điều hướng vào không gian học tập.

![Giao diện Đăng ký tài khoản](Images/frontend_register.png)
![Giao diện Đăng nhập hệ thống](Images/frontend_login.png)

---

#### Bước B: Không gian phòng thi đánh giá năng lực (`/student/assessment`)
* **Chức năng:** Học viên làm bài kiểm tra chẩn đoán trắc nghiệm gồm 15 câu hỏi đa lĩnh vực.
* **Điểm nổi bật về kỹ thuật:**
  * **Đồng hồ đếm ngược:** Đếm ngược thời gian làm bài thời gian thực.
  * **Thanh tiến trình (Progress Bar):** Tự động cập nhật tỉ lệ hoàn thành câu hỏi theo thời gian thực (ví dụ: `2/15 câu`).
  * **Bảng điều hướng câu hỏi (Question Palette):** Trực quan hóa câu đang làm (xanh dương), câu đã chọn đáp án (xanh lá) và câu chưa trả lời.

![Giao diện phòng thi chẩn đoán năng lực](Images/frontend_assessment_room.png)

---

#### Bước C: Màn hình Kết quả đánh giá năng lực
* **Chức năng:** Tự động chấm điểm và phản hồi kết quả bài thi chẩn đoán ngay sau khi học viên nộp bài.
* **Thông tin hiển thị:**
  * **Tổng quan điểm số:** Điểm thô đạt được (ví dụ: `2/15 câu đúng`), tỷ lệ phần trăm chính xác (`13.33%`).
  * **Phân tích chi tiết bài làm:** Hiển thị danh sách câu hỏi, đáp án học viên đã chọn và gắn nhãn Đúng/Sai trực quan.
  * **Điều hướng chức năng:** Nút bấm trực tiếp chuyển sang *Xem lộ trình học* hoặc *Làm lại bài đánh giá*.

![Giao diện Kết quả đánh giá năng lực](Images/frontend_assessment_result.png)
![Giao diện Kết quả đánh giá năng lực 2](Images/frontend_assessment_result_2.png)

---

#### Bước D: Không gian Lộ trình học tập (`/student/roadmap`)
* **Chức năng:** Hiển thị thông số lộ trình hiện tại và cung cấp modal thiết lập/chỉnh sửa mục tiêu để hệ thống tính toán xây dựng lộ trình học phù hợp.
* **Thông tin hiển thị & Quy chuẩn dữ liệu:**
  * **Thẻ tóm tắt lộ trình:** Hiển thị *Điểm mục tiêu* (ví dụ : 1.000 điểm), *Ngày thi* (ví dụ : 12/02/2028), *Thời gian học* (ví dụ : 10 giờ/ngày).
  * **Modal thiết lập mục tiêu lộ trình:** Nhận dải điểm từ `1` đến `1200` điểm (đồng bộ kiểu dữ liệu `NUMERIC(7,2)` trên Supabase), ngày thi chính thức và thời lượng học từ `0.5` đến `12` giờ/ngày.

![Giao diện Lộ trình học tập](Images/frontend_roadmap_view.png)
![Modal thiết lập mục tiêu lộ trình](Images/frontend_goal_modal.png)
![Ảnh minh chứng dữ liệu thiết lập lộ trình học tập đã thay đổi theo yêu cầu chỉnh sửa](Images/frontend_goal_modal_modified.png)