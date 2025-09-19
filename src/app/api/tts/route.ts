// app/api/tts/route.ts
import { NextRequest } from 'next/server';

interface TTSRequest {
  text: string;
  voice?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { text, voice = 'coral' }: TTSRequest = await request.json();

    if (!text) {
      return new Response(JSON.stringify({ error: 'Text is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Call OpenAI TTS API
    const openaiResponse = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini-tts',
        voice: voice,
        input: text,
        instructions: 'Speak in a calm, encouraging, and precise tone like Dr. Kai, an Executive Life Coach.',
        response_format: 'mp3'
      }),
    });

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI TTS API error: ${openaiResponse.status}`);
    }

    // Get the audio data and return it directly
    const buffer = await openaiResponse.arrayBuffer();
    return new Response(buffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": buffer.byteLength.toString(),
        "Cache-Control": "public, max-age=3600",
      },
    })
    
    
  } catch (error: any) {
    console.error('TTS API error:', error);
    
    return new Response(JSON.stringify({ 
      error: 'TTS generation failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
