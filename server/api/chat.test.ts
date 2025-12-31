import { describe, expect, it } from "vitest";
import OpenAI from "openai";

describe("Chat API Integration", () => {
  it("should successfully get a chat response from OpenAI", async () => {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const messages = [
      { role: "user" as const, content: "Say hello in one word" },
    ];

    const systemPrompt = `You are Dr. Kai, a compassionate and insightful life coach. Keep responses very brief.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
      temperature: 0.8,
      max_tokens: 50,
    });

    const reply = completion.choices[0]?.message?.content;

    expect(reply).toBeDefined();
    expect(typeof reply).toBe("string");
    expect(reply!.length).toBeGreaterThan(0);
  }, 30000);

  it("should handle Maya advisor personality", async () => {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const messages = [
      { role: "user" as const, content: "Give me one word of encouragement" },
    ];

    const systemPrompt = `You are Maya, a dynamic and energetic life coach. Keep responses very brief.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
      temperature: 0.8,
      max_tokens: 50,
    });

    const reply = completion.choices[0]?.message?.content;

    expect(reply).toBeDefined();
    expect(typeof reply).toBe("string");
    expect(reply!.length).toBeGreaterThan(0);
  }, 30000);
});
