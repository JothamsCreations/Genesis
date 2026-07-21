import { z } from "zod";

export const ideaInputSchema = z.object({
  idea: z.string().trim().min(24, "Describe the idea in at least 24 characters.").max(1200),
  constraints: z.array(z.string().trim().min(1).max(200)).max(12),
}).strict();

// `pattern` is supported by OpenAI Structured Outputs; minLength/maxLength are not.
const text = z.string().regex(/\S/, "Text fields cannot be empty.");
const confidence = z.enum(["assumption", "supported", "validated"]);
const riskLevel = z.enum(["low", "medium", "high"]);
const blueprintIntakeSchema = z.object({
  idea: text,
  constraints: z.array(text).max(12),
}).strict();

export const productBlueprintSchema = z.object({
  schemaVersion: z.literal("1.0"),
  id: text,
  createdAt: z.string().datetime(),
  intake: blueprintIntakeSchema,
  purpose: z.object({
    workingTitle: text,
    purposeStatement: text,
    primaryUser: text,
    problem: text,
    desiredTransformation: text,
    valueProposition: text,
    successCriteria: z.array(text).min(2).max(5),
  }).strict(),
  boundaries: z.object({
    features: z.array(z.object({
      id: text,
      name: text,
      rationale: text,
      priority: z.enum(["essential", "later", "excluded"]),
    }).strict()).min(2).max(10),
    nonGoals: z.array(text).min(2).max(10),
    assumptions: z.array(z.object({
      id: text,
      statement: text,
      confidence,
      evidenceNeeded: text,
    }).strict()).min(1).max(8),
  }).strict(),
  specialistFindings: z.array(z.object({
    specialist: z.enum(["vision", "user", "risk", "architecture"]),
    finding: text,
    recommendation: text,
    confidence,
  }).strict()).min(4).max(8),
  premortem: z.array(z.object({
    id: text,
    category: text,
    failure: text,
    underlyingCause: text,
    likelihood: riskLevel,
    impact: riskLevel,
    warningSigns: z.array(text).min(1).max(5),
    prevention: text,
    validationTest: text,
  }).strict()).min(3).max(6),
  foundations: z.array(z.object({
    id: text,
    name: text,
    whyRequired: text,
    dependsOn: z.array(text).max(8),
    unlocks: z.array(text).max(8),
    completionCriteria: z.array(text).min(1).max(6),
  }).strict()).min(3).max(8),
  dependencies: z.array(z.object({
    from: text,
    to: text,
    reason: text,
  }).strict()).max(16),
  buildPhases: z.array(z.object({
    id: text,
    name: text,
    purpose: text,
    dependencyIds: z.array(text).max(8),
    outcomes: z.array(text).min(1).max(6),
    exitCriteria: z.array(text).min(1).max(6),
  }).strict()).min(2).max(6),
  codexTasks: z.array(z.object({
    id: text,
    phaseId: text,
    title: text,
    purpose: text,
    dependencies: z.array(text).max(10),
    expectedFiles: z.array(text).min(1).max(12),
    acceptanceCriteria: z.array(text).min(2).max(10),
    tests: z.array(text).min(1).max(8),
    prohibitedScope: z.array(text).min(1).max(10),
    definitionOfDone: z.array(text).min(2).max(8),
  }).strict()).min(1).max(10),
  review: z.object({
    purposeAlignment: z.array(text).min(1).max(6),
    unresolvedQuestions: z.array(text).max(8),
    launchBlockers: z.array(text).max(8),
  }).strict(),
}).strict();
