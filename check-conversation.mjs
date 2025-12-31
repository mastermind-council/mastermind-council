import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL_NEON,
  ssl: { rejectUnauthorized: false }
});

async function checkConversation() {
  try {
    // Get the most recent conversation
    const convResult = await pool.query(`
      SELECT c.id, c.advisor, c.mode, c.last_message_at,
             (SELECT COUNT(*) FROM messages WHERE conversation_id = c.id) as message_count
      FROM conversations c
      WHERE c.user_id = (SELECT id FROM users WHERE email = 'kwameanku@gmail.com')
      ORDER BY c.last_message_at DESC
      LIMIT 1
    `);
    
    if (convResult.rows.length === 0) {
      console.log('No conversations found');
      return;
    }
    
    const conv = convResult.rows[0];
    console.log('\n📊 Most Recent Conversation:');
    console.log(`   ID: ${conv.id}`);
    console.log(`   Advisor: ${conv.advisor}`);
    console.log(`   Mode: ${conv.mode}`);
    console.log(`   Total Messages: ${conv.message_count}`);
    console.log(`   Last Message: ${conv.last_message_at}`);
    
    // Get all messages from this conversation
    const msgResult = await pool.query(`
      SELECT id, sender, content, is_voice, created_at
      FROM messages
      WHERE conversation_id = $1
      ORDER BY created_at ASC
    `, [conv.id]);
    
    console.log(`\n💬 All ${msgResult.rows.length} Messages:`);
    msgResult.rows.forEach((msg, i) => {
      const preview = msg.content.substring(0, 60);
      const voiceLabel = msg.is_voice ? ' [VOICE]' : '';
      console.log(`   ${i + 1}. ${msg.sender}${voiceLabel}: "${preview}..."`);
    });
    
    // Simulate what getLastNTurns(4) would return
    const lastTurns = msgResult.rows.slice(-8);
    console.log(`\n🔍 Last 4 Turns (8 messages) - What OpenAI receives:`);
    lastTurns.forEach((msg, i) => {
      const preview = msg.content.substring(0, 60);
      console.log(`   ${i + 1}. ${msg.sender}: "${preview}..."`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

checkConversation();
