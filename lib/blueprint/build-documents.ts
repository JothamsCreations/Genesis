import type { ProductBlueprint } from "./types";

export type BuildDocumentFilename =
  | "PRODUCT.md"
  | "USER-FLOWS.md"
  | "PREMORTEM.md"
  | "ARCHITECTURE.md"
  | "BUILD-ORDER.md"
  | "TASKS.md"
  | "ACCEPTANCE-CRITERIA.md";

export type BuildDocument = {
  id: string;
  filename: BuildDocumentFilename;
  title: string;
  description: string;
  markdown: string;
};

const bullets = (items: string[]) => items.map((item) => "- " + item).join("\n");
const numbered = (items: string[]) => items.map((item, index) => (index + 1) + ". " + item).join("\n");
const heading = (blueprint: ProductBlueprint, title: string) =>
  "# " + blueprint.purpose.workingTitle + " - " + title + "\n\n";

export function buildBlueprintDocuments(blueprint: ProductBlueprint): BuildDocument[] {
  const essential = blueprint.boundaries.features.filter((feature) => feature.priority === "essential");
  const product = heading(blueprint, "Product") +
    "## Purpose\n\n" + blueprint.purpose.purposeStatement +
    "\n\n## Primary user\n\n" + blueprint.purpose.primaryUser +
    "\n\n## Problem\n\n" + blueprint.purpose.problem +
    "\n\n## Desired transformation\n\n" + blueprint.purpose.desiredTransformation +
    "\n\n## Essential first version\n\n" + bullets(essential.map((feature) => feature.name + " - " + feature.rationale)) +
    "\n\n## Explicit non-goals\n\n" + bullets(blueprint.boundaries.nonGoals) +
    "\n\n## Success criteria\n\n" + bullets(blueprint.purpose.successCriteria);

  const fieldShieldFlows = [
    "A research assistant records field activity offline and sees its sync state.",
    "A supervisor reviews progress by LGA and investigates exceptions.",
    "The principal researcher activates handover and transfers the current operating brief.",
  ];
  const userFlows = heading(blueprint, "User Flows") +
    "## Critical journeys\n\n" +
    numbered(blueprint.purpose.workingTitle === "FieldShield" ? fieldShieldFlows : [
      "The primary user supplies the minimum trustworthy input.",
      "The product explains its result and the evidence behind it.",
      "A reviewer evaluates whether the intended transformation occurred.",
    ]) +
    "\n\n## Experience guardrails\n\n" + bullets([
      "Keep the core journey complete on desktop and mobile.",
      "Make loading, failure and recovery states actionable.",
      "Never hide unresolved assumptions behind a polished result.",
    ]);

  const premortem = heading(blueprint, "Premortem") + blueprint.premortem.map((risk) =>
    "## " + risk.failure +
    "\n\n- **Category:** " + risk.category +
    "\n- **Underlying cause:** " + risk.underlyingCause +
    "\n- **Likelihood / impact:** " + risk.likelihood + " / " + risk.impact +
    "\n- **Early warning:** " + risk.warningSigns.join("; ") +
    "\n- **Prevention:** " + risk.prevention +
    "\n- **Validation test:** " + risk.validationTest
  ).join("\n\n");

  const architecture = heading(blueprint, "Architecture") +
    "## Foundations\n\n" + blueprint.foundations.map((foundation, index) =>
      (index + 1) + ". **" + foundation.name + "** - " + foundation.whyRequired +
      "\n   - Depends on: " + (foundation.dependsOn.join(", ") || "nothing") +
      "\n   - Complete when: " + foundation.completionCriteria.join("; ")
    ).join("\n") +
    "\n\n## Dependency edges\n\n" + bullets(blueprint.dependencies.map((edge) =>
      edge.from + " -> " + edge.to + " - " + edge.reason
    ));

  const buildOrder = heading(blueprint, "Build Order") +
    (blueprint.purpose.workingTitle === "FieldShield"
      ? "> Do not begin with the dashboard. The dashboard depends on trustworthy field activity data.\n\n"
      : "") +
    blueprint.buildPhases.map((phase, index) =>
      "## " + (index + 1) + ". " + phase.name +
      "\n\n" + phase.purpose +
      "\n\n**Outcomes**\n" + bullets(phase.outcomes) +
      "\n\n**Exit criteria**\n" + bullets(phase.exitCriteria)
    ).join("\n\n");

  const tasks = heading(blueprint, "Tasks") + blueprint.codexTasks.map((task, index) =>
    "## Task " + String(index + 1).padStart(2, "0") + ": " + task.title +
    "\n\n**Purpose**\n\n" + task.purpose +
    "\n\n**Dependencies**\n" + bullets(task.dependencies.length ? task.dependencies : ["None"]) +
    "\n\n**Files involved**\n" + bullets(task.expectedFiles) +
    "\n\n**Acceptance criteria**\n" + bullets(task.acceptanceCriteria) +
    "\n\n**Required tests**\n" + bullets(task.tests) +
    "\n\n**Implementation boundaries**\n" + bullets(task.prohibitedScope) +
    "\n\n**Definition of completion**\n" + bullets(task.definitionOfDone)
  ).join("\n\n");

  const acceptance = heading(blueprint, "Acceptance Criteria") +
    blueprint.codexTasks.map((task) =>
      "## " + task.title + "\n\n" + bullets(task.acceptanceCriteria) +
      "\n\n**Completion evidence**\n" + bullets(task.definitionOfDone)
    ).join("\n\n") +
    "\n\n## Product review\n\n" + bullets(blueprint.review.purposeAlignment);

  return [
    { id: "product", filename: "PRODUCT.md", title: "Product contract", description: "Purpose, user, scope and success.", markdown: product },
    { id: "flows", filename: "USER-FLOWS.md", title: "User flows", description: "The critical human journeys.", markdown: userFlows },
    { id: "premortem", filename: "PREMORTEM.md", title: "Premortem", description: "Failure modes, warnings and prevention.", markdown: premortem },
    { id: "architecture", filename: "ARCHITECTURE.md", title: "Architecture", description: "Foundations and dependency edges.", markdown: architecture },
    { id: "order", filename: "BUILD-ORDER.md", title: "Build order", description: "The sequence in which value becomes reliable.", markdown: buildOrder },
    { id: "tasks", filename: "TASKS.md", title: "Codex tasks", description: "Bounded, testable implementation work.", markdown: tasks },
    { id: "acceptance", filename: "ACCEPTANCE-CRITERIA.md", title: "Acceptance criteria", description: "The evidence required for completion.", markdown: acceptance },
  ];
}
