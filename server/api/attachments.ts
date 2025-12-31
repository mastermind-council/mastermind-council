import { Router } from "express";
import jwt from "jsonwebtoken";
import pg from "pg";
import multer from "multer";

const { Client } = pg;
const router = Router();

// Neon PostgreSQL connection
const connectionString = process.env.DATABASE_URL_NEON || process.env.DATABASE_URL;

// Configure multer for file upload (memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow images, PDFs, and common document types
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images, PDFs, and documents are allowed.'));
    }
  },
});

// Upload attachment
router.post("/upload", upload.single('file'), async (req, res) => {
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

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { conversationId } = req.body;
    // conversationId can be 'pending' if conversation doesn't exist yet
    const convId = (conversationId && conversationId !== 'pending') ? parseInt(conversationId) : null;

    // Convert file to Base64
    const fileData = req.file.buffer.toString('base64');

    // Connect to database
    await client.connect();

    // Verify user owns this conversation (if provided)
    if (convId) {
      const convCheck = await client.query(
        'SELECT id FROM conversations WHERE id = $1 AND user_id = $2',
        [convId, userId]
      );

      if (convCheck.rows.length === 0) {
        return res.status(403).json({ error: "Forbidden" });
      }
    }

    // Insert attachment (conversation_id can be null initially)
    const result = await client.query(
      `INSERT INTO attachments (conversation_id, filename, mime_type, file_data, file_size, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       RETURNING id, filename, mime_type, file_size, created_at`,
      [convId, req.file.originalname, req.file.mimetype, fileData, req.file.size]
    );

    res.json({ 
      success: true,
      attachment: result.rows[0]
    });
  } catch (error) {
    console.error("Error uploading attachment:", error);
    res.status(500).json({ error: "Failed to upload attachment" });
  } finally {
    await client.end();
  }
});

// Get attachments for a message
router.get("/message/:messageId", async (req, res) => {
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

    const { messageId } = req.params;

    // Connect to database
    await client.connect();

    // Verify user owns the conversation this message belongs to
    const authCheck = await client.query(
      `SELECT a.* FROM attachments a
       JOIN messages m ON a.message_id = m.id
       JOIN conversations c ON m.conversation_id = c.id
       WHERE m.id = $1 AND c.user_id = $2`,
      [messageId, userId]
    );

    res.json({ attachments: authCheck.rows });
  } catch (error) {
    console.error("Error fetching attachments:", error);
    res.status(500).json({ error: "Failed to fetch attachments" });
  } finally {
    await client.end();
  }
});

// Get attachment data by ID
router.get("/:id", async (req, res) => {
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

    const { id } = req.params;

    // Connect to database
    await client.connect();

    // Verify user owns the conversation and get attachment
    const result = await client.query(
      `SELECT a.* FROM attachments a
       JOIN conversations c ON a.conversation_id = c.id
       WHERE a.id = $1 AND c.user_id = $2`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Attachment not found" });
    }

    const attachment = result.rows[0];
    
    // Return attachment with Base64 data
    res.json({ 
      id: attachment.id,
      filename: attachment.filename,
      mimeType: attachment.mime_type,
      fileData: attachment.file_data,
      fileSize: attachment.file_size,
      createdAt: attachment.created_at,
    });
  } catch (error) {
    console.error("Error fetching attachment:", error);
    res.status(500).json({ error: "Failed to fetch attachment" });
  } finally {
    await client.end();
  }
});

export default router;
