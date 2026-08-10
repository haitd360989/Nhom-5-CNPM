-- 1. CLEANUP / DROP TABLES (Xóa bảng cũ theo thứ tự ràng buộc khóa ngoại)

DROP TABLE IF EXISTS plan_tasks CASCADE;
DROP TABLE IF EXISTS study_plans CASCADE;
DROP TABLE IF EXISTS user_answers CASCADE;
DROP TABLE IF EXISTS tests CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 2. CREATE TABLES (Khởi tạo cấu trúc các bảng)

-- Bảng 1: USERS 
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'STUDENT' CHECK (role IN ('STUDENT', 'ADMIN', 'TEACHER')),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Bảng 2: QUESTIONS
CREATE TABLE questions (
    id BIGSERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    choices JSONB NOT NULL, 
    correct_answer VARCHAR(10) NOT NULL,
    subject VARCHAR(50) NOT NULL, 
    topic VARCHAR(100),
    difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('EASY', 'MEDIUM', 'HARD')),
    explanation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Bảng 3: TESTS
CREATE TABLE tests (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    score NUMERIC(5, 2) DEFAULT 0.00,
    status VARCHAR(20) NOT NULL DEFAULT 'IN_PROGRESS' CHECK (status IN ('IN_PROGRESS', 'COMPLETED', 'ABORTED')),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Bảng 4: USER_ANSWERS 
CREATE TABLE user_answers (
    id BIGSERIAL PRIMARY KEY,
    test_id BIGINT NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
    question_id BIGINT NOT NULL REFERENCES questions(id) ON DELETE RESTRICT,
    user_answer VARCHAR(10),
    is_correct BOOLEAN DEFAULT FALSE,
    answered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_test_question UNIQUE (test_id, question_id)
);

-- Bảng 5: STUDY_PLANS 
CREATE TABLE study_plans (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    target_score NUMERIC(5, 2) NOT NULL,
    total_days INT NOT NULL DEFAULT 30,
    current_day INT NOT NULL DEFAULT 1,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'COMPLETED', 'PAUSED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Bảng 6: PLAN_TASKS 
CREATE TABLE plan_tasks (
    id BIGSERIAL PRIMARY KEY,
    plan_id BIGINT NOT NULL REFERENCES study_plans(id) ON DELETE CASCADE,
    day_no INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(30) NOT NULL CHECK (type IN ('THEORY', 'PRACTICE', 'QUIZ', 'REVIEW')),
    ref_id BIGINT,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'COMPLETED', 'SKIPPED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_plan_day_title UNIQUE (plan_id, day_no, title)
);

-- 3. INDEXES (Đánh chỉ mục tối ưu hiệu năng)
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_questions_subject_diff ON questions(subject, difficulty);
CREATE INDEX idx_tests_user_status ON tests(user_id, status);
CREATE INDEX idx_user_answers_test ON user_answers(test_id);
CREATE INDEX idx_study_plans_user_status ON study_plans(user_id, status);
CREATE INDEX idx_plan_tasks_plan_day ON plan_tasks(plan_id, day_no);

-- 4. MOCK DATA INSERTION (Tạo dữ liệu mẫu)

-- 4.1 Mock Data: Users
INSERT INTO users (email, password, full_name, role, status) VALUES
('student01@example.com', '$2a$12$eImiTXuWVxfM37uY4JANjOL.8844ZQE7./y73086N075837648372', 'Nguyễn Văn An', 'STUDENT', 'ACTIVE'),
('student02@example.com', '$2a$12$eImiTXuWVxfM37uY4JANjOL.8844ZQE7./y73086N075837648372', 'Trần Thị Bình', 'STUDENT', 'ACTIVE'),
('admin@dgnl.edu.vn', '$2a$12$eImiTXuWVxfM37uY4JANjOL.8844ZQE7./y73086N075837648372', 'Quản Trị Viên', 'ADMIN', 'ACTIVE');

-- 4.2 Mock Data: Questions 
INSERT INTO questions (content, choices, correct_answer, subject, topic, difficulty, explanation) VALUES
(
    'Từ nào dưới đây viết đúng chính tả tiếng Việt?',
    '{"A": "Xơ xát", "B": "Sơ sát", "C": "Sơ xát", "D": "Xơ sát"}'::jsonb,
    'C',
    'Tiếng Việt',
    'Chính tả & Từ vựng',
    'EASY',
    'Chính tả chuẩn tiếng Việt là "Sơ xát" (Sơ: nông, ngoài da; Xát: cọ xát va chạm).'
),
(
    'Chọn từ đúng điền vào chỗ trống: "Anh ấy là một người rất _______, luôn lắng nghe ý kiến người khác."',
    '{"A": "cầu thị", "B": "cầu toàn", "C": "cầu kỳ", "D": "cầu may"}'::jsonb,
    'A',
    'Tiếng Việt',
    'Sử dụng từ ngữ',
    'EASY',
    '"Cầu thị" có nghĩa là có tinh thần học hỏi, sẵn sàng lắng nghe ý kiến đóng góp của người khác.'
),
(
    'Cho mệnh đề: "Nếu trời mưa thì đường ướt". Mệnh đề nào sau đây tương đương về mặt logic?',
    '{"A": "Nếu đường ướt thì trời mưa", "B": "Nếu đường không ướt thì trời không mưa", "C": "Nếu trời không mưa thì đường không ướt", "D": "Đường ướt nên trời chắc chắn mưa"}'::jsonb,
    'B',
    'Logic',
    'Mệnh đề & Phản đảo',
    'MEDIUM',
    'Mệnh đề phản đảo (~B -> ~A) tương đương về mặt giá trị chân lý với mệnh đề kéo theo ban đầu (A -> B).'
),
(
    'Trong một cuộc thi gồm 4 bạn A, B, C, D. Biết rằng: A xếp trên B; C không xếp cuối; D xếp ngay sau A. Hỏi ai là người xếp thứ 2 nếu D xếp thứ 3?',
    '{"A": "Bạn A", "B": "Bạn B", "C": "Bạn C", "D": "Bạn D"}'::jsonb,
    'A',
    'Logic',
    'Suy luận thứ tự',
    'HARD',
    'Vì D xếp thứ 3 và D xếp ngay sau A -> A xếp thứ 2. Thứ tự phù hợp là C (1), A (2), D (3), B (4).'
),
(
    'Trong mặt phẳng OXY, đường thẳng d: 2x - y + 1 = 0 đi qua điểm nào dưới đây?',
    '{"A": "(1, 3)", "B": "(0, 2)", "C": "(2, 1)", "D": "(1, 1)"}'::jsonb,
    'A',
    'Toán',
    'Hình học tọa độ',
    'EASY',
    'Thay tọa độ điểm (1, 3) vào phương trình đường thẳng d: 2(1) - 3 + 1 = 0 (Thỏa mãn).'
),
(
    'Cho hàm số y = x^3 - 3x + 2. Số điểm cực trị của hàm số là:',
    '{"A": "0", "B": "1", "C": "2", "D": "3"}'::jsonb,
    'C',
    'Toán',
    'Khảo sát hàm số',
    'MEDIUM',
    'Đạo hàm y'' = 3x^2 - 3 = 0 có 2 nghiệm phân biệt x = 1 và x = -1, do đó hàm số có 2 điểm cực trị.'
),
(
    'Choose the correct option: "Hardly _____ home when it started to rain heavily."',
    '{"A": "had I arrived", "B": "I had arrived", "C": "did I arrive", "D": "I arrived"}'::jsonb,
    'A',
    'Tiếng Anh',
    'Đảo ngữ (Inversion)',
    'MEDIUM',
    'Cấu trúc đảo ngữ với Hardly: Hardly + had + S + V3/ed + when + S + V2/ed.'
),
(
    'Which word has the underline part pronounced differently: A. clean B. bread C. deal D. lead',
    '{"A": "clean", "B": "bread", "C": "deal", "D": "lead"}'::jsonb,
    'B',
    'Tiếng Anh',
    'Phát âm (Pronunciation)',
    'EASY',
    'Đáp án B "bread" phát âm là /ed/, các từ còn lại phát âm phần gạch chân là /iː/.'
),
(
    'Dung dịch nào sau đây làm quỳ tím chuyển sang màu đỏ?',
    '{"A": "NaOH", "B": "HCl", "C": "NaCl", "D": "C2H5OH"}'::jsonb,
    'B',
    'Khoa học',
    'Hóa học đại cương',
    'EASY',
    'Dung dịch axit clohicđric (HCl) làm quỳ tím hóa đỏ.'
),
(
    'Hiện tượng tự cảm là hiện tượng cảm ứng điện từ xảy ra trong một mạch điện do sự biến thiên của:',
    '{"A": "Cường độ dòng điện trong chính mạch đó", "B": "Từ trường Trái Đất", "C": "Điện áp nguồn ngoài", "D": "Nhiệt độ môi trường"}'::jsonb,
    'A',
    'Khoa học',
    'Vật lý đại cương',
    'MEDIUM',
    'Hiện tượng tự cảm là hiện tượng cảm ứng điện từ xảy ra trong chính mạch khi dòng điện trong mạch đó biến thiên.'
);

-- 4.3 Mock Data: Tests 
INSERT INTO tests (user_id, score, status, started_at, completed_at) VALUES
(1, 80.00, 'COMPLETED', '2026-08-08 08:00:00+07', '2026-08-08 08:45:00+07'),
(2, 0.00, 'IN_PROGRESS', '2026-08-09 10:00:00+07', NULL);

-- 4.4 Mock Data: User Answers 
INSERT INTO user_answers (test_id, question_id, user_answer, is_correct) VALUES
(1, 1, 'C', TRUE),
(1, 2, 'A', TRUE),
(1, 3, 'B', TRUE),
(1, 4, 'C', FALSE),
(1, 5, 'A', TRUE),
(1, 6, 'C', TRUE),
(1, 7, 'A', TRUE),
(1, 8, 'B', TRUE),
(1, 9, 'B', TRUE),
(1, 10, 'C', FALSE);

-- 4.5 Mock Data: Study Plans
INSERT INTO study_plans (user_id, title, target_score, total_days, current_day, status) VALUES
(1, 'Bứt phá ĐGNL 850+ trong 30 ngày', 850.00, 30, 2, 'ACTIVE');

-- 4.6 Mock Data: Plan Tasks
INSERT INTO plan_tasks (plan_id, day_no, title, type, ref_id, status) VALUES
(1, 1, 'Ôn tập Mệnh đề & Quy tắc Phản đảo (Logic)', 'THEORY', NULL, 'COMPLETED'),
(1, 1, 'Luyện tập 10 câu Logic Suy luận thứ tự', 'PRACTICE', 1, 'COMPLETED'),
(1, 2, 'Củng cố Ngữ pháp Đảo ngữ Tiếng Anh', 'THEORY', NULL, 'COMPLETED'),
(1, 2, 'Giải bài tập tự cảm & từ trường (Vật lý)', 'PRACTICE', 2, 'PENDING'),
(1, 2, 'Mini-Quiz tổng hợp Kiến thức Ngày 2', 'QUIZ', 3, 'PENDING');