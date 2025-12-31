import pg from 'pg';
const { Client } = pg;

const client = new Client({
  connectionString: process.env.DATABASE_URL_NEON,
  ssl: { rejectUnauthorized: false }
});

try {
  await client.connect();
  console.log('✅ Connected to Neon database\n');

  // Get current table structure
  const result = await client.query(`
    SELECT 
      column_name,
      data_type,
      column_default
    FROM information_schema.columns
    WHERE table_name = 'conversation_summaries'
    ORDER BY ordinal_position;
  `);

  console.log('📋 Current conversation_summaries table structure:');
  console.table(result.rows);

  // Your design spec
  const designSpec = [
    'id',
    'conversation_id',
    'summary_text',
    'key_topics',
    'model_used',
    'token_count',
    'created_at'
  ];

  console.log('\n📋 Your design spec:');
  designSpec.forEach((col, i) => console.log(`${i + 1}. ${col}`));

  // Analysis
  console.log('\n📋 Analysis:');
  const existingColumns = result.rows.map(r => r.column_name);
  
  designSpec.forEach(col => {
    if (existingColumns.includes(col)) {
      console.log(`- ${col}: ✅ EXISTS`);
    } else {
      console.log(`- ${col}: ❌ MISSING`);
    }
  });

  // Extra columns
  const extraColumns = existingColumns.filter(col => !designSpec.includes(col));
  if (extraColumns.length > 0) {
    console.log('\n📋 Extra columns to consider:');
    extraColumns.forEach(col => {
      console.log(`- ${col}: ⚠️  Not in your design`);
    });
  }

} catch (error) {
  console.error('❌ Error:', error.message);
} finally {
  await client.end();
}
