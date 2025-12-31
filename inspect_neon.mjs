import pg from 'pg';
const { Client } = pg;

const connectionString = 'postgresql://neondb_owner:npg_B4XZyqIb3YMn@ep-sweet-sound-adnxlpoj-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require';

const client = new Client({ connectionString });

try {
  await client.connect();
  console.log('✅ Connected to Neon database successfully!\n');
  
  // Get all tables
  const tablesResult = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name;
  `);
  
  console.log('=== TABLES IN YOUR NEON DATABASE ===');
  console.log(`Found ${tablesResult.rows.length} tables:\n`);
  
  if (tablesResult.rows.length === 0) {
    console.log('(No tables found - database is empty)');
  } else {
    for (const row of tablesResult.rows) {
      console.log(`📋 ${row.table_name}`);
    }
  }
  
  console.log('\n=== TABLE STRUCTURES ===\n');
  
  // Get structure of each table
  for (const row of tablesResult.rows) {
    const tableName = row.table_name;
    console.log(`\n--- ${tableName} ---`);
    
    const columnsResult = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = $1
      ORDER BY ordinal_position;
    `, [tableName]);
    
    for (const col of columnsResult.rows) {
      console.log(`  ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? 'NOT NULL' : ''}`);
    }
    
    // Get row count
    const countResult = await client.query(`SELECT COUNT(*) as count FROM "${tableName}"`);
    console.log(`  → ${countResult.rows[0].count} rows`);
  }
  
} catch (error) {
  console.error('❌ Error:', error.message);
} finally {
  await client.end();
}
