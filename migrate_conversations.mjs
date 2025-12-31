import pg from 'pg';
const { Client } = pg;

const connectionString = process.env.DATABASE_URL_NEON || 'postgresql://neondb_owner:npg_B4XZyqIb3YMn@ep-sweet-sound-adnxlpoj-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require';

const client = new Client({ connectionString });

try {
  await client.connect();
  console.log('✅ Connected to Neon database\n');
  
  // Step 1: Add mode column
  console.log('Adding mode column...');
  await client.query(`
    ALTER TABLE conversations 
    ADD COLUMN IF NOT EXISTS mode VARCHAR(50) DEFAULT 'balanced'
  `);
  console.log('✅ mode column added\n');
  
  // Step 2: Add last_message_at column
  console.log('Adding last_message_at column...');
  await client.query(`
    ALTER TABLE conversations 
    ADD COLUMN IF NOT EXISTS last_message_at TIMESTAMP
  `);
  console.log('✅ last_message_at column added\n');
  
  // Step 3: Verify the migration
  console.log('Verifying migration...');
  const columns = await client.query(`
    SELECT column_name, data_type, column_default
    FROM information_schema.columns
    WHERE table_name = 'conversations'
    ORDER BY ordinal_position
  `);
  
  console.log('Conversations table structure:');
  console.table(columns.rows);
  
  // Step 4: Check existing data
  const conversations = await client.query('SELECT * FROM conversations LIMIT 5');
  console.log(`\nFound ${conversations.rows.length} existing conversation(s):`);
  if (conversations.rows.length > 0) {
    console.table(conversations.rows);
  }
  
  console.log('\n✅ Conversations table migration complete!');
  
} catch (error) {
  console.error('❌ Migration error:', error.message);
} finally {
  await client.end();
}
