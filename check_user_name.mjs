import pg from 'pg';
const { Client } = pg;

const connectionString = 'postgresql://neondb_owner:npg_B4XZyqIb3YMn@ep-sweet-sound-adnxlpoj-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require';

const client = new Client({ connectionString });

try {
  await client.connect();
  
  const result = await client.query(`
    SELECT id, name, email, created_at
    FROM users
  `);
  
  console.log('=== CURRENT USER IN YOUR NEON DATABASE ===\n');
  
  if (result.rows.length > 0) {
    const user = result.rows[0];
    console.log(`ID: ${user.id}`);
    console.log(`Name: ${user.name}`);
    console.log(`Email: ${user.email}`);
    console.log(`Created: ${user.created_at}`);
  } else {
    console.log('No users found');
  }
  
} catch (error) {
  console.error('Error:', error.message);
} finally {
  await client.end();
}
