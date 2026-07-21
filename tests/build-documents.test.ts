import { describe, expect, it } from "vitest";

import { buildBlueprintDocuments } from "@/lib/blueprint/build-documents";
import { FIELD_SHIELD_INITIAL_IDEA, generateFieldShieldBlueprint } from "@/lib/demo/fieldshield";

describe("buildBlueprintDocuments", () => {
  it("creates the seven visible FieldShield build documents from one blueprint", () => {
    const blueprint = generateFieldShieldBlueprint({ idea: FIELD_SHIELD_INITIAL_IDEA, constraints: [] });
    const documents = buildBlueprintDocuments(blueprint);

    expect(documents.map((document) => document.filename)).toEqual([
      "PRODUCT.md",
      "USER-FLOWS.md",
      "PREMORTEM.md",
      "ARCHITECTURE.md",
      "BUILD-ORDER.md",
      "TASKS.md",
      "ACCEPTANCE-CRITERIA.md",
    ]);
    expect(documents.find((document) => document.filename === "PREMORTEM.md")?.markdown).toMatch(/Early warning/i);
    expect(documents.find((document) => document.filename === "TASKS.md")?.markdown).toMatch(/Implementation boundaries/i);
    expect(documents.find((document) => document.filename === "TASKS.md")?.markdown).toMatch(/Definition of completion/i);
    expect(documents.every((document) => document.markdown.includes("FieldShield"))).toBe(true);
  });
});
