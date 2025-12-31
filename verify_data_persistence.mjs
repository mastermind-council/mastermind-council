import pg from 'pg';
const { Client } = pg;

const client = new Client({
  connectionString: process.env.DATABASE_URL_NEON,
  ssl: { rejectUnauthorized: false }
});

try {
  await client.connect();
  console.log('✅ Connected to Neon database\n');

  // 1. Check users table
  console.log('═══════════════════════════════════════════════════');
  console.log('1. USERS TABLE');
  console.log('═══════════════════════════════════════════════════');
  const users = await client.query(`
    SELECT id, first_name, last_name, email, created_at, last_login_at
    FROM users
    ORDER BY id DESC
    LIMIT 5;
  `);
  console.table(users.rows);

  // 2. Check conversations table
  console.log('\n═══════════════════════════════════════════════════');
  console.log('2. CONVERSATIONS TABLE');
  console.log('═══════════════════════════════════════════════════');
  const conversations = await client.query(`
    SELECT id, user_id, advisor, mode, title, created_at, last_message_at
    FROM conversations
    ORDER BY id DESC
    LIMIT 5;
  `);
  console.table(conversations.rows);

  // 3. Check messages table
  console.log('\n═══════════════════════════════════════════════════');
  console.log('3. MESSAGES TABLE (Last 10 messages)');
  console.log('═══════════════════════════════════════════════════');
  const messages = await client.query(`
    SELECT 
      id, 
      conversation_id, 
      sender, 
      LEFT(content, 50) as content_preview,
      is_voice,
      model_used,
      created_at
    FROM messages
    ORDER BY id DESC
    LIMIT 10;
  `);
  console.table(messages.rows);

  // 4. Check user_preferences table
  console.log('\n═══════════════════════════════════════════════════');
  console.log('4. USER PREFERENCES TABLE');
  console.log('═══════════════════════════════════════════════════');
  const preferences = await client.query(`
    SELECT id, user_id, preferred_advisor, preferred_mode, created_at, updated_at
    FROM user_preferences
    ORDER BY id DESC
    LIMIT 5;
  `);
  console.table(preferences.rows);

  // 5. Summary counts
  console.log('\n═══════════════════════════════════════════════════');
  console.log('5. SUMMARY COUNTS');
  console.log('═══════════════════════════════════════════════════');
  
  const userCount = await client.query('SELECT COUNT(*) as count FROM users');
  const convCount = await client.query('SELECT COUNT(*) as count FROM conversations');
  const msgCount = await client.query('SELECT COUNT(*) as count FROM messages');
  const voiceMsgCount = await client.query('SELECT COUNT(*) as count FROM messages WHERE is_voice = true');
  const textMsgCount = await client.query('SELECT COUNT(*) as count FROM messages WHERE is_voice = false');
  const prefCount = await client.query('SELECT COUNT(*) as count FROM user_preferences');

  console.log(`Total Users: ${userCount.rows[0].count}`);
  console.log(`Total Conversations: ${convCount.rows[0].count}`);
  console.log(`Total Messages: ${msgCount.rows[0].count}`);
  console.log(`  - Voice Messages: ${voiceMsgCount.rows[0].count}`);
  console.log(`  - Text Messages: ${textMsgCount.rows[0].count}`);
  console.log(`Total User Preferences: ${prefCount.rows[0].count}`);

  console.log('\n✅ Data persistence verification complete!');

} catch (error) {
  console.error('❌ Error:', error.message);
  console.error('Full error:', error);
} finally {
  await client.end();
}
