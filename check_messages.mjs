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
    WHERE table_name = 'messages'
    ORDER BY ordinal_position
  `);
  
  console.log('📋 Current messages table structure:');
  console.table(columns.rows);
  
  // Check what we need to add
  const needed = ['model_used', 'is_voice'];
  const existing = columns.rows.map(r => r.column_name);
  
  console.log('\n📋 Columns needed:');
  needed.forEach(col => {
    const exists = existing.includes(col);
    console.log(`- ${col}: ${exists ? '✅ EXISTS' : '❌ MISSING'}`);
  });
  
} catch (error) {
  console.error('❌ Error:', error.message);
} finally {
  await client.end();
}
