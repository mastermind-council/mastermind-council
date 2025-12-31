import { describe, expect, it } from "vitest";
import OpenAI from "openai";

describe("OpenAI API Key Validation", () => {
  it("should successfully authenticate with OpenAI API", async () => {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Make a lightweight API call to validate the key
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "test" }],
      max_tokens: 5,
    });
    
    expect(response).toBeDefined();
    expect(response.choices).toBeDefined();
    expect(Array.isArray(response.choices)).toBe(true);
    expect(response.choices.length).toBeGreaterThan(0);
  }, 30000); // 30 second timeout for API call
});
