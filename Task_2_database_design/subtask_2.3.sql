-- 1. TẠO CHỈ MỤC (INDEXES) TỐI ƯU HIỆU NĂNG TRUY VẤN

-- Tăng tốc độ đăng nhập & tìm kiếm người dùng theo Email
CREATE INDEX idx_users_email ON users(email);

-- Tăng tốc lọc câu hỏi theo môn học, chủ đề và độ khó
CREATE INDEX idx_questions_subject_topic ON questions(subject, topic);
CREATE INDEX idx_questions_difficulty ON questions(difficulty);

-- Tăng tốc truy vấn lịch sử thi của từng học sinh
CREATE INDEX idx_tests_user_id ON tests(user_id);
CREATE INDEX idx_tests_status ON tests(status);

-- Tăng tốc truy vấn danh sách câu trả lời theo phiên thi
CREATE INDEX idx_user_answers_test_id ON user_answers(test_id);

-- Tăng tốc truy vấn lộ trình học tập của học sinh
CREATE INDEX idx_study_plans_user_id ON study_plans(user_id);

-- Tăng tốc truy vấn danh sách nhiệm vụ theo ngày trong lộ trình
CREATE INDEX idx_plan_tasks_plan_day ON plan_tasks(plan_id, day_no);

-- 2. TỪ ĐIỂN DỮ LIỆU & GHI CHÚ BẢNG (DATA DICTIONARY)

-- Ghi chú cho Bảng USERS
COMMENT ON TABLE users IS 'Lưu trữ thông tin tài khoản người dùng trong hệ thống';
COMMENT ON COLUMN users.role IS 'Vai trò: STUDENT (Học sinh), ADMIN (Quản trị), TEACHER (Giáo viên)';
COMMENT ON COLUMN users.status IS 'Trạng thái: ACTIVE (Hoạt động), INACTIVE (Chưa kích hoạt), SUSPENDED (Khóa)';

-- Ghi chú cho Bảng QUESTIONS
COMMENT ON TABLE questions IS 'Ngân hàng câu hỏi chẩn đoán và bài tập';
COMMENT ON COLUMN questions.choices IS 'Danh sách phương án lựa chọn lưu dưới dạng JSONB';
COMMENT ON COLUMN questions.difficulty IS 'Độ khó: EASY (Dễ), MEDIUM (Trung bình), HARD (Khó)';

-- Ghi chú cho Bảng TESTS
COMMENT ON TABLE tests IS 'Lưu thông tin các phiên làm bài thi chẩn đoán của học sinh';
COMMENT ON COLUMN tests.score IS 'Điểm số đạt được tính theo thang điểm 100 hoặc 10';

-- Ghi chú cho Bảng USER_ANSWERS
COMMENT ON TABLE user_answers IS 'Chi tiết các câu trả lời do học sinh chọn trong từng bài thi';
COMMENT ON COLUMN user_answers.is_correct IS 'Đánh giá câu trả lời: TRUE (Đúng), FALSE (Sai)';

-- Ghi chú cho Bảng STUDY_PLANS
COMMENT ON TABLE study_plans IS 'Lộ trình học tập do hệ thống sinh tự động cho học sinh';
COMMENT ON COLUMN study_plans.current_day IS 'Ngày hiện tại học sinh đang tiến hành trong lộ trình';

-- Ghi chú cho Bảng PLAN_TASKS
COMMENT ON TABLE plan_tasks IS 'Chi tiết danh sách nhiệm vụ học tập theo từng ngày';
COMMENT ON COLUMN plan_tasks.type IS 'Loại nhiệm vụ: READING (Đọc bài), QUIZ (Làm bài tập), VIDEO (Xem clip)';