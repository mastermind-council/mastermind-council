-- ============================================
-- PHASE 5: CONVERSATION_SUMMARIES TABLE MIGRATION
-- ============================================

-- 1. Rename 'summary' column to 'summary_text'
ALTER TABLE conversation_summaries 
RENAME COLUMN summary TO summary_text;

-- 2. Rename 'model' column to 'model_used'
ALTER TABLE conversation_summaries 
RENAME COLUMN model TO model_used;

-- 3. Add 'key_topics' column (jsonb)
ALTER TABLE conversation_summaries 
ADD COLUMN key_topics jsonb;

-- ============================================
-- VERIFICATION QUERY
-- ============================================
SELECT 
    column_name,
    data_type,
    column_default
FROM information_schema.columns
WHERE table_name = 'conversation_summaries'
ORDER BY ordinal_position;

-- ============================================
-- EXPECTED FINAL STRUCTURE:
-- ============================================
-- id (integer, primary key, auto-increment)
-- conversation_id (integer, foreign key to conversations.id)
-- summary_text (text)
-- model_used (text)
-- token_count (integer)
-- key_topics (jsonb) -- NEW
-- created_at (timestamp with time zone)
-- ============================================
