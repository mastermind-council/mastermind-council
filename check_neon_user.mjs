import pg from 'pg';
const { Client } = pg;

const connectionString = 'postgresql://neondb_owner:npg_B4XZyqIb3YMn@ep-sweet-sound-adnxlpoj-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require';

const client = new Client({ connectionString });

try {
  await client.connect();
  
  // Get user data (without password hash)
  const result = await client.query(`
    SELECT id, name, email, created_at, last_login_at
    FROM users
  `);
  
  console.log('=== USER IN YOUR NEON DATABASE ===\n');
  console.log(JSON.stringify(result.rows, null, 2));
  
} catch (error) {
  console.error('Error:', error.message);
} finally {
  await client.end();
}
