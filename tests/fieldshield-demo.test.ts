import { describe, expect, it } from "vitest";

import { validateBlueprintSemantics } from "@/lib/blueprint/validate-semantics";
import {
  FIELD_SHIELD_INITIAL_IDEA,
  FIELD_SHIELD_PROTOTYPE,
  generateFieldShieldBlueprint,
  isFieldShieldIdea,
} from "@/lib/demo/fieldshield";

describe("FieldShield deterministic demo", () => {
  it("recognizes the competition scenario from the deliberately vague idea", () => {
    expect(isFieldShieldIdea(FIELD_SHIELD_INITIAL_IDEA)).toBe(true);
    expect(isFieldShieldIdea("A calm weekly planner for designers")).toBe(false);
  });

  it("creates a complete, dependency-valid FieldShield blueprint", () => {
    const blueprint = generateFieldShieldBlueprint({
      idea: FIELD_SHIELD_INITIAL_IDEA,
      constraints: [],
    });

    expect(blueprint.purpose.workingTitle).toBe("FieldShield");
    expect(blueprint.purpose.purposeStatement).toMatch(/accurate, balanced and operational/i);
    expect(blueprint.boundaries.features.filter((feature) => feature.priority === "essential")).toHaveLength(9);
    expect(blueprint.boundaries.nonGoals).toEqual(expect.arrayContaining([
      expect.stringMatching(/KoboToolbox/i),
      expect.stringMatching(/statistical analysis/i),
      expect.stringMatching(/payroll/i),
    ]));
    expect(blueprint.specialistFindings).toHaveLength(4);
    expect(blueprint.premortem).toHaveLength(6);
    expect(blueprint.premortem.every((risk) => risk.warningSigns.length > 0)).toBe(true);
    expect(blueprint.foundations).toHaveLength(8);
    expect(validateBlueprintSemantics(blueprint)).toEqual({ valid: true, issues: [] });
  });

  it("keeps every prototype metric fictional and internally consistent", () => {
    const completed = FIELD_SHIELD_PROTOTYPE.lgas.reduce((total, lga) => total + lga.completed, 0);
    const target = FIELD_SHIELD_PROTOTYPE.lgas.reduce((total, lga) => total + lga.target, 0);

    expect(completed).toBe(427);
    expect(target).toBe(640);
    expect(FIELD_SHIELD_PROTOTYPE.totalCompleted).toBe(completed);
    expect(FIELD_SHIELD_PROTOTYPE.totalTarget).toBe(target);
    expect(FIELD_SHIELD_PROTOTYPE.lgas).toHaveLength(4);
    expect(FIELD_SHIELD_PROTOTYPE.lgas.flatMap((lga) => lga.assignedRAs).every((ra) => /^RA-\d{2}$/.test(ra))).toBe(true);
  });
});
