import pg from 'pg';
const { Client } = pg;

const connectionString = process.env.DATABASE_URL_NEON || 'postgresql://neondb_owner:npg_B4XZyqIb3YMn@ep-sweet-sound-adnxlpoj-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require';

const client = new Client({ connectionString });

try {
  await client.connect();
  console.log('✅ Connected to Neon database\n');
  
  // Step 1: Add is_voice column
  console.log('Adding is_voice column...');
  await client.query(`
    ALTER TABLE messages 
    ADD COLUMN IF NOT EXISTS is_voice BOOLEAN DEFAULT FALSE
  `);
  console.log('✅ is_voice column added\n');
  
  // Step 2: Rename timestamp to created_at
  console.log('Renaming timestamp to created_at...');
  await client.query(`
    ALTER TABLE messages 
    RENAME COLUMN timestamp TO created_at
  `);
  console.log('✅ Column renamed\n');
  
  // Step 3: Verify the migration
  console.log('Verifying migration...');
  const columns = await client.query(`
    SELECT column_name, data_type, column_default
    FROM information_schema.columns
    WHERE table_name = 'messages'
    ORDER BY ordinal_position
  `);
  
  console.log('Messages table structure:');
  console.table(columns.rows);
  
  // Step 4: Check existing data
  const messages = await client.query('SELECT * FROM messages LIMIT 5');
  console.log(`\nFound ${messages.rows.length} existing message(s):`);
  if (messages.rows.length > 0) {
    console.table(messages.rows);
  }
  
  console.log('\n✅ Messages table migration complete!');
  
} catch (error) {
  console.error('❌ Migration error:', error.message);
} finally {
  await client.end();
}
