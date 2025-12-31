import pg from 'pg';
const { Client } = pg;

const connectionString = 'postgresql://neondb_owner:npg_B4XZyqIb3YMn@ep-sweet-sound-adnxlpoj-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require';

const client = new Client({ connectionString });

try {
  await client.connect();
  console.log('✅ Connected to Neon database\n');
  
  // Step 1: Add first_name and last_name columns
  console.log('Adding first_name and last_name columns...');
  await client.query(`
    ALTER TABLE users 
    ADD COLUMN IF NOT EXISTS first_name VARCHAR(255),
    ADD COLUMN IF NOT EXISTS last_name VARCHAR(255)
  `);
  console.log('✅ Columns added\n');
  
  // Step 2: Migrate existing name data
  console.log('Migrating existing name data...');
  const result = await client.query(`
    UPDATE users 
    SET 
      first_name = SPLIT_PART(name, ' ', 1),
      last_name = SPLIT_PART(name, ' ', 2)
    WHERE name IS NOT NULL AND (first_name IS NULL OR last_name IS NULL)
  `);
  console.log(`✅ Migrated ${result.rowCount} user(s)\n`);
  
  // Step 3: Verify the migration
  console.log('Verifying migration...');
  const users = await client.query('SELECT id, name, first_name, last_name, email FROM users');
  console.log('Current users:');
  console.table(users.rows);
  
  console.log('\n✅ Users table migration complete!');
  
} catch (error) {
  console.error('❌ Migration error:', error.message);
} finally {
  await client.end();
}
