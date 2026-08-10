# SDD - Phần III: Kiến trúc Cơ sở dữ liệu (TASK 2)

## 1. Mục đích
Đặc tả kiến trúc Cơ sở dữ liệu quan hệ (PostgreSQL) phục vụ cho Nền tảng cá nhân hóa lộ trình học và luyện thi ĐGNL tích hợp AI.

## 2. Phạm vi
- **Subtask 2.1:** Sơ đồ Quan hệ Thực thể (ERD) dạng Mermaid và mã khởi tạo Schema SQL (`1_schema.sql`).
- **Subtask 2.2:** Kịch bản Migration & Các ràng buộc toàn vẹn dữ liệu (`2_migration.sql`).
- **Subtask 2.3:** Chiến lược Đánh chỉ mục (Indexes) & Từ điển Dữ liệu - Data Dictionary (`3_indexes_and_dictionary.sql`).

## 3. Contract với TASK 3 & Các Task Backend khác
- **Single Source of Truth:** Bảng `users` quản lý người dùng tập trung cho Module Authentication & RBAC (TASK 3).
- **Database Integration:** Toàn bộ Schema DDL, Constraints và Indexes được cung cấp sẵn dạng file `.sql` để Task 3 dễ dàng khởi tạo DB hoặc tích hợp vào SQLAlchemy ORM Models.