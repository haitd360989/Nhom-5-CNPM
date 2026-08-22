-- TASK 3: Practice Module database migration
-- Adds an explicit test type so PRACTICE attempts can be separated from
-- diagnostic and future test types.

ALTER TABLE tests
    ADD COLUMN IF NOT EXISTS type VARCHAR(20) NOT NULL DEFAULT 'DIAGNOSTIC';

ALTER TABLE tests
    DROP CONSTRAINT IF EXISTS chk_tests_type;

ALTER TABLE tests
    ADD CONSTRAINT chk_tests_type
    CHECK (type IN ('DIAGNOSTIC', 'PRACTICE'));

CREATE INDEX IF NOT EXISTS idx_tests_user_type_completed
    ON tests (user_id, type, completed_at DESC);
