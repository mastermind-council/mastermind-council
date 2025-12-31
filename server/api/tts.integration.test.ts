import { describe, it, expect, beforeAll } from "vitest";
import { ENV } from "../_core/env";

describe("TTS API Integration", () => {
  const API_BASE_URL = "http://localhost:3000/api/tts";
  
  beforeAll(() => {
    // Ensure required env vars are present
    expect(ENV.elevenLabsApiKey).toBeTruthy();
    expect(ENV.openAiApiKey).toBeTruthy();
  });

  it("should generate audio using ElevenLabs for Dr. Kai", async () => {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: "Hello, I'm Dr. Kai. Let's work on building your inner power today.",
        advisor: "dr-kai",
      }),
    });

    expect(response.ok).toBe(true);
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("audio/mpeg");
    
    const audioBuffer = await response.arrayBuffer();
    expect(audioBuffer.byteLength).toBeGreaterThan(0);
    
    console.log("✓ Dr. Kai's ElevenLabs voice generated successfully");
    console.log(`✓ Audio size: ${audioBuffer.byteLength} bytes`);
  }, 30000); // 30 second timeout for API call

  it("should generate audio using OpenAI for Maya", async () => {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: "Hello, I'm Maya. Let's explore your creative potential.",
        advisor: "maya",
      }),
    });

    expect(response.ok).toBe(true);
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("audio/mpeg");
    
    const audioBuffer = await response.arrayBuffer();
    expect(audioBuffer.byteLength).toBeGreaterThan(0);
    
    console.log("✓ Maya's OpenAI voice generated successfully");
    console.log(`✓ Audio size: ${audioBuffer.byteLength} bytes`);
  }, 30000);

  it("should return 400 error when text is missing", async () => {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        advisor: "dr-kai",
      }),
    });

    expect(response.ok).toBe(false);
    expect(response.status).toBe(400);
    
    const error = await response.json();
    expect(error.error).toBe("Text is required");
    
    console.log("✓ Validation error handling works correctly");
  });

  it("should handle long text for Dr. Kai", async () => {
    const longText = "This is a longer message from Dr. Kai. ".repeat(20);
    
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: longText,
        advisor: "dr-kai",
      }),
    });

    expect(response.ok).toBe(true);
    expect(response.status).toBe(200);
    
    const audioBuffer = await response.arrayBuffer();
    expect(audioBuffer.byteLength).toBeGreaterThan(0);
    
    console.log("✓ Long text handled successfully");
    console.log(`✓ Audio size for long text: ${audioBuffer.byteLength} bytes`);
  }, 60000); // 60 second timeout for longer text
});
