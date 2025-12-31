import { describe, it, expect } from "vitest";
import { ENV } from "./_core/env";

describe("ElevenLabs API Integration", () => {
  it("should validate ElevenLabs API key and generate audio for Dr. Kai", async () => {
    expect(ENV.elevenLabsApiKey).toBeTruthy();
    expect(ENV.elevenLabsApiKey.length).toBeGreaterThan(0);

    const DR_KAI_VOICE_ID = "Tx7VLgfksXHVnoY6jDGU";
    
    // Test API key by generating a short audio sample
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${DR_KAI_VOICE_ID}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": ENV.elevenLabsApiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: "Hello, this is Dr. Kai.",
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
      console.error("API Error:", response.status, errorText);
    }
    
    expect(response.ok).toBe(true);
    expect(response.headers.get("content-type")).toContain("audio");
    
    const audioBuffer = await response.arrayBuffer();
    expect(audioBuffer.byteLength).toBeGreaterThan(0);
    
    console.log("✓ Dr. Kai's voice generated successfully");
    console.log(`✓ Audio size: ${audioBuffer.byteLength} bytes`);
  });
});
