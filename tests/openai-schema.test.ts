import { zodTextFormat } from "openai/helpers/zod";
import { describe, expect, it } from "vitest";

import { productBlueprintSchema } from "@/lib/blueprint/schema";

describe("OpenAI product blueprint schema", () => {
  it("avoids unsupported string length keywords in strict Structured Outputs", () => {
    const format = zodTextFormat(productBlueprintSchema, "product_blueprint");
    const serialized = JSON.stringify(format);

    expect(serialized).not.toContain("minLength");
    expect(serialized).not.toContain("maxLength");
    expect(serialized).toContain("pattern");
  });
});
