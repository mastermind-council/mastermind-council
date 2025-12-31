import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL_NEON,
  ssl: { rejectUnauthorized: false }
});

async function testConnection() {
  try {
    console.log('🔌 Testing Neon PostgreSQL connection...\n');
    
    // Test basic connection
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Connection successful!');
    console.log(`   Server time: ${result.rows[0].now}\n`);
    
    // Check users table
    const usersResult = await pool.query('SELECT id, email, first_name, last_name FROM users');
    console.log(`👥 Users in database: ${usersResult.rows.length}`);
    usersResult.rows.forEach(user => {
      console.log(`   - ${user.email} (ID: ${user.id}, Name: ${user.first_name} ${user.last_name})`);
    });
    
    // Check conversations table
    const convsResult = await pool.query('SELECT COUNT(*) as count FROM conversations');
    console.log(`\n💬 Total conversations: ${convsResult.rows[0].count}`);
    
    // Check messages table
    const msgsResult = await pool.query('SELECT COUNT(*) as count FROM messages');
    console.log(`📨 Total messages: ${msgsResult.rows[0].count}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('   Stack:', error.stack);
  } finally {
    await pool.end();
  }
}

testConnection();
