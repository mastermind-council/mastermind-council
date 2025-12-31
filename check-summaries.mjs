import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL_NEON,
  ssl: { rejectUnauthorized: false }
});

async function checkSummaries() {
  try {
    console.log('🔍 Checking conversation summaries...\n');
    
    // Get all conversations with their summary status
    const result = await pool.query(`
      SELECT 
        c.id,
        c.advisor,
        c.title,
        c.last_message_at,
        c.created_at,
        (SELECT COUNT(*) FROM messages WHERE conversation_id = c.id) as message_count,
        cs.id as summary_id,
        cs.summary_text,
        cs.key_topics,
        cs.created_at as summary_created_at
      FROM conversations c
      LEFT JOIN conversation_summaries cs ON c.id = cs.conversation_id
      WHERE c.user_id = (SELECT id FROM users WHERE email = 'kwameanku@gmail.com')
      ORDER BY c.last_message_at DESC
    `);
    
    console.log(`📊 Found ${result.rows.length} conversations:\n`);
    
    result.rows.forEach((conv, i) => {
      const lastMessageTime = new Date(conv.last_message_at);
      const now = new Date();
      const minutesAgo = Math.floor((now - lastMessageTime) / (1000 * 60));
      
      console.log(`${i + 1}. Conversation ID: ${conv.id}`);
      console.log(`   Advisor: ${conv.advisor}`);
      console.log(`   Title: ${conv.title || 'No title'}`);
      console.log(`   Messages: ${conv.message_count}`);
      console.log(`   Last message: ${minutesAgo} minutes ago`);
      console.log(`   Summary: ${conv.summary_id ? '✅ EXISTS' : '❌ MISSING'}`);
      if (conv.summary_id) {
        console.log(`   Summary text: ${conv.summary_text?.substring(0, 80)}...`);
        console.log(`   Key topics: ${JSON.stringify(conv.key_topics)}`);
      }
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkSummaries();
