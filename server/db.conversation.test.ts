import { describe, it, expect, beforeAll } from 'vitest';
import { 
  createConversation, 
  createMessage, 
  getConversationById,
  getMessagesByConversationId,
  getLastNTurns,
  getUserPreferences,
  upsertUserPreferences,
  getUserByOpenId
} from './db';
import { ENV } from './_core/env';

describe('Database Conversation Persistence', () => {
  let testUserId: number;
  let testConversationId: number;

  beforeAll(async () => {
    // Get the owner user for testing
    const owner = await getUserByOpenId(ENV.ownerOpenId);
    if (!owner) {
      throw new Error('Owner user not found - ensure database is seeded');
    }
    testUserId = owner.id;
  });

  it('should create a new conversation', async () => {
    testConversationId = await createConversation({
      userId: testUserId,
      advisorId: 'dr-kai',
      mode: 'balanced',
      title: 'Test conversation about productivity',
    });

    expect(testConversationId).toBeGreaterThan(0);

    const conversation = await getConversationById(testConversationId);
    expect(conversation).toBeDefined();
    expect(conversation?.advisorId).toBe('dr-kai');
    expect(conversation?.mode).toBe('balanced');
  });

  it('should create and retrieve messages', async () => {
    // Add user message
    await createMessage({
      conversationId: testConversationId,
      role: 'user',
      content: 'How can I improve my morning routine?',
      isVoice: 0,
    });

    // Add assistant message
    await createMessage({
      conversationId: testConversationId,
      role: 'assistant',
      content: 'Let me help you with that...',
      isVoice: 0,
    });

    const messages = await getMessagesByConversationId(testConversationId);
    expect(messages.length).toBe(2);
    expect(messages[0].role).toBe('user');
    expect(messages[1].role).toBe('assistant');
  });

  it('should retrieve last N turns correctly', async () => {
    // Add more messages to test smart bundle construction
    for (let i = 0; i < 6; i++) {
      await createMessage({
        conversationId: testConversationId,
        role: i % 2 === 0 ? 'user' : 'assistant',
        content: `Message ${i + 3}`,
        isVoice: 0,
      });
    }

    // Get last 4 turns (8 messages)
    const lastTurns = await getLastNTurns(testConversationId, 4);
    expect(lastTurns.length).toBeLessThanOrEqual(8);
    
    // Verify chronological order
    for (let i = 1; i < lastTurns.length; i++) {
      expect(lastTurns[i].createdAt.getTime()).toBeGreaterThanOrEqual(
        lastTurns[i - 1].createdAt.getTime()
      );
    }
  });

  it('should save and retrieve user preferences', async () => {
    await upsertUserPreferences({
      userId: testUserId,
      preferredAdvisor: 'maya',
      preferredMode: 'nurture',
    });

    const prefs = await getUserPreferences(testUserId);
    expect(prefs).toBeDefined();
    expect(prefs?.preferredAdvisor).toBe('maya');
    expect(prefs?.preferredMode).toBe('nurture');

    // Update preferences
    await upsertUserPreferences({
      userId: testUserId,
      preferredAdvisor: 'dr-kai',
      preferredMode: 'catalyst',
    });

    const updatedPrefs = await getUserPreferences(testUserId);
    expect(updatedPrefs?.preferredAdvisor).toBe('dr-kai');
    expect(updatedPrefs?.preferredMode).toBe('catalyst');
  });
});
