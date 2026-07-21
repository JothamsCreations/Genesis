import { describe, expect, it } from "vitest";

import { generateMockBlueprint } from "@/lib/blueprint/mock-generator";
import { validateBlueprintSemantics } from "@/lib/blueprint/validate-semantics";

const input = {
  idea: "Build a service that helps teachers identify struggling students before examinations.",
  constraints: ["No accounts", "No database"],
};

describe("validateBlueprintSemantics", () => {
  it("accepts the dependency-ordered local blueprint", () => {
    const result = validateBlueprintSemantics(generateMockBlueprint(input));

    expect(result).toEqual({ valid: true, issues: [] });
  });

  it("requires one finding from every specialist perspective", () => {
    const blueprint = generateMockBlueprint(input);
    blueprint.specialistFindings = blueprint.specialistFindings.map((item) =>
      item.specialist === "architecture" ? { ...item, specialist: "vision" } : item,
    );

    const result = validateBlueprintSemantics(blueprint);

    expect(result.valid).toBe(false);
    expect(result.issues).toContain("Missing specialist finding: architecture.");
  });

  it("rejects forward and unknown foundation dependencies", () => {
    const blueprint = generateMockBlueprint(input);
    blueprint.foundations[0].dependsOn = ["foundation-model", "foundation-missing"];

    const result = validateBlueprintSemantics(blueprint);

    expect(result.valid).toBe(false);
    expect(result.issues).toContain("Foundation foundation-evidence depends on a later foundation: foundation-model.");
    expect(result.issues).toContain("Foundation foundation-evidence has an unknown dependency: foundation-missing.");
  });

  it("rejects duplicate IDs and task references to later tasks", () => {
    const blueprint = generateMockBlueprint(input);
    blueprint.premortem[1].id = blueprint.premortem[0].id;
    blueprint.codexTasks[0].dependencies = [blueprint.codexTasks[2].id];

    const result = validateBlueprintSemantics(blueprint);

    expect(result.valid).toBe(false);
    expect(result.issues).toContain(`Duplicate premortem ID: ${blueprint.premortem[0].id}.`);
    expect(result.issues).toContain(`Task ${blueprint.codexTasks[0].id} depends on a later task: ${blueprint.codexTasks[2].id}.`);
  });

  it("rejects dependency edges that point forward or outside the foundation set", () => {
    const blueprint = generateMockBlueprint(input);
    blueprint.dependencies.push({
      from: "foundation-workflow",
      to: "foundation-evidence",
      reason: "Invalid reverse edge",
    });
    blueprint.dependencies.push({
      from: "foundation-unknown",
      to: "foundation-model",
      reason: "Invalid missing source",
    });

    const result = validateBlueprintSemantics(blueprint);

    expect(result.valid).toBe(false);
    expect(result.issues).toContain("Dependency edge must point forward: foundation-workflow -> foundation-evidence.");
    expect(result.issues).toContain("Dependency edge has an unknown source: foundation-unknown.");
  });
});
