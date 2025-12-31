import pg from 'pg';
const { Client } = pg;

const connectionString = process.env.DATABASE_URL_NEON || 'postgresql://neondb_owner:npg_B4XZyqIb3YMn@ep-sweet-sound-adnxlpoj-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require';

const client = new Client({ connectionString });

try {
  await client.connect();
  console.log('✅ Connected to Neon database\n');
  
  // Get all tables
  const tables = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name
  `);
  
  console.log('📋 Existing tables in your Neon database:');
  tables.rows.forEach((row, i) => {
    console.log(`${i + 1}. ${row.table_name}`);
  });
  
  console.log('\n📋 Tables we need for Master Mind Council:');
  const needed = [
    'users',
    'conversations', 
    'messages',
    'user_preferences',
    'conversation_summaries'
  ];
  
  needed.forEach((table, i) => {
    const exists = tables.rows.some(row => row.table_name === table);
    console.log(`${i + 1}. ${table} ${exists ? '✅ EXISTS' : '❌ MISSING'}`);
  });
  
} catch (error) {
  console.error('❌ Error:', error.message);
} finally {
  await client.end();
}
