ALTER TABLE users 
DROP CONSTRAINT IF EXISTS chk_users_role;

ALTER TABLE users 
DROP CONSTRAINT IF EXISTS users_role_check;

ALTER TABLE users 
ADD CONSTRAINT chk_users_role 
CHECK (role IN ('STUDENT', 'TEACHER', 'ADMIN', 'PARENT'));
CREATE TABLE IF NOT EXISTS student_parents (
    id BIGSERIAL PRIMARY KEY,
    parent_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    student_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_parent_student UNIQUE (parent_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_student_parents_parent_id 
    ON student_parents(parent_id);

CREATE INDEX IF NOT EXISTS idx_student_parents_student_id 
    ON student_parents(student_id);
COMMENT ON TABLE student_parents IS 'Bảng liên kết quan hệ 1-N giữa tài khoản Phụ huynh và Học sinh';
INSERT INTO users (email, password, full_name, role, status, created_at, updated_at)
VALUES (
    'parent@example.com',
    '$2b$12$e80yqRvi4Pfq9MfZ23lRDeFm4e2g9z5r27A/r1gJt6yK5rB3A2Cqm',
    'Phụ Huynh Mẫu',
    'PARENT',
    'ACTIVE',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (email) DO UPDATE 
SET role = 'PARENT', status = 'ACTIVE';

INSERT INTO student_parents (parent_id, student_id)
SELECT p.id, s.id
FROM users p, users s
WHERE p.email = 'parent@example.com'
  AND s.role = 'STUDENT'
ORDER BY s.id ASC
LIMIT 1
ON CONFLICT (parent_id, student_id) DO NOTHING;