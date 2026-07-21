import { describe, expect, it } from "vitest";

import { buildCodexEnvironment } from "../scripts/verify-codex-sdk.mjs";

describe("buildCodexEnvironment", () => {
  it("preserves the CLI login environment while removing Platform API keys", () => {
    const source = {
      Path: "C:\\npm-global;C:\\Windows\\System32",
      USERPROFILE: "C:\\Users\\builder",
      OPENAI_API_KEY: "must-not-reach-codex",
      CODEX_API_KEY: "must-not-reach-codex",
      openai_api_key: "case-insensitive-secret",
      EMPTY_VALUE: undefined,
    };

    const result = buildCodexEnvironment(source);

    expect(result).toEqual({
      Path: source.Path,
      USERPROFILE: source.USERPROFILE,
    });
    expect(source.OPENAI_API_KEY).toBe("must-not-reach-codex");
  });
});
