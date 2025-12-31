import { pgTable, serial, varchar, text, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";

/**
 * Core user table backing auth flow.
 * Updated to match Neon PostgreSQL schema with password authentication.
 */
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  open_id: varchar("open_id", { length: 255 }).notNull().unique(),
  first_name: varchar("first_name", { length: 100 }),
  last_name: varchar("last_name", { length: 100 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password_hash: varchar("password_hash", { length: 255 }).notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  last_login_at: timestamp("last_login_at", { withTimezone: true }),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Conversations table - stores conversation sessions
 */
export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull(),
  advisor: varchar("advisor", { length: 50 }).notNull(),
  mode: varchar("mode", { length: 50 }).default("balanced"),
  title: varchar("title", { length: 255 }),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  last_message_at: timestamp("last_message_at", { withTimezone: true }),
});

export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = typeof conversations.$inferInsert;

/**
 * Messages table - stores individual messages in conversations
 */
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversation_id: integer("conversation_id").notNull(),
  sender: varchar("sender", { length: 50 }).notNull(), // 'user' or 'assistant'
  content: text("content").notNull(),
  is_voice: boolean("is_voice").default(false),
  model_used: varchar("model_used", { length: 100 }),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

/**
 * User preferences table - stores user settings and behavioral preferences
 */
export const user_preferences = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull().unique(),
  preferred_advisor: varchar("preferred_advisor", { length: 50 }),
  preferred_mode: varchar("preferred_mode", { length: 50 }),
  preferences: jsonb("preferences"), // Flexible JSON field for miscellaneous settings
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type UserPreference = typeof user_preferences.$inferSelect;
export type InsertUserPreference = typeof user_preferences.$inferInsert;

/**
 * Conversation summaries table - stores AI-generated summaries
 */
export const conversation_summaries = pgTable("conversation_summaries", {
  id: serial("id").primaryKey(),
  conversation_id: integer("conversation_id").notNull().unique(),
  summary_text: text("summary_text"),
  key_topics: jsonb("key_topics"), // JSON array of key topics: ["health", "mindset", "performance"]
  model_used: text("model_used"),
  token_count: integer("token_count"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type ConversationSummary = typeof conversation_summaries.$inferSelect;
export type InsertConversationSummary = typeof conversation_summaries.$inferInsert;

/**
 * Attachments table - stores file attachments for messages
 */
export const attachments = pgTable("attachments", {
  id: serial("id").primaryKey(),
  conversation_id: integer("conversation_id").notNull(),
  message_id: integer("message_id"),
  filename: varchar("filename", { length: 255 }).notNull(),
  mime_type: varchar("mime_type", { length: 100 }).notNull(),
  file_data: text("file_data").notNull(), // Base64 encoded file data
  file_size: integer("file_size").notNull(), // Size in bytes
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Attachment = typeof attachments.$inferSelect;
export type InsertAttachment = typeof attachments.$inferInsert;
