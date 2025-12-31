import pg from 'pg';
import OpenAI from 'openai';

const { Client } = pg;
const connectionString = process.env.DATABASE_URL_NEON || process.env.DATABASE_URL;
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function testSummarizeJob() {
  const client = new Client({ connectionString });
  
  try {
    await client.connect();
    console.log('🔍 Checking for conversations needing summaries...\n');
    
    // Find conversations that need summaries
    const result = await client.query(`
      SELECT c.id, c.user_id, c.last_message_at,
             EXTRACT(EPOCH FROM (NOW() - c.last_message_at)) / 60 as minutes_ago
      FROM conversations c
      LEFT JOIN conversation_summaries cs ON c.id = cs.conversation_id
      WHERE cs.id IS NULL
        AND c.last_message_at < NOW() - INTERVAL '5 minutes'
      ORDER BY c.last_message_at DESC
    `);
    
    console.log(`Found ${result.rows.length} conversations needing summaries:\n`);
    
    result.rows.forEach((conv) => {
      console.log(`- Conversation ID: ${conv.id}`);
      console.log(`  User ID: ${conv.user_id}`);
      console.log(`  Last message: ${Math.floor(conv.minutes_ago)} minutes ago`);
      console.log('');
    });
    
    if (result.rows.length === 0) {
      console.log('✅ All conversations are either too recent or already have summaries!');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

testSummarizeJob();
