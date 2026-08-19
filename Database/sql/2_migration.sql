-- SUBTASK 2.2: SCHEMA MIGRATIONS & ALTERATIONS

-- The learning-goal UI supports scores up to 1,200. NUMERIC(5,2) only
-- supports values below 1,000, so widen the existing column as well.
ALTER TABLE study_plans
    ALTER COLUMN target_score TYPE NUMERIC(7, 2);

ALTER TABLE users 
    ADD CONSTRAINT chk_users_role CHECK (role IN ('STUDENT', 'TEACHER', 'ADMIN', 'PARENT')),
    ADD CONSTRAINT chk_users_status CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED'));

ALTER TABLE questions 
    ADD CONSTRAINT chk_questions_difficulty CHECK (difficulty IN ('EASY', 'MEDIUM', 'HARD'));

ALTER TABLE tests 
    ADD CONSTRAINT chk_tests_status CHECK (status IN ('IN_PROGRESS', 'COMPLETED', 'CANCELLED'));

ALTER TABLE plan_tasks 
    ADD CONSTRAINT chk_tasks_type CHECK (type IN ('READING', 'QUIZ', 'VIDEO')),
    ADD CONSTRAINT chk_tasks_status CHECK (status IN ('PENDING', 'COMPLETED', 'SKIPPED'));
