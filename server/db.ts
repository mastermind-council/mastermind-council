import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { 
  InsertUser, 
  users, 
  conversations, 
  InsertConversation, 
  messages, 
  InsertMessage, 
  user_preferences, 
  InsertUserPreference 
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;
let _pool: Pool | null = null;

// Lazily create the drizzle instance for PostgreSQL
export async function getDb() {
  if (!_db && process.env.DATABASE_URL_NEON) {
    try {
      _pool = new Pool({
        connectionString: process.env.DATABASE_URL_NEON,
        ssl: { rejectUnauthorized: false }
      });
      _db = drizzle(_pool);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.open_id) {
    throw new Error("User open_id is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      open_id: user.open_id,
      email: user.email,
      password_hash: user.password_hash,
    };

    if (user.first_name !== undefined) values.first_name = user.first_name;
    if (user.last_name !== undefined) values.last_name = user.last_name;
    if (user.last_login_at !== undefined) values.last_login_at = user.last_login_at;

    if (!values.last_login_at) {
      values.last_login_at = new Date();
    }

    // PostgreSQL upsert using ON CONFLICT
    await db.insert(users).values(values)
      .onConflictDoUpdate({
        target: users.open_id,
        set: {
          first_name: user.first_name,
          last_name: user.last_name,
          last_login_at: new Date(),
        },
      });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.open_id, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Conversation helpers
 */
export async function createConversation(data: InsertConversation) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(conversations).values(data).returning({ id: conversations.id });
  return result[0].id;
}

export async function getConversationById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(conversations).where(eq(conversations.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getConversationsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(conversations)
    .where(eq(conversations.user_id, userId))
    .orderBy(desc(conversations.last_message_at));
}

export async function updateConversationLastMessage(conversationId: number) {
  const db = await getDb();
  if (!db) return;
  
  await db.update(conversations)
    .set({ last_message_at: new Date() })
    .where(eq(conversations.id, conversationId));
}

export async function updateConversationTitle(conversationId: number, title: string) {
  const db = await getDb();
  if (!db) return;
  
  await db.update(conversations)
    .set({ title })
    .where(eq(conversations.id, conversationId));
}

/**
 * Message helpers
 */
export async function createMessage(data: InsertMessage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(messages).values(data).returning({ id: messages.id });
  await updateConversationLastMessage(data.conversation_id);
  return result[0].id;
}

export async function getMessagesByConversationId(conversationId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(messages)
    .where(eq(messages.conversation_id, conversationId))
    .orderBy(messages.created_at);
}

/**
 * Get last N turns (pairs of user+assistant messages) for smart bundle construction
 */
export async function getLastNTurns(conversationId: number, turnCount: number = 4) {
  const db = await getDb();
  if (!db) return [];
  
  // Get last turnCount * 2 messages (each turn = user + assistant)
  const allMessages = await db.select().from(messages)
    .where(eq(messages.conversation_id, conversationId))
    .orderBy(desc(messages.created_at))
    .limit(turnCount * 2);
  
  // Reverse to get chronological order
  return allMessages.reverse();
}

/**
 * User preferences helpers
 */
export async function getUserPreferences(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(user_preferences)
    .where(eq(user_preferences.user_id, userId))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function upsertUserPreferences(data: InsertUserPreference) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(user_preferences).values(data)
    .onConflictDoUpdate({
      target: user_preferences.user_id,
      set: {
        preferred_advisor: data.preferred_advisor,
        preferred_mode: data.preferred_mode,
        preferences: data.preferences,
        updated_at: new Date(),
      },
    });
}
