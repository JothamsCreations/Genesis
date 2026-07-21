import { describe, expect, it, vi } from "vitest";

import { generateBlueprint } from "@/lib/blueprint/generation-service";
import { generateMockBlueprint } from "@/lib/blueprint/mock-generator";

const input = {
  idea: "Build a service that helps teachers identify struggling students before examinations.",
  constraints: ["No accounts", "No database"],
};

describe("generateBlueprint", () => {
  it("forces deterministic demo output without calling OpenAI", async () => {
    const requester = vi.fn();

    const first = await generateBlueprint(input, {
      aiMode: "mock",
      apiKey: "configured-but-unused",
      requester,
    });
    const second = await generateBlueprint(input, {
      aiMode: "mock",
      apiKey: "configured-but-unused",
      requester,
    });

    expect(requester).not.toHaveBeenCalled();
    expect(first).toEqual(second);
    expect(first.meta).toMatchObject({
      mode: "mock",
      fallbackReason: "demo_mode",
    });
    expect(first.meta.notice).toMatch(/demo mode/i);
  });

  it("returns a transparent local fallback when no API key is configured", async () => {
    const requester = vi.fn();

    const result = await generateBlueprint(input, { apiKey: "", requester });

    expect(requester).not.toHaveBeenCalled();
    expect(result.meta.mode).toBe("mock");
    expect(result.meta.notice).toMatch(/api key/i);
    expect(result.blueprint.intake.idea).toBe(input.idea);
  });

  it("returns a validated GPT-5.6 blueprint when the model response is valid", async () => {
    const blueprint = generateMockBlueprint(input);
    const requester = vi.fn().mockResolvedValue({
      payload: blueprint,
      requestId: "resp_test_123",
    });

    const result = await generateBlueprint(input, {
      apiKey: "test-key",
      model: "gpt-5.6-sol",
      requester,
    });

    expect(requester).toHaveBeenCalledWith({
      apiKey: "test-key",
      input,
      model: "gpt-5.6-sol",
    });
    expect(result.meta).toMatchObject({
      mode: "openai",
      model: "gpt-5.6-sol",
      requestId: "resp_test_123",
    });
    expect(result.blueprint.purpose.workingTitle).toBe("Learning Signal");
  });

  it("falls back safely when the model returns an invalid blueprint", async () => {
    const requester = vi.fn().mockResolvedValue({ payload: { title: "Incomplete" } });

    const result = await generateBlueprint(input, {
      apiKey: "test-key",
      requester,
    });

    expect(result.meta.mode).toBe("mock");
    expect(result.meta.notice).toMatch(/could not be validated/i);
    expect(result.blueprint.schemaVersion).toBe("1.0");
  });

  it("falls back when a structurally valid response has impossible dependencies", async () => {
    const blueprint = generateMockBlueprint(input);
    blueprint.foundations[0].dependsOn = [blueprint.foundations[1].id];
    const requester = vi.fn().mockResolvedValue({ payload: blueprint });

    const result = await generateBlueprint(input, {
      apiKey: "test-key",
      requester,
    });

    expect(result.meta.mode).toBe("mock");
    expect(result.meta.notice).toMatch(/dependency integrity/i);
  });

  it("falls back safely when the OpenAI request fails", async () => {
    const requester = vi.fn().mockRejectedValue(new Error("network unavailable"));

    const result = await generateBlueprint(input, {
      apiKey: "test-key",
      requester,
    });

    expect(result.meta.mode).toBe("mock");
    expect(result.meta.notice).toMatch(/live analysis was unavailable/i);
  });

  it("identifies quota exhaustion without exposing the provider error", async () => {
    const quotaError = Object.assign(new Error("sensitive provider detail"), {
      status: 429,
      code: "insufficient_quota",
    });
    const requester = vi.fn().mockRejectedValue(quotaError);

    const result = await generateBlueprint(input, {
      aiMode: "auto",
      apiKey: "test-key",
      requester,
    });

    expect(result.meta).toMatchObject({
      mode: "mock",
      fallbackReason: "quota_unavailable",
    });
    expect(result.meta.notice).toMatch(/quota/i);
    expect(result.meta.notice).not.toContain("sensitive provider detail");
  });
});
