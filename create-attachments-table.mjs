import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL_NEON,
  ssl: { rejectUnauthorized: false }
});

const createTableSQL = `
CREATE TABLE IF NOT EXISTS attachments (
  id SERIAL PRIMARY KEY,
  conversation_id INTEGER NOT NULL,
  message_id INTEGER,
  filename VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  file_data TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
`;

async function createTable() {
  try {
    console.log('Creating attachments table...');
    const result = await pool.query(createTableSQL);
    console.log('✅ Table created successfully!');
    console.log('Result:', result);
    
    // Verify table exists
    const checkResult = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'attachments' 
      ORDER BY ordinal_position
    `);
    console.log('\nTable columns:');
    checkResult.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type}`);
    });
  } catch (error) {
    console.error('❌ Error creating table:', error.message);
    console.error('Full error:', error);
  } finally {
    await pool.end();
  }
}

createTable();
