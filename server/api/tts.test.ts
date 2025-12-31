import { describe, expect, it } from "vitest";
import OpenAI from "openai";

describe("TTS API Integration", () => {
  it("should successfully generate speech from text", async () => {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: "Hello, this is a test.",
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());

    expect(buffer).toBeDefined();
    expect(buffer.length).toBeGreaterThan(0);
    expect(buffer.length).toBeGreaterThan(1000); // Audio should be substantial
  }, 30000);

  it("should generate speech with Maya's voice (nova)", async () => {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "nova",
      input: "Let's go!",
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());

    expect(buffer).toBeDefined();
    expect(buffer.length).toBeGreaterThan(0);
  }, 30000);
});
