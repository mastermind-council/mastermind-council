-- Phase 4: Remove voice_enabled column from user_preferences table
-- This column is redundant since we track voice usage via messages.is_voice

ALTER TABLE user_preferences 
DROP COLUMN IF EXISTS voice_enabled;

-- Verify the change
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'user_preferences'
ORDER BY ordinal_position;
