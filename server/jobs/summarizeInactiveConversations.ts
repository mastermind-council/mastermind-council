import pg from "pg";
import OpenAI from "openai";

const { Client } = pg;
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const connectionString = process.env.DATABASE_URL_NEON || process.env.DATABASE_URL;

/**
 * Background job to generate summaries for inactive conversations
 * Runs every 5 minutes to check for conversations that:
 * - Have no activity for 5+ minutes
 * - Don't have a summary yet
 */
export async function summarizeInactiveConversations() {
  const client = new Client({ connectionString });
  
  try {
    await client.connect();
    
    // Find conversations that need summaries
    // - last_message_at is more than 5 minutes ago
    // - No summary exists in conversation_summaries table
    const result = await client.query(`
      SELECT c.id, c.user_id
      FROM conversations c
      LEFT JOIN conversation_summaries cs ON c.id = cs.conversation_id
      WHERE c.last_message_at < NOW() - INTERVAL '5 minutes'
        AND cs.id IS NULL
      LIMIT 10
    `);

    if (result.rows.length === 0) {
      console.log('[Summarize Job] No inactive conversations found');
      return;
    }

    console.log(`[Summarize Job] Found ${result.rows.length} conversations to summarize`);

    // Process each conversation
    for (const conv of result.rows) {
      try {
        await generateSummary(conv.id);
        console.log(`[Summarize Job] ✅ Generated summary for conversation ${conv.id}`);
      } catch (error) {
        console.error(`[Summarize Job] ❌ Failed to summarize conversation ${conv.id}:`, error);
      }
    }
  } catch (error) {
    console.error('[Summarize Job] Error:', error);
  } finally {
    await client.end();
  }
}

/**
 * Generate summary for a specific conversation
 */
async function generateSummary(conversationId: number) {
  const client = new Client({ connectionString });
  
  try {
    await client.connect();

    // Fetch all messages for this conversation
    const messagesResult = await client.query(
      `SELECT sender, content FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC`,
      [conversationId]
    );

    if (messagesResult.rows.length === 0) {
      console.log(`[Summarize Job] No messages found for conversation ${conversationId}`);
      return;
    }

    // Build conversation text for LLM
    const conversationText = messagesResult.rows
      .map((msg: any) => `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n\n');

    // Call LLM to generate summary
    const summaryPrompt = `Analyze this conversation and generate:
1. A short, engaging title (max 50 characters)
2. A brief summary (1-2 sentences)
3. Key topics discussed (3-5 topics as a JSON array)

Conversation:
${conversationText}

Respond in JSON format:
{
  "title": "...",
  "summary": "...",
  "topics": ["topic1", "topic2", ...]
}`;

    const llmResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that generates conversation summaries.' },
        { role: 'user', content: summaryPrompt }
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'conversation_summary',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              summary: { type: 'string' },
              topics: {
                type: 'array',
                items: { type: 'string' }
              }
            },
            required: ['title', 'summary', 'topics'],
            additionalProperties: false
          }
        }
      }
    });

    const summaryData = JSON.parse(llmResponse.choices[0].message.content || '{}');

    // Store summary in database
    await client.query(
      `INSERT INTO conversation_summaries 
       (conversation_id, summary_text, key_topics, model_used, token_count, created_at) 
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [
        conversationId,
        summaryData.summary,
        JSON.stringify(summaryData.topics),
        'gpt-4o-mini',
        llmResponse.usage?.total_tokens || 0
      ]
    );

    // Update conversation title
    await client.query(
      `UPDATE conversations SET title = $1 WHERE id = $2`,
      [summaryData.title, conversationId]
    );

  } finally {
    await client.end();
  }
}

// Start the job interval (runs every 5 minutes)
let jobInterval: NodeJS.Timeout | null = null;

export function startSummarizeJob() {
  if (jobInterval) {
    console.log('[Summarize Job] Already running');
    return;
  }

  console.log('[Summarize Job] Starting background job (runs every 5 minutes)');
  
  // Run immediately on start
  summarizeInactiveConversations();
  
  // Then run every 5 minutes
  jobInterval = setInterval(() => {
    summarizeInactiveConversations();
  }, 5 * 60 * 1000); // 5 minutes
}

export function stopSummarizeJob() {
  if (jobInterval) {
    clearInterval(jobInterval);
    jobInterval = null;
    console.log('[Summarize Job] Stopped');
  }
}
