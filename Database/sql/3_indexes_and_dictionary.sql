-- SUBTASK 2.3: INDEXING STRATEGIES & DATA DICTIONARY

-- Indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_questions_subject_topic ON questions(subject, topic);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_tests_user_id ON tests(user_id);
CREATE INDEX IF NOT EXISTS idx_tests_status ON tests(status);
CREATE INDEX IF NOT EXISTS idx_user_answers_test_id ON user_answers(test_id);
CREATE INDEX IF NOT EXISTS idx_study_plans_user_id ON study_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_plan_tasks_plan_day ON plan_tasks(plan_id, day_no);

-- Data Dictionary Comments
COMMENT ON TABLE users IS 'Lưu trữ tài khoản và thông tin phân quyền người dùng';
COMMENT ON TABLE questions IS 'Ngân hàng câu hỏi đánh giá năng lực';
COMMENT ON TABLE tests IS 'Lịch sử và kết quả bài làm thi chẩn đoán';
COMMENT ON TABLE user_answers IS 'Chi tiết câu trả lời của người dùng trong bài thi';
COMMENT ON TABLE study_plans IS 'Lộ trình học tập cá nhân hóa do AI gợi ý';
COMMENT ON TABLE plan_tasks IS 'Chi tiết từng nhiệm vụ theo ngày trong lộ trình học tập';