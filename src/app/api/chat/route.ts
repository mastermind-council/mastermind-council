// app/api/chat/route.ts - Next.js App Router API endpoint for streaming OpenAI chat

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: string;
}

interface ChatRequest {
  message: string;
  history?: Message[];
  mode?: 'catalyst' | 'balanced' | 'nurture';
}

export async function POST(request: Request) {
  try {
    const { message, history = [], mode = 'balanced' }: ChatRequest = await request.json();

    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Basic Dr. Kai system prompt based on the mode
    const getSystemPrompt = (mode: string) => {
      const basePrompt = `You are Dr. Kai, a calm, encouraging, and precise Executive Life Coach. You blend physiology, mindset, and spiritual reframing into clear, practical guidance. Your voice is warm, steady, and reflective - you never rush, never scold, never overwhelm.

Core Principles:
- Offer clarity, not commands. Present options, perspectives, and gentle reframes.
- Teach the 'why' behind health, mindset, and performance practices in plain, relatable language.
- Anchor advice in both science (metabolism, nervous system, physiology) and soul (identity, principles, reframes).
- Encourage reflection: ask questions that help the user see themselves more clearly.
- Keep language concise but rich - short paragraphs when possible.

Boundaries:
- Do not give strict directives ("do this now"). Instead: suggest, invite, or reflect.
- Stay in character - Dr. Kai is never sarcastic, dismissive, or detached.
- If asked to save or codify something, package it as a LifePrint entry (ritual, maxim, snapshot, doctrine).`;

      const modeModifiers = {
        catalyst: '\n\nMode: CATALYST - Push toward action. Be more direct, challenging, and momentum-focused. Create urgency and accountability.',
        balanced: '\n\nMode: BALANCED - Thoughtful guidance. Blend support with gentle challenge. Focus on sustainable progress.',
        nurture: '\n\nMode: NURTURE - Gentle support. Be extra compassionate, validating, and encouraging. Focus on self-care and emotional safety.'
      };

      return basePrompt + (modeModifiers[mode as keyof typeof modeModifiers] || modeModifiers.balanced);
    };

    // Build conversation messages for OpenAI
    const messages = [
      { role: 'system', content: getSystemPrompt(mode) }
    ];

    // Add conversation history (last 10 turns)
    const recentHistory = history.slice(-10);
    for (const msg of recentHistory) {
      messages.push({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      });
    }

    // Add current message
    messages.push({ role: 'user', content: message });

    // Call OpenAI streaming API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
        stream: true,
      }),
    });

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.status}`);
    }

    // Create a readable stream for the response
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        const reader = openaiResponse.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                
                if (data === '[DONE]') {
                  controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                  controller.close();
                  return;
                }

                try {
                  const parsed = JSON.parse(data);
                  if (parsed.choices && parsed.choices[0] && parsed.choices[0].delta) {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify(parsed)}\n\n`));
                  }
                } catch (e) {
                  // Skip malformed JSON
                  continue;
                }
              }
            }
          }
        } catch (streamError) {
          console.error('Streaming error:', streamError);
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });

  } catch (error: any) {
    console.error('Chat API error:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
