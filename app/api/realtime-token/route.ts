import { NextResponse } from 'next/server';

export async function POST() {
  try {
    console.log('=== Enhanced Realtime Token Request ===');
    console.log('OpenAI API Key present:', !!process.env.OPENAI_API_KEY);

    // Simplified request structure based on OpenAI docs
    const sessionConfig = {
      session: {
        type: "realtime",
        model: "gpt-4o-realtime-preview-2024-10-01",
        instructions: "You are Dr. Kai, an executive life coach with expertise in elite performance and holistic health. Provide thoughtful, scientific guidance while maintaining a warm, authoritative presence."
      }
    };

    console.log('Making request to OpenAI client_secrets endpoint...');
    const response = await fetch('https://api.openai.com/v1/realtime/client_secrets', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sessionConfig),
    });

    console.log('OpenAI response status:', response.status);

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI error response:', error);
      return NextResponse.json({ 
        error: 'Failed to create session', 
        details: error,
        status: response.status 
      }, { status: 500 });
    }

    const data = await response.json();
    console.log('OpenAI success - token created');
    
    return NextResponse.json({ 
      client_secret: data.value,
      expires_at: data.expires_at
    });

  } catch (error) {
    console.error('Enhanced token route error:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error.message 
    }, { status: 500 });
  }
}
