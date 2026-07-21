import type { ProductBlueprint } from "./types";

const bullets = (items: string[]) => items.map((item) => `- ${item}`).join("\n");

export function buildBlueprintMarkdown(blueprint: ProductBlueprint) {
  const risks = blueprint.premortem
    .map((risk) => `### ${risk.category}: ${risk.failure}\n\n- Underlying cause: ${risk.underlyingCause}\n- Likelihood: ${risk.likelihood}\n- Impact: ${risk.impact}\n- Early warning: ${risk.warningSigns.join("; ")}\n- Prevention: ${risk.prevention}\n- Validation: ${risk.validationTest}`)
    .join("\n\n");
  const foundations = blueprint.foundations
    .map((item, index) => `${index + 1}. **${item.name}** - ${item.whyRequired}\n   - Complete when: ${item.completionCriteria.join("; ")}`)
    .join("\n");
  const specialists = blueprint.specialistFindings
    .map((item) => `### ${item.specialist}\n\n${item.finding}\n\n**Recommendation:** ${item.recommendation}\n\n**Confidence:** ${item.confidence}`)
    .join("\n\n");
  const phases = blueprint.buildPhases
    .map((phase, index) => `### Phase ${index + 1}: ${phase.name}\n\n${phase.purpose}\n\nOutcomes:\n${bullets(phase.outcomes)}\n\nExit criteria:\n${bullets(phase.exitCriteria)}`)
    .join("\n\n");
  const tasks = blueprint.codexTasks
    .map((task, index) => `### Codex task ${index + 1}: ${task.title}\n\n**Purpose**\n${task.purpose}\n\n**Dependencies**\n${bullets(task.dependencies.length ? task.dependencies : ["None"])}\n\n**Expected files**\n${bullets(task.expectedFiles)}\n\n**Acceptance criteria**\n${bullets(task.acceptanceCriteria)}\n\n**Tests**\n${bullets(task.tests)}\n\n**Prohibited scope**\n${bullets(task.prohibitedScope)}\n\n**Definition of done**\n${bullets(task.definitionOfDone)}`)
    .join("\n\n");
  const essentials = blueprint.boundaries.features
    .filter((feature) => feature.priority === "essential")
    .map((feature) => `${feature.name}: ${feature.rationale}`);

  return `# GENESIS Build Pack

## Original idea

${blueprint.intake.idea}

## Purpose

**${blueprint.purpose.workingTitle}**

${blueprint.purpose.purposeStatement}

- Primary user: ${blueprint.purpose.primaryUser}
- Problem: ${blueprint.purpose.problem}
- Desired transformation: ${blueprint.purpose.desiredTransformation}

### Success criteria

${bullets(blueprint.purpose.successCriteria)}

## Boundaries

### Essential

${bullets(essentials)}

### Not in this version

${bullets(blueprint.boundaries.nonGoals)}

## Specialist perspectives

${specialists}

## Premortem

${risks}

## Foundations

${foundations}

## Ordered build plan

${phases}

## Codex-ready tasks

${tasks}

## Review

### Purpose alignment

${bullets(blueprint.review.purposeAlignment)}

### Unresolved questions

${bullets(blueprint.review.unresolvedQuestions)}

### Launch blockers

${bullets(blueprint.review.launchBlockers)}
`;
}
