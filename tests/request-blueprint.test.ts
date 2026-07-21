import { afterEach, describe, expect, it, vi } from "vitest";

import { generateMockBlueprint } from "@/lib/blueprint/mock-generator";
import { requestBlueprint } from "@/lib/blueprint/request-blueprint";

const input = {
  idea: "Build a service that helps teachers identify struggling students before examinations.",
  constraints: ["No accounts", "No database"],
};

afterEach(() => vi.unstubAllGlobals());

describe("requestBlueprint", () => {
  it("returns a validated result from the blueprint route", async () => {
    const blueprint = generateMockBlueprint(input);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ blueprint, meta: { mode: "openai", model: "gpt-5.6-sol" } }),
    }));

    const result = await requestBlueprint(input);

    expect(result.meta.mode).toBe("openai");
    expect(result.blueprint.purpose.workingTitle).toBe("Learning Signal");
    expect(fetch).toHaveBeenCalledWith("/api/blueprint", expect.objectContaining({ method: "POST" }));
  });

  it("returns the local fallback when the route is unavailable", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));

    const result = await requestBlueprint(input);

    expect(result.meta.mode).toBe("mock");
    expect(result.meta.notice).toMatch(/could not be reached/i);
    expect(result.blueprint.intake).toEqual(input);
  });

  it("rejects a structurally valid response with impossible dependency order", async () => {
    const blueprint = generateMockBlueprint(input);
    blueprint.foundations[0].dependsOn = [blueprint.foundations[1].id];
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ blueprint, meta: { mode: "openai" } }),
    }));

    const result = await requestBlueprint(input);

    expect(result.meta.mode).toBe("mock");
    expect(result.meta.notice).toMatch(/failed local validation/i);
  });

  it("falls back when the route returns a non-success status", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));

    const result = await requestBlueprint(input);

    expect(result.meta.mode).toBe("mock");
    expect(result.meta.notice).toMatch(/could not complete/i);
  });
});
