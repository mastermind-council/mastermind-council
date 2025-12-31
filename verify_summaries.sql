-- Simple verification query for conversation_summaries table
SELECT 
    column_name,
    data_type,
    column_default
FROM information_schema.columns
WHERE table_name = 'conversation_summaries'
ORDER BY ordinal_position;
