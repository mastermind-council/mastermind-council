import pg from 'pg';
const { Client } = pg;

const connectionString = process.env.DATABASE_URL_NEON || 'postgresql://neondb_owner:npg_B4XZyqIb3YMn@ep-sweet-sound-adnxlpoj-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require';

const client = new Client({ connectionString });

try {
  await client.connect();
  console.log('✅ Connected to Neon database\n');
  
  // Convert users table timestamps
  console.log('Converting users table timestamps...');
  await client.query(`
    ALTER TABLE users 
    ALTER COLUMN created_at TYPE TIMESTAMP WITH TIME ZONE,
    ALTER COLUMN last_login_at TYPE TIMESTAMP WITH TIME ZONE
  `);
  console.log('✅ users table updated\n');
  
  // Convert conversations table timestamps
  console.log('Converting conversations table timestamps...');
  await client.query(`
    ALTER TABLE conversations
    ALTER COLUMN created_at TYPE TIMESTAMP WITH TIME ZONE,
    ALTER COLUMN updated_at TYPE TIMESTAMP WITH TIME ZONE,
    ALTER COLUMN last_message_at TYPE TIMESTAMP WITH TIME ZONE
  `);
  console.log('✅ conversations table updated\n');
  
  // Convert messages table timestamp
  console.log('Converting messages table timestamp...');
  await client.query(`
    ALTER TABLE messages
    ALTER COLUMN timestamp TYPE TIMESTAMP WITH TIME ZONE
  `);
  console.log('✅ messages table updated\n');
  
  // Convert user_preferences table timestamps
  console.log('Converting user_preferences table timestamps...');
  await client.query(`
    ALTER TABLE user_preferences
    ALTER COLUMN created_at TYPE TIMESTAMP WITH TIME ZONE,
    ALTER COLUMN updated_at TYPE TIMESTAMP WITH TIME ZONE
  `);
  console.log('✅ user_preferences table updated\n');
  
  // Convert conversation_summaries table timestamp
  console.log('Converting conversation_summaries table timestamp...');
  await client.query(`
    ALTER TABLE conversation_summaries
    ALTER COLUMN created_at TYPE TIMESTAMP WITH TIME ZONE
  `);
  console.log('✅ conversation_summaries table updated\n');
  
  // Verify all changes
  console.log('Verifying all timestamp columns...');
  const result = await client.query(`
    SELECT 
      table_name,
      column_name,
      data_type
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND column_name LIKE '%_at' OR column_name = 'timestamp'
    ORDER BY table_name, ordinal_position
  `);
  
  console.log('All timestamp columns:');
  console.table(result.rows);
  
  console.log('\n✅ All timestamps converted to TIMESTAMP WITH TIME ZONE!');
  
} catch (error) {
  console.error('❌ Conversion error:', error.message);
} finally {
  await client.end();
}
