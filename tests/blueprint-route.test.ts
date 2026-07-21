import { afterEach, describe, expect, it } from "vitest";

import { POST } from "@/app/api/blueprint/route";

const originalKey = process.env.OPENAI_API_KEY;
const originalMode = process.env.GENESIS_AI_MODE;

afterEach(() => {
  if (originalKey) process.env.OPENAI_API_KEY = originalKey;
  else delete process.env.OPENAI_API_KEY;
  if (originalMode) process.env.GENESIS_AI_MODE = originalMode;
  else delete process.env.GENESIS_AI_MODE;
});

describe("POST /api/blueprint", () => {
  it("rejects malformed JSON", async () => {
    const response = await POST(
      new Request("http://localhost/api/blueprint", {
        body: "{not-json",
        headers: { "content-type": "application/json" },
        method: "POST",
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({ error: expect.stringMatching(/valid json/i) });
  });

  it("rejects an underspecified idea", async () => {
    const response = await POST(
      new Request("http://localhost/api/blueprint", {
        body: JSON.stringify({ idea: "Too short", constraints: [] }),
        headers: { "content-type": "application/json" },
        method: "POST",
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({ error: expect.stringMatching(/24 characters/i) });
  });

  it("returns a judgeable local result when a key is not configured", async () => {
    delete process.env.OPENAI_API_KEY;
    const idea = "Create a product architect that orders foundations before visible features.";

    const response = await POST(
      new Request("http://localhost/api/blueprint", {
        body: JSON.stringify({ idea, constraints: [] }),
        headers: { "content-type": "application/json" },
        method: "POST",
      }),
    );
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.meta.mode).toBe("mock");
    expect(result.blueprint.intake.idea).toBe(idea);
  });

  it("uses deterministic demo mode even when an API key exists", async () => {
    process.env.GENESIS_AI_MODE = "mock";
    process.env.OPENAI_API_KEY = "configured-but-unused";
    const idea = "Create a product architect that orders foundations before visible features.";

    const response = await POST(
      new Request("http://localhost/api/blueprint", {
        body: JSON.stringify({ idea, constraints: [] }),
        headers: { "content-type": "application/json" },
        method: "POST",
      }),
    );
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.meta).toMatchObject({ mode: "mock", fallbackReason: "demo_mode" });
    expect(result.blueprint.intake.idea).toBe(idea);
  });
});
