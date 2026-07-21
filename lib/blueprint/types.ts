export type Priority = "essential" | "later" | "excluded";
export type RiskLevel = "low" | "medium" | "high";
export type Confidence = "assumption" | "supported" | "validated";
export type Specialist = "vision" | "user" | "risk" | "architecture";

export interface IdeaInput {
  idea: string;
  constraints: string[];
}

export interface BlueprintGenerationMeta {
  mode: "openai" | "mock";
  model?: string;
  requestId?: string;
  notice?: string;
  fallbackReason?:
    | "demo_mode"
    | "missing_api_key"
    | "quota_unavailable"
    | "request_failed"
    | "invalid_output"
    | "invalid_dependencies";
}

export interface BlueprintGenerationResult {
  blueprint: ProductBlueprint;
  meta: BlueprintGenerationMeta;
}

export interface ProductBlueprint {
  schemaVersion: "1.0";
  id: string;
  createdAt: string;
  intake: IdeaInput;
  purpose: {
    workingTitle: string;
    purposeStatement: string;
    primaryUser: string;
    problem: string;
    desiredTransformation: string;
    valueProposition: string;
    successCriteria: string[];
  };
  boundaries: {
    features: Array<{
      id: string;
      name: string;
      rationale: string;
      priority: Priority;
    }>;
    nonGoals: string[];
    assumptions: Array<{
      id: string;
      statement: string;
      confidence: Confidence;
      evidenceNeeded: string;
    }>;
  };
  specialistFindings: Array<{
    specialist: Specialist;
    finding: string;
    recommendation: string;
    confidence: Confidence;
  }>;
  premortem: Array<{
    id: string;
    category: string;
    failure: string;
    underlyingCause: string;
    likelihood: RiskLevel;
    impact: RiskLevel;
    warningSigns: string[];
    prevention: string;
    validationTest: string;
  }>;
  foundations: Array<{
    id: string;
    name: string;
    whyRequired: string;
    dependsOn: string[];
    unlocks: string[];
    completionCriteria: string[];
  }>;
  dependencies: Array<{
    from: string;
    to: string;
    reason: string;
  }>;
  buildPhases: Array<{
    id: string;
    name: string;
    purpose: string;
    dependencyIds: string[];
    outcomes: string[];
    exitCriteria: string[];
  }>;
  codexTasks: Array<{
    id: string;
    phaseId: string;
    title: string;
    purpose: string;
    dependencies: string[];
    expectedFiles: string[];
    acceptanceCriteria: string[];
    tests: string[];
    prohibitedScope: string[];
    definitionOfDone: string[];
  }>;
  review: {
    purposeAlignment: string[];
    unresolvedQuestions: string[];
    launchBlockers: string[];
  };
}
