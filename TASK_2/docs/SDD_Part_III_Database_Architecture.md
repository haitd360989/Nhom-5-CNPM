# SDD – Phần III: Kiến trúc Cơ sở dữ liệu & Dịch vụ Dữ liệu Nền tảng (TASK 2)

## 1. Mục đích
Đặc tả kiến trúc Cơ sở dữ liệu quan hệ (PostgreSQL) và Dịch vụ kết nối Dữ liệu nền tảng (Database Access Layer / Async ORM) cho Nền tảng cá nhân hóa lộ trình học và luyện thi ĐGNL tích hợp AI.

## 2. Phạm vi
- **Subtask 2.1:** Sơ đồ Quan hệ Thực thể (ERD) dạng Mermaid và mã khởi tạo Schema SQL (`01_schema.sql`).
- **Subtask 2.2:** Kịch bản Migration CSDL (`02_migration.sql`) bảo đảm tính toàn vẹn dữ liệu.
- **Subtask 2.3:** Chiến lược Đánh chỉ mục (Indexes) & Từ điển Dữ liệu (Data Dictionary) (`03_indexes_and_dictionary.sql`).
- **Backend Core Data Layer:** Cung cấp SQLAlchemy Async Engine & Models dùng chung cho toàn bộ hệ thống (kết nối trực tiếp với TASK 3).

## 3. Contract với TASK 3 & Các Task Backend khác
- **Single Source of Truth:** Bảng `users` quản lý người dùng tập trung cho Module Authentication & RBAC (TASK 3).
- **ORM Models Sharing:** Bảng ORM Python (`app/models/base_models.py`) được nhập (import) trực tiếp bởi các API Service.
- **Database Session Injection:** Cung cấp hàm `get_db()` làm FastAPI Dependency dùng chung.