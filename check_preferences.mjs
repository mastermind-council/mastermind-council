import pg from 'pg';
const { Client } = pg;

const connectionString = process.env.DATABASE_URL_NEON || 'postgresql://neondb_owner:npg_B4XZyqIb3YMn@ep-sweet-sound-adnxlpoj-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require';

const client = new Client({ connectionString });

try {
  await client.connect();
  console.log('✅ Connected to Neon database\n');
  
  // Check current structure
  const columns = await client.query(`
    SELECT column_name, data_type, column_default
    FROM information_schema.columns
    WHERE table_name = 'user_preferences'
    ORDER BY ordinal_position
  `);
  
  console.log('📋 Current user_preferences table structure:');
  console.table(columns.rows);
  
  // Your design spec
  console.log('\n📋 Your design spec:');
  const needed = [
    'id',
    'user_id',
    'preferences (jsonb)',
    'preferred_advisor',
    'preferred_mode',
    'updated_at'
  ];
  needed.forEach((col, i) => console.log(`${i + 1}. ${col}`));
  
  // Check what needs to be added/removed
  const existing = columns.rows.map(r => r.column_name);
  console.log('\n📋 Analysis:');
  
  const shouldHave = ['id', 'user_id', 'preferences', 'preferred_advisor', 'preferred_mode', 'updated_at'];
  shouldHave.forEach(col => {
    const exists = existing.includes(col);
    console.log(`- ${col}: ${exists ? '✅ EXISTS' : '❌ MISSING'}`);
  });
  
  // Check for extra columns
  console.log('\n📋 Extra columns to consider:');
  existing.forEach(col => {
    if (!shouldHave.includes(col)) {
      console.log(`- ${col}: ⚠️  Not in your design`);
    }
  });
  
} catch (error) {
  console.error('❌ Error:', error.message);
} finally {
  await client.end();
}
