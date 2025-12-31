-- ============================================
-- PHASE 4: USER_PREFERENCES TABLE VERIFICATION
-- ============================================

-- 1. Check table structure
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    column_default,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'user_preferences'
ORDER BY ordinal_position;

-- 2. Check for foreign key constraints
SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_name = 'user_preferences'
    AND tc.constraint_type = 'FOREIGN KEY';

-- 3. Check for indexes
SELECT
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'user_preferences';

-- 4. Count existing records
SELECT COUNT(*) as total_records FROM user_preferences;

-- 5. Sample data (if any exists)
SELECT * FROM user_preferences LIMIT 5;

-- ============================================
-- EXPECTED STRUCTURE:
-- ============================================
-- id (integer, primary key, auto-increment)
-- user_id (integer, foreign key to users.id)
-- preferred_advisor (varchar)
-- preferred_mode (varchar)
-- preferences (jsonb)
-- created_at (timestamp with time zone)
-- updated_at (timestamp with time zone)
-- 
-- voice_enabled should be REMOVED
-- ============================================
