import { Router } from "express";
import OpenAI from "openai";
import { ENV } from "../_core/env";

const router = Router();

const openai = new OpenAI({
  apiKey: ENV.openAiApiKey,
});

// Map advisors to voices
const advisorVoices: Record<string, string> = {
  'dr-kai': 'ash', // Fallback if ElevenLabs fails
  'maya': 'shimmer',
  'michael': 'echo',
  'giselle': 'alloy',
  'jasmine': 'nova',
  'sensei': 'onyx',
};

// ElevenLabs voice IDs
const elevenLabsVoices: Record<string, string> = {
  'dr-kai': '9IzcwKmvwJcw58h3KnlH',
};

// Strip markdown formatting from text before TTS
function stripMarkdown(text: string): string {
  return text
    // Remove bold (**text** or __text__)
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/__(.+?)__/g, '$1')
    // Remove italic (*text* or _text_)
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/_(.+?)_/g, '$1')
    // Remove strikethrough (~~text~~)
    .replace(/~~(.+?)~~/g, '$1')
    // Remove inline code (`code`)
    .replace(/`(.+?)`/g, '$1')
    // Remove headers (# ## ### etc)
    .replace(/^#{1,6}\s+/gm, '')
    // Remove links [text](url) -> text
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    // Remove list markers (- * +)
    .replace(/^[\-\*\+]\s+/gm, '')
    // Remove blockquotes (>)
    .replace(/^>\s+/gm, '')
    // Clean up any remaining multiple spaces
    .replace(/\s+/g, ' ')
    .trim();
}

// Generate speech using ElevenLabs
async function generateElevenLabsSpeech(text: string, voiceId: string): Promise<Buffer> {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": ENV.elevenLabsApiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`ElevenLabs API error: ${response.status} ${errorText}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

// Return audio directly (matching original Next.js behavior)
router.post("/", async (req, res) => {
  try {
    const { text, voice, advisor = 'dr-kai' } = req.body;

    console.log('🔊 TTS Request:', { textLength: text?.length, advisor });

    // Strip markdown formatting before TTS
    const cleanText = stripMarkdown(text);
    console.log('🧹 Cleaned text:', { original: text.substring(0, 50), cleaned: cleanText.substring(0, 50) });

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    let buffer: Buffer;
    let contentType = "audio/mpeg";

    // Use ElevenLabs for Dr. Kai if available
    if (advisor === 'dr-kai' && elevenLabsVoices['dr-kai'] && ENV.elevenLabsApiKey) {
      try {
        console.log('🎙️ Using ElevenLabs for Dr. Kai');
        buffer = await generateElevenLabsSpeech(cleanText, elevenLabsVoices['dr-kai']);
      } catch (error: any) {
        console.error('⚠️ ElevenLabs failed, falling back to OpenAI:', error.message);
        // Fallback to OpenAI
        const selectedVoice = voice || advisorVoices[advisor] || 'ash';
        const mp3 = await openai.audio.speech.create({
          model: "tts-1",
          voice: selectedVoice as any,
          input: cleanText,
        });
        buffer = Buffer.from(await mp3.arrayBuffer());
      }
    } else {
      // Use OpenAI for other advisors
      const selectedVoice = voice || advisorVoices[advisor] || 'ash';
      console.log('🎙️ Using OpenAI voice:', selectedVoice);
      const mp3 = await openai.audio.speech.create({
        model: "tts-1",
        voice: selectedVoice as any,
        input: cleanText,
      });
      buffer = Buffer.from(await mp3.arrayBuffer());
    }

    res.set({
      "Content-Type": contentType,
      "Content-Length": buffer.byteLength.toString(),
      "Cache-Control": "public, max-age=3600",
      "Access-Control-Allow-Origin": "*",
    });

    res.send(buffer);
  } catch (error: any) {
    console.error("TTS Error:", error);
    res.status(500).json({ 
      error: error.message || "Failed to generate speech",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;
