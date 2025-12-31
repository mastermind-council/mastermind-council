import pg from 'pg';
const { Client } = pg;

const client = new Client({
  connectionString: process.env.DATABASE_URL_NEON,
  ssl: { rejectUnauthorized: false }
});

try {
  await client.connect();
  
  const result = await client.query(`
    SELECT column_name, data_type
    FROM information_schema.columns
    WHERE table_name = 'conversations'
    ORDER BY ordinal_position;
  `);
  
  console.log('Conversations table columns:');
  console.table(result.rows);
  
} catch (error) {
  console.error('Error:', error.message);
} finally {
  await client.end();
}
