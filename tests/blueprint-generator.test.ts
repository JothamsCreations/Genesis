import { describe, expect, it } from "vitest";

import { buildBlueprintMarkdown } from "@/lib/blueprint/build-pack";
import { generateMockBlueprint } from "@/lib/blueprint/mock-generator";

const idea =
  "Build a service that helps secondary-school teachers identify struggling students before examinations.";

describe("generateMockBlueprint", () => {
  it("turns an idea into a complete, typed blueprint", () => {
    const blueprint = generateMockBlueprint({ idea, constraints: [] });

    expect(blueprint.schemaVersion).toBe("1.0");
    expect(blueprint.intake.idea).toBe(idea);
    expect(blueprint.purpose.purposeStatement).toBeTruthy();
    expect(blueprint.purpose.primaryUser).toBeTruthy();
    expect(blueprint.boundaries.features.some((feature) => feature.priority === "essential")).toBe(true);
    expect(blueprint.boundaries.nonGoals.length).toBeGreaterThan(0);
    expect(blueprint.premortem).toHaveLength(3);
    expect(blueprint.foundations.length).toBeGreaterThanOrEqual(3);
    expect(blueprint.buildPhases).toHaveLength(3);
    expect(blueprint.codexTasks.length).toBeGreaterThan(0);
  });

  it("orders foundations so every dependency already exists", () => {
    const blueprint = generateMockBlueprint({ idea, constraints: [] });
    const completed = new Set<string>();

    for (const foundation of blueprint.foundations) {
      expect(foundation.dependsOn.every((dependency) => completed.has(dependency))).toBe(true);
      completed.add(foundation.id);
    }
  });

  it("produces Codex tasks with executable completion requirements", () => {
    const blueprint = generateMockBlueprint({ idea, constraints: [] });

    for (const task of blueprint.codexTasks) {
      expect(task.acceptanceCriteria.length).toBeGreaterThan(1);
      expect(task.tests.length).toBeGreaterThan(0);
      expect(task.prohibitedScope.length).toBeGreaterThan(0);
      expect(task.definitionOfDone.length).toBeGreaterThan(0);
    }
  });

  it("keeps a non-education idea product-agnostic", () => {
    const blueprint = generateMockBlueprint({
      idea: "Create a calm weekly planning tool for independent designers and writers.",
      constraints: ["No accounts"],
    });

    expect(blueprint.purpose.workingTitle).toBe("Purposeful First Version");
    expect(blueprint.purpose.primaryUser).toContain("described problem");
    expect(blueprint.intake.constraints).toEqual(["No accounts"]);
  });

  it("creates a realistic GENESIS demo blueprint for product-architecture ideas", () => {
    const blueprint = generateMockBlueprint({
      idea: "Build an AI product architect that turns vague ideas into risk-aware, Codex-ready blueprints.",
      constraints: ["No database", "No authentication"],
    });

    expect(blueprint.purpose.workingTitle).toBe("GENESIS");
    expect(blueprint.purpose.primaryUser).toMatch(/builder/i);
    expect(blueprint.purpose.problem).toMatch(/wrong thing|wrong order/i);
    expect(blueprint.purpose.successCriteria.join(" ")).toMatch(/Codex-ready/i);
  });

  it("turns a room-comfort photo idea into a safe, domain-specific blueprint", () => {
    const blueprint = generateMockBlueprint({
      idea: "An app that helps people live in a comfortable space. If I take a picture of the room and describe my challenges, it tells me what to do.",
      constraints: [],
    });

    expect(blueprint.purpose.workingTitle).toBe("Roomwise");
    expect(blueprint.purpose.primaryUser).toMatch(/renters|homeowners/i);
    expect(blueprint.purpose.problem).toMatch(/comfort|room/i);
    expect(blueprint.boundaries.features.map((feature) => feature.name).join(" ")).toMatch(/room capture|comfort plan/i);
    expect(blueprint.boundaries.nonGoals.join(" ")).toMatch(/structural|hazard|diagnos/i);
    expect(blueprint.premortem.map((risk) => risk.failure).join(" ")).toMatch(/photo|unsafe|generic/i);
    expect(blueprint.foundations.map((foundation) => foundation.name).join(" ")).toMatch(/safety|room evidence/i);
    expect(blueprint.codexTasks.map((task) => task.title).join(" ")).toMatch(/photo-to-comfort/i);
  });
});

describe("buildBlueprintMarkdown", () => {
  it("exports the blueprint as a readable Codex build pack", () => {
    const blueprint = generateMockBlueprint({ idea, constraints: [] });
    const markdown = buildBlueprintMarkdown(blueprint);

    expect(markdown).toContain("# GENESIS Build Pack");
    expect(markdown).toContain(idea);
    expect(markdown).toContain("## Purpose");
    expect(markdown).toContain("## Premortem");
    expect(markdown).toContain("## Ordered build plan");
    expect(markdown).toContain("### Codex task");
    expect(markdown).not.toContain("[object Object]");
  });
});
