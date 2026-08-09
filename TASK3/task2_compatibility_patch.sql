-- TASK 3 compatibility patch for the executable TASK 2 schema.
-- TASK 2's current users.role CHECK allows only ADMIN/TEACHER/STUDENT,
-- while TASK 3 requires the fourth SRS role PARENT.
-- Run this AFTER subtask_2.2.sql if Parent accounts must be stored in PostgreSQL.

ALTER TABLE users
DROP CONSTRAINT IF EXISTS users_role_check;

ALTER TABLE users
ADD CONSTRAINT users_role_check
CHECK (role IN ('STUDENT', 'ADMIN', 'TEACHER', 'PARENT'));
