# TASK 2: Relational Database Architecture & Platform Data Services

Dự án chứa toàn bộ mã nguồn khởi tạo CSDL PostgreSQL và Dịch vụ Dữ liệu Nền tảng (Database Layer) cho hệ thống.

## Hướng dẫn cài đặt & Chạy Migration:
1. Thực thi các file SQL theo thứ tự trong folder `sql/`:
   - `01_schema.sql`
   - `02_migration.sql`
   - `03_indexes_and_dictionary.sql`
2. Cài đặt các thư viện Python:
   ```bash
   pip install -r requirements.txt