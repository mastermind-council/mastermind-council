import { Router } from "express";
import jwt from "jsonwebtoken";
import pg from "pg";
import OpenAI from "openai";

const { Client } = pg;
const router = Router();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Neon PostgreSQL connection
const connectionString = process.env.DATABASE_URL_NEON || process.env.DATABASE_URL;

// Get user's conversations
router.get("/", async (req, res) => {
  const client = new Client({ connectionString });
  
  try {
    // Get user from JWT token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as any;
    const userId = decoded.id;

    if (!userId) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Connect to database
    await client.connect();

    // Fetch user's conversations with message count and summary
    const result = await client.query(
      `SELECT 
         c.id, 
         c.advisor, 
         c.mode, 
         c.title, 
         c.created_at, 
         c.last_message_at,
         COUNT(m.id) as message_count,
         cs.summary_text as summary,
         cs.key_topics
       FROM conversations c
       LEFT JOIN messages m ON c.id = m.conversation_id
       LEFT JOIN conversation_summaries cs ON c.id = cs.conversation_id
       WHERE c.user_id = $1 
       GROUP BY c.id, cs.summary_text, cs.key_topics
       ORDER BY c.last_message_at DESC`,
      [userId]
    );

    res.json({ conversations: result.rows });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ error: "Failed to fetch conversations" });
  } finally {
    await client.end();
  }
});

// Get specific conversation with messages
router.get("/:conversationId", async (req, res) => {
  const client = new Client({ connectionString });
  
  try {
    // Get user from JWT token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as any;
    const userId = decoded.id;

    if (!userId) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const conversationId = parseInt(req.params.conversationId);

    // Connect to database
    await client.connect();

    // Verify conversation belongs to user
    const convResult = await client.query(
      `SELECT id, advisor FROM conversations WHERE id = $1 AND user_id = $2`,
      [conversationId, userId]
    );

    if (convResult.rows.length === 0) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    const conversation = convResult.rows[0];

    // Fetch all messages for this conversation
    const messagesResult = await client.query(
      `SELECT id, sender, content, is_voice, created_at 
       FROM messages 
       WHERE conversation_id = $1 
       ORDER BY created_at ASC`,
      [conversationId]
    );

    // Fetch attachments for all messages in this conversation
    const attachmentsResult = await client.query(
      `SELECT a.id, a.message_id, a.filename, a.mime_type, a.file_data, a.file_size, a.created_at
       FROM attachments a
       INNER JOIN messages m ON a.message_id = m.id
       WHERE m.conversation_id = $1
       ORDER BY a.created_at ASC`,
      [conversationId]
    );

    // Group attachments by message_id
    const attachmentsByMessage: Record<number, any[]> = {};
    for (const attachment of attachmentsResult.rows) {
      if (!attachmentsByMessage[attachment.message_id]) {
        attachmentsByMessage[attachment.message_id] = [];
      }
      attachmentsByMessage[attachment.message_id].push(attachment);
    }

    // Add attachments to messages
    const messagesWithAttachments = messagesResult.rows.map(msg => ({
      ...msg,
      attachments: attachmentsByMessage[msg.id] || []
    }));

    res.json({
      conversation,
      messages: messagesWithAttachments
    });
  } catch (error: any) {
    console.error("Error fetching conversation:", error);
    console.error("Error details:", error?.message, error?.stack);
    res.status(500).json({ error: "Failed to fetch conversation", details: error?.message });
  } finally {
    await client.end();
  }
});

// Generate conversation summary
router.post("/:conversationId/summarize", async (req, res) => {
  const client = new Client({ connectionString });
  
  try {
    // Get user from JWT token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as any;
    const userId = decoded.id;

    if (!userId) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const conversationId = parseInt(req.params.conversationId);

    // Connect to database
    await client.connect();

    // Verify conversation belongs to user
    const convResult = await client.query(
      `SELECT id, advisor FROM conversations WHERE id = $1 AND user_id = $2`,
      [conversationId, userId]
    );

    if (convResult.rows.length === 0) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    // Check if summary already exists
    const existingSummary = await client.query(
      `SELECT id FROM conversation_summaries WHERE conversation_id = $1`,
      [conversationId]
    );

    if (existingSummary.rows.length > 0) {
      return res.status(200).json({ message: "Summary already exists" });
    }

    // Fetch all messages for this conversation
    const messagesResult = await client.query(
      `SELECT sender, content FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC`,
      [conversationId]
    );

    if (messagesResult.rows.length === 0) {
      return res.status(400).json({ error: "No messages to summarize" });
    }

    // Build conversation text for LLM
    const conversationText = messagesResult.rows
      .map(msg => `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
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
    const insertResult = await client.query(
      `INSERT INTO conversation_summaries 
       (conversation_id, summary_text, key_topics, model_used, token_count, created_at) 
       VALUES ($1, $2, $3, $4, $5, NOW()) 
       RETURNING id`,
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

    res.json({
      success: true,
      summary: {
        id: insertResult.rows[0].id,
        title: summaryData.title,
        summary: summaryData.summary,
        topics: summaryData.topics
      }
    });
  } catch (error) {
    console.error("Error generating summary:", error);
    res.status(500).json({ error: "Failed to generate summary" });
  } finally {
    await client.end();
  }
});

export default router;
