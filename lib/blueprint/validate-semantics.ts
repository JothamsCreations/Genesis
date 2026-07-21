import type { ProductBlueprint, Specialist } from "./types";

export type BlueprintSemanticResult = {
  valid: boolean;
  issues: string[];
};

const requiredSpecialists: Specialist[] = ["vision", "user", "risk", "architecture"];

function collectDuplicateIds(
  items: Array<{ id: string }>,
  label: string,
  issues: string[],
) {
  const seen = new Set<string>();
  const reported = new Set<string>();

  for (const item of items) {
    if (seen.has(item.id) && !reported.has(item.id)) {
      issues.push(`Duplicate ${label} ID: ${item.id}.`);
      reported.add(item.id);
    }
    seen.add(item.id);
  }
}

export function validateBlueprintSemantics(blueprint: ProductBlueprint): BlueprintSemanticResult {
  const issues: string[] = [];

  for (const specialist of requiredSpecialists) {
    if (!blueprint.specialistFindings.some((item) => item.specialist === specialist)) {
      issues.push(`Missing specialist finding: ${specialist}.`);
    }
  }

  collectDuplicateIds(blueprint.boundaries.features, "feature", issues);
  collectDuplicateIds(blueprint.boundaries.assumptions, "assumption", issues);
  collectDuplicateIds(blueprint.premortem, "premortem", issues);
  collectDuplicateIds(blueprint.foundations, "foundation", issues);
  collectDuplicateIds(blueprint.buildPhases, "phase", issues);
  collectDuplicateIds(blueprint.codexTasks, "task", issues);

  const foundationIndexes = new Map(
    blueprint.foundations.map((foundation, index) => [foundation.id, index]),
  );

  blueprint.foundations.forEach((foundation, index) => {
    for (const dependencyId of foundation.dependsOn) {
      const dependencyIndex = foundationIndexes.get(dependencyId);
      if (dependencyIndex === undefined) {
        issues.push(`Foundation ${foundation.id} has an unknown dependency: ${dependencyId}.`);
      } else if (dependencyIndex >= index) {
        issues.push(`Foundation ${foundation.id} depends on a later foundation: ${dependencyId}.`);
      }
    }
  });

  for (const dependency of blueprint.dependencies) {
    const fromIndex = foundationIndexes.get(dependency.from);
    const toIndex = foundationIndexes.get(dependency.to);

    if (fromIndex === undefined) {
      issues.push(`Dependency edge has an unknown source: ${dependency.from}.`);
    }
    if (toIndex === undefined) {
      issues.push(`Dependency edge has an unknown target: ${dependency.to}.`);
    }
    if (fromIndex !== undefined && toIndex !== undefined && fromIndex >= toIndex) {
      issues.push(`Dependency edge must point forward: ${dependency.from} -> ${dependency.to}.`);
    }
  }

  const phaseIndexes = new Map(blueprint.buildPhases.map((phase, index) => [phase.id, index]));
  blueprint.buildPhases.forEach((phase, index) => {
    for (const dependencyId of phase.dependencyIds) {
      const dependencyIndex = phaseIndexes.get(dependencyId);
      if (dependencyIndex === undefined) {
        issues.push(`Phase ${phase.id} has an unknown dependency: ${dependencyId}.`);
      } else if (dependencyIndex >= index) {
        issues.push(`Phase ${phase.id} depends on a later phase: ${dependencyId}.`);
      }
    }
  });

  const taskIndexes = new Map(blueprint.codexTasks.map((task, index) => [task.id, index]));
  let previousTaskPhaseIndex = -1;

  blueprint.codexTasks.forEach((task, index) => {
    const phaseIndex = phaseIndexes.get(task.phaseId);
    if (phaseIndex === undefined) {
      issues.push(`Task ${task.id} belongs to an unknown phase: ${task.phaseId}.`);
    } else {
      if (phaseIndex < previousTaskPhaseIndex) {
        issues.push(`Task ${task.id} is ordered before a task from an earlier phase.`);
      }
      previousTaskPhaseIndex = phaseIndex;
    }

    for (const dependencyId of task.dependencies) {
      if (foundationIndexes.has(dependencyId)) continue;

      const dependencyIndex = taskIndexes.get(dependencyId);
      if (dependencyIndex === undefined) {
        issues.push(`Task ${task.id} has an unknown dependency: ${dependencyId}.`);
      } else if (dependencyIndex >= index) {
        issues.push(`Task ${task.id} depends on a later task: ${dependencyId}.`);
      }
    }
  });

  return { valid: issues.length === 0, issues };
}
