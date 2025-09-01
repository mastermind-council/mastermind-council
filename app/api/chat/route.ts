import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { messages, model } = await req.json();

    // Select the appropriate AI model
    const aiModel = model === 'claude' 
      ? anthropic('claude-3-haiku-20240307')
      : openai('gpt-4o');

    const cleanMessages = messages.filter(msg => 
      msg.content && msg.content.trim().length > 0
    ).map(msg => ({
      role: msg.role,
      content: msg.content.trim()
    }));

    const result = await streamText({
      model: aiModel,
      messages: cleanMessages,
      system: "You are Dr. Kai, a wise AI advisor providing thoughtful guidance and insights.",
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
