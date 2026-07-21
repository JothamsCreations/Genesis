import { generateFieldShieldBlueprint, isFieldShieldIdea } from "@/lib/demo/fieldshield";

import type { IdeaInput, ProductBlueprint } from "./types";

const educationTerms = ["school", "student", "teacher", "examination", "learning"];
const genesisTerms = ["product architect", "product blueprint", "codex-ready", "build plan", "vague idea"];
const roomTerms = ["room", "living space", "home", "bedroom", "apartment", "interior"];
const roomComfortTerms = ["comfort", "comfortable", "picture", "photo", "lighting", "ventilation", "clutter", "temperature"];

export function generateMockBlueprint(input: IdeaInput): ProductBlueprint {
  const normalizedIdea = input.idea.trim().toLowerCase();
  const isRoomComfortIdea = roomTerms.some((term) => normalizedIdea.includes(term))
    && roomComfortTerms.some((term) => normalizedIdea.includes(term));

  if (isRoomComfortIdea) return generateRoomComfortBlueprint(input);
  if (isFieldShieldIdea(normalizedIdea)) return generateFieldShieldBlueprint(input);
  return generateBaseMockBlueprint(input);
}

function generateBaseMockBlueprint(input: IdeaInput): ProductBlueprint {
  const idea = input.idea.trim();
  const normalizedIdea = idea.toLowerCase();
  const education = educationTerms.some((term) => normalizedIdea.includes(term));
  const genesis = genesisTerms.some((term) => normalizedIdea.includes(term));
  const title = genesis ? "GENESIS" : education ? "Learning Signal" : "Purposeful First Version";
  const user = genesis
    ? "Builders using AI coding tools who need to decide what to build and in what order"
    : education
    ? "Secondary-school teachers responsible for spotting students who need timely support"
    : "The person who experiences the described problem most directly";

  return {
    schemaVersion: "1.0",
    id: `bp-${idea.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 42) || "untitled"}`,
    createdAt: "2026-07-19T00:00:00.000Z",
    intake: { idea, constraints: [...input.constraints] },
    purpose: {
      workingTitle: title,
      purposeStatement: genesis
        ? "Help builders turn an undeveloped idea into a purposeful, risk-aware and executable product blueprint."
        : education
        ? "Help teachers notice struggling students early enough to act."
        : "Turn the idea into a focused first product that can prove its value before it grows.",
      primaryUser: user,
      problem: genesis
        ? "AI coding tools make production fast, but builders can still build the wrong thing in the wrong order without clear purpose, boundaries and dependencies."
        : education
        ? "Useful signals are scattered across marks, attendance and classroom observations, so learning gaps are often discovered too late."
        : "The intended user lacks one clear, dependable path from the current problem to the desired outcome.",
      desiredTransformation: genesis
        ? "Move a builder from a vague request to an ordered, reviewable plan they can execute confidently with Codex."
        : education
        ? "Move teachers from late, intuition-led intervention to an early, explainable view of which students may need attention."
        : "Move the primary user from a fragmented process to one focused, testable outcome.",
      valueProposition: genesis
        ? "One disciplined workflow that clarifies purpose, separates scope, runs a premortem and produces dependency-ordered Codex tasks."
        : education
        ? "A concise, evidence-based signal that guides attention without replacing professional judgment."
        : "A smaller, clearer experience centered on one meaningful user decision.",
      successCriteria: genesis
        ? [
            "A builder reaches a coherent first-version product thesis in one session.",
            "The blueprint exposes major assumptions, failure modes and dependency order.",
            "Every build phase ends in Codex-ready tasks with acceptance criteria and prohibited scope.",
          ]
        : education
        ? [
            "A teacher identifies students needing review in under two minutes.",
            "Every signal shows the observations that contributed to it.",
            "Teachers can record whether an intervention was useful.",
          ]
        : [
            "The primary user reaches the intended outcome in one focused session.",
            "The team can observe whether the core workflow creates value.",
            "The first release avoids features that do not test the central promise.",
          ],
    },
    boundaries: {
      features: [
        { id: "feature-input", name: genesis ? "Product idea intake" : education ? "Teacher evidence input" : "Essential user input", rationale: "Creates the minimum trustworthy evidence needed for a useful result.", priority: "essential" },
        { id: "feature-result", name: genesis ? "Risk-aware product blueprint" : education ? "Explainable attention list" : "Focused core result", rationale: "Delivers the promised decision instead of a broad toolkit.", priority: "essential" },
        { id: "feature-history", name: "Long-term history and reporting", rationale: "Useful after the core result earns trust.", priority: "later" },
        { id: "feature-orgs", name: "Multi-organisation collaboration", rationale: "Adds governance before single-user value is proven.", priority: "excluded" },
      ],
      nonGoals: [
        "Do not automate consequential decisions on the user's behalf.",
        "Do not add billing, organisation management or advanced reporting.",
        "Do not optimise for scale before the core workflow proves useful.",
      ],
      assumptions: [
        { id: "assumption-input", statement: "Users can provide the minimum information consistently.", confidence: "assumption", evidenceNeeded: "Five observed sessions with realistic inputs." },
        { id: "assumption-action", statement: "The result is clear enough to change the user's next action.", confidence: "assumption", evidenceNeeded: "Users explain their next action without prompting." },
      ],
    },
    specialistFindings: [
      { specialist: "vision", finding: "The strongest promise is an earlier, clearer decision rather than more features.", recommendation: "Make time-to-useful-decision the central measure.", confidence: "supported" },
      { specialist: "user", finding: "The user needs a result they can understand and challenge.", recommendation: "Show the evidence behind every recommendation.", confidence: "assumption" },
      { specialist: "risk", finding: "Inconsistent source information could make a polished result untrustworthy.", recommendation: "Validate the minimum viable input first.", confidence: "supported" },
      { specialist: "architecture", finding: "The information model and evaluation loop precede visible features.", recommendation: "Define evidence, outcome and feedback structures before dashboards.", confidence: "supported" },
    ],
    premortem: [
      {
        id: "risk-friction", category: "Adoption", failure: "Users stop because the input feels like extra work.", underlyingCause: "The product asks for effort before returning value.", likelihood: "high", impact: "high",
        warningSigns: ["Incomplete first sessions", "Placeholder information"], prevention: "Use the smallest useful input and return value in the same session.", validationTest: "Observe five target users complete the flow with realistic information.",
      },
      {
        id: "risk-trust", category: "Trust", failure: "Users see the result but do not act on it.", underlyingCause: "The reasoning feels generic or opaque.", likelihood: "medium", impact: "high",
        warningSigns: ["Manual re-analysis", "Recommendations frequently dismissed"], prevention: "Trace every conclusion to recognisable evidence.", validationTest: "Ask users to explain the top recommendation and their next action.",
      },
      {
        id: "risk-scope", category: "Execution", failure: "Supporting features grow while the primary workflow remains unproven.", underlyingCause: "Visible breadth is mistaken for maturity.", likelihood: "high", impact: "medium",
        warningSigns: ["Backlog growth without user sessions", "Infrastructure before core-task success"], prevention: "Hold firm non-goals and require evidence before promoting later features.", validationTest: "Review every task against the purpose and current phase exit criteria.",
      },
    ],
    foundations: [
      { id: "foundation-evidence", name: "Problem evidence", whyRequired: "A precise user, problem and current behaviour anchor every later decision.", dependsOn: [], unlocks: ["foundation-model"], completionCriteria: ["Five target-user conversations", "One observable job and outcome"] },
      { id: "foundation-model", name: "Core information model", whyRequired: "The experience needs stable definitions for inputs, results and evidence.", dependsOn: ["foundation-evidence"], unlocks: ["foundation-workflow"], completionCriteria: ["Typed input and output schema", "Representative sample data"] },
      { id: "foundation-workflow", name: "Primary workflow", whyRequired: "The promised transformation must work end to end before support features grow around it.", dependsOn: ["foundation-evidence", "foundation-model"], unlocks: ["foundation-evaluation"], completionCriteria: ["One complete journey", "Loading, empty and error states", "Responsive layout"] },
      { id: "foundation-evaluation", name: "Evaluation loop", whyRequired: "The team needs evidence that the result remains useful and aligned with purpose.", dependsOn: ["foundation-workflow"], unlocks: ["review-readiness"], completionCriteria: ["Core outcome measure", "Feedback capture", "Review cadence"] },
    ],
    dependencies: [
      { from: "foundation-evidence", to: "foundation-model", reason: "The model should describe real evidence." },
      { from: "foundation-model", to: "foundation-workflow", reason: "The workflow needs stable inputs and outputs." },
      { from: "foundation-workflow", to: "foundation-evaluation", reason: "Only a complete journey can be evaluated." },
    ],
    buildPhases: [
      { id: "phase-purpose", name: "Validate the problem", purpose: "Replace the riskiest assumptions with direct user evidence.", dependencyIds: [], outcomes: ["Defined user and job", "Testable promise", "Explicit non-goals"], exitCriteria: ["Target users recognise the problem", "The desired outcome is observable"] },
      { id: "phase-foundation", name: "Build the foundation", purpose: "Create the minimum information model and complete workflow.", dependencyIds: ["phase-purpose"], outcomes: ["Typed product model", "Working core journey", "Edge-state coverage"], exitCriteria: ["The journey works with representative data", "No later-scope infrastructure is required"] },
      { id: "phase-complete", name: "Complete and evaluate", purpose: "Make the first version demonstrable, trustworthy and reviewable.", dependencyIds: ["phase-foundation"], outcomes: ["Accessible interface", "Evaluation evidence", "Purpose-alignment review"], exitCriteria: ["The core measure can be observed", "Known blockers are explicit"] },
    ],
    codexTasks: [
      {
        id: "task-product-contract", phaseId: "phase-purpose", title: "Define the first-version product contract",
        purpose: "Translate the primary user, problem and intended change into typed inputs, outputs and explicit scope boundaries.",
        dependencies: ["foundation-evidence"], expectedFiles: ["lib/product-model.ts", "lib/sample-data.ts", "docs/product-contract.md"],
        acceptanceCriteria: ["The primary input and output are represented with strict TypeScript types.", "Representative sample data covers a successful case and one edge case.", "Every excluded capability is recorded beside the first-version contract."],
        tests: ["Validate representative samples against the product contract.", "Assert invalid and incomplete inputs are rejected with actionable messages."],
        prohibitedScope: ["Authentication", "Payments", "Database persistence", "Team roles", "Third-party integrations"],
        definitionOfDone: ["Types compile", "Samples validate", "Scope boundaries are reviewable", "The next task has no unresolved data dependency"],
      },
      {
        id: "task-core-slice", phaseId: "phase-foundation", title: "Implement the first complete decision workflow",
        purpose: "Let a representative user provide the minimum input and receive one explainable, actionable result.",
        dependencies: ["foundation-evidence", "foundation-model"], expectedFiles: ["app/page.tsx", "components/core-workflow.tsx", "lib/product-model.ts"],
        acceptanceCriteria: ["A user completes the journey without leaving the page.", "The result explains which inputs informed it.", "Empty, loading and error states provide a next action.", "The layout works at 375px and 1280px without horizontal overflow."],
        tests: ["Unit test the input-to-result transformation.", "Component test validation and completion states.", "Run mobile and desktop end-to-end journeys."],
        prohibitedScope: ["Authentication", "Payments", "Team collaboration", "Analytics dashboards", "Deployment automation"],
        definitionOfDone: ["Acceptance criteria pass", "Automated tests pass", "Keyboard flow is complete", "A user session has been observed"],
      },
      {
        id: "task-evaluation", phaseId: "phase-complete", title: "Add evaluation and completion review",
        purpose: "Make the core outcome observable and expose unresolved questions before the first release is judged complete.",
        dependencies: ["task-core-slice", "foundation-evaluation"], expectedFiles: ["components/completion-review.tsx", "lib/evaluation.ts", "tests/evaluation.test.ts"],
        acceptanceCriteria: ["The interface states whether the intended outcome was reached.", "Known risks and unresolved questions remain visible at completion.", "A reviewer can repeat the representative journey without setup knowledge."],
        tests: ["Unit test evaluation rules.", "Run the complete keyboard journey at mobile and desktop widths.", "Verify empty, failure and success completion states."],
        prohibitedScope: ["Analytics dashboards", "User tracking", "Automated deployment", "New supporting features"],
        definitionOfDone: ["Evaluation evidence is visible", "All critical states are covered", "Purpose alignment is reviewed", "Launch blockers are explicit"],
      },
    ],
    review: {
      purposeAlignment: ["The plan prioritises the primary user's decision.", "Visible features depend on evidence and a stable model."],
      unresolvedQuestions: [genesis ? "Which clarifying question produces the greatest improvement in blueprint quality?" : education ? "Which observations can teachers provide consistently?" : "What is the smallest reliable input?", "What behaviour proves the result is useful?"],
      launchBlockers: ["No representative user sessions yet", "The highest-risk assumption remains unvalidated"],
    },
  };
}

function generateRoomComfortBlueprint(input: IdeaInput): ProductBlueprint {
  const blueprint = generateBaseMockBlueprint(input);

  return {
    ...blueprint,
    purpose: {
      workingTitle: "Roomwise",
      purposeStatement: "Help people understand why a room feels uncomfortable and choose safe, practical improvements they can make first.",
      primaryUser: "Renters and homeowners who know a room feels uncomfortable but do not know which changes will help most",
      problem: "Room discomfort can come from layout, light, airflow, heat, noise or clutter, but people often spend money before identifying the most likely cause.",
      desiredTransformation: "Move a person from a vague sense that a room is not working to a prioritized comfort plan grounded in a photo, their stated challenge and clearly marked uncertainty.",
      valueProposition: "A guided room check that turns visual clues and human context into low-risk actions, while making clear what a photograph cannot establish.",
      successCriteria: [
        "A user captures a useful room photo and describes the main discomfort in under three minutes.",
        "The result prioritizes three practical actions and explains the evidence behind each one.",
        "The plan separates safe self-service changes from conditions that require measurement or a qualified professional.",
      ],
    },
    boundaries: {
      features: [
        { id: "feature-input", name: "Guided room capture", rationale: "Combines a useful photograph with context that an image cannot reveal, such as heat, noise, smell and time of day.", priority: "essential" },
        { id: "feature-result", name: "Prioritized comfort plan", rationale: "Returns a small set of explainable, low-risk actions instead of an unranked list of decorating tips.", priority: "essential" },
        { id: "feature-history", name: "Before-and-after room journal", rationale: "Useful after the core recommendation loop proves that people act on the advice.", priority: "later" },
        { id: "feature-orgs", name: "Contractor marketplace", rationale: "Introduces commercial incentives before recommendation quality and trust are validated.", priority: "excluded" },
      ],
      nonGoals: [
        "Do not diagnose mould, electrical faults, structural damage, air quality or other hazards from a photograph.",
        "Do not generate a complete interior redesign or shopping catalogue in the first version.",
        "Do not recommend invasive, high-cost or landlord-restricted work without professional review.",
      ],
      assumptions: [
        { id: "assumption-input", statement: "Users can take a sufficiently clear room photo and describe the discomfort they actually experience.", confidence: "assumption", evidenceNeeded: "Five observed capture sessions across different room types and lighting conditions." },
        { id: "assumption-action", statement: "A short, prioritized plan is more useful than broad inspiration or a long list of possible changes.", confidence: "assumption", evidenceNeeded: "Users select and complete at least one recommended low-risk action without extra explanation." },
      ],
    },
    specialistFindings: [
      { specialist: "vision", finding: "The product should improve comfort decisions, not position itself as an automated interior designer.", recommendation: "Center the promise on the next safe action a user can take.", confidence: "supported" },
      { specialist: "user", finding: "A photo cannot communicate heat, noise, smell, ownership restrictions or budget.", recommendation: "Pair image capture with four concise context questions before generating advice.", confidence: "supported" },
      { specialist: "risk", finding: "Confident advice about hidden hazards could be unsafe and destroy trust.", recommendation: "Separate observations, user-reported facts and uncertain inferences; escalate hazard signals to professional review.", confidence: "supported" },
      { specialist: "architecture", finding: "A safety policy and evidence model must precede image analysis and recommendation presentation.", recommendation: "Model every recommendation with evidence, confidence, cost band and escalation guidance.", confidence: "supported" },
    ],
    premortem: [
      {
        id: "risk-friction", category: "Evidence quality", failure: "The photo misses the real source of discomfort, so the plan feels irrelevant.", underlyingCause: "The product treats visual evidence as complete and does not ask about non-visual conditions.", likelihood: "high", impact: "high",
        warningSigns: ["Users repeatedly retake photos", "Recommendations conflict with the user's description"], prevention: "Guide photo capture and ask about temperature, airflow, noise, smell, time of day and constraints.", validationTest: "Compare plans made from a photo alone with plans made from a photo plus four context answers in five rooms.",
      },
      {
        id: "risk-trust", category: "Safety", failure: "The app gives unsafe or overconfident advice about a possible hazard.", underlyingCause: "Visual patterns are presented as diagnoses instead of uncertain signals.", likelihood: "medium", impact: "high",
        warningSigns: ["Recommendations mention hidden causes as facts", "Users attempt electrical, structural or mould remediation themselves"], prevention: "Block diagnoses, use confidence labels and direct hazard-related cases to a qualified professional.", validationTest: "Have a building-safety reviewer evaluate representative outputs before user testing.",
      },
      {
        id: "risk-scope", category: "Usefulness", failure: "The output becomes a generic list of decorating tips that users ignore.", underlyingCause: "Recommendations are not ranked against the user's stated discomfort, budget and constraints.", likelihood: "high", impact: "high",
        warningSigns: ["The same advice appears for different rooms", "Users cannot identify which action to take first"], prevention: "Return three ranked actions, each tied to supplied evidence and an expected comfort benefit.", validationTest: "Ask users to choose their first action and explain why; success requires an unprompted answer in four of five sessions.",
      },
    ],
    foundations: [
      { id: "foundation-evidence", name: "Comfort and safety boundaries", whyRequired: "The product needs an explicit distinction between observable comfort clues, user-reported conditions and hazards it cannot diagnose.", dependsOn: [], unlocks: ["foundation-model"], completionCriteria: ["Reviewed comfort-factor taxonomy", "Documented escalation and prohibited-advice rules"] },
      { id: "foundation-model", name: "Room evidence model", whyRequired: "Photos, context answers, constraints, recommendations and confidence must have stable definitions before the interface can explain its reasoning.", dependsOn: ["foundation-evidence"], unlocks: ["foundation-workflow"], completionCriteria: ["Typed capture and recommendation schema", "Representative safe, uncertain and escalation cases"] },
      { id: "foundation-workflow", name: "Photo-to-comfort workflow", whyRequired: "The first version must prove that one guided capture can produce an understandable and actionable plan.", dependsOn: ["foundation-evidence", "foundation-model"], unlocks: ["foundation-evaluation"], completionCriteria: ["Photo and context intake", "Three ranked recommendations", "Loading, empty, invalid-image and escalation states"] },
      { id: "foundation-evaluation", name: "Recommendation evaluation loop", whyRequired: "The team must learn whether advice is safe, specific and useful after someone tries it.", dependsOn: ["foundation-workflow"], unlocks: ["review-readiness"], completionCriteria: ["Safety review rubric", "Action usefulness feedback", "Repeatable room-case test set"] },
    ],
    buildPhases: [
      { id: "phase-purpose", name: "Validate room-comfort decisions", purpose: "Learn which discomforts people can describe, which clues a photo contributes and which advice they consider actionable.", dependencyIds: [], outcomes: ["Defined primary room scenarios", "Comfort and safety taxonomy", "Explicit non-goals"], exitCriteria: ["Target users recognize the problem", "A safety reviewer accepts the advice boundaries"] },
      { id: "phase-foundation", name: "Build the safe core workflow", purpose: "Create one complete path from guided room capture to a ranked, explainable comfort plan.", dependencyIds: ["phase-purpose"], outcomes: ["Typed room evidence model", "Working photo-to-plan journey", "Safety and uncertainty states"], exitCriteria: ["Representative room cases produce specific plans", "No output diagnoses a hidden hazard"] },
      { id: "phase-complete", name: "Evaluate action quality", purpose: "Verify that users understand the plan, choose a sensible first action and know when to seek professional help.", dependencyIds: ["phase-foundation"], outcomes: ["Accessible responsive experience", "Safety review evidence", "Action usefulness feedback"], exitCriteria: ["Users identify a first action without prompting", "Known safety and recommendation gaps are explicit"] },
    ],
    codexTasks: [
      {
        id: "task-product-contract", phaseId: "phase-purpose", title: "Define the room evidence and safety contract",
        purpose: "Represent what the user supplies, what the photo visibly supports, what remains uncertain and which cases require escalation.",
        dependencies: ["foundation-evidence"], expectedFiles: ["lib/room-analysis/schema.ts", "lib/room-analysis/sample-cases.ts", "docs/room-safety-contract.md"],
        acceptanceCriteria: ["The schema separates visual observations, user-reported conditions and inferred possibilities.", "Every recommendation includes evidence, confidence, effort, cost band and escalation guidance.", "Representative hazard cases cannot produce a do-it-yourself diagnosis."],
        tests: ["Validate normal, incomplete, conflicting and escalation sample cases.", "Assert prohibited hazard diagnoses fail policy validation."],
        prohibitedScope: ["Live image model integration", "Contractor referrals", "Shopping links", "Authentication", "Database persistence"],
        definitionOfDone: ["Types compile", "Safety cases validate", "A reviewer can inspect every decision boundary", "The core workflow has no unresolved data dependency"],
      },
      {
        id: "task-core-slice", phaseId: "phase-foundation", title: "Implement the guided photo-to-comfort plan",
        purpose: "Let a user add one room photo, answer concise context questions and receive three ranked, explainable low-risk actions.",
        dependencies: ["foundation-evidence", "foundation-model"], expectedFiles: ["app/page.tsx", "components/room-capture.tsx", "components/comfort-plan.tsx", "lib/room-analysis/mock-analyzer.ts"],
        acceptanceCriteria: ["The capture flow asks only for context that materially changes advice.", "Each action cites the photo clue or context answer that supports it.", "The result distinguishes safe changes, measurements to gather and professional escalation.", "The journey works at 375px and 1280px without horizontal overflow."],
        tests: ["Unit test representative room inputs against deterministic recommendations.", "Component test missing-photo, incomplete-context, success and escalation states.", "Run the complete mobile and desktop journey."],
        prohibitedScope: ["Computer-vision API", "Augmented reality", "Room redesign renderer", "Marketplace", "Autonomous purchasing"],
        definitionOfDone: ["Acceptance criteria pass", "Automated tests pass", "Keyboard flow is complete", "Five representative room cases have been reviewed"],
      },
      {
        id: "task-evaluation", phaseId: "phase-complete", title: "Add comfort-plan evaluation and completion review",
        purpose: "Measure whether recommendations are safe, specific, understandable and useful after a user acts on them.",
        dependencies: ["task-core-slice", "foundation-evaluation"], expectedFiles: ["components/comfort-review.tsx", "lib/room-analysis/evaluation.ts", "tests/room-evaluation.test.ts"],
        acceptanceCriteria: ["Users can record which action they chose and whether comfort improved.", "Unresolved observations and professional-review triggers remain visible.", "A reviewer can replay the same room case and compare the resulting plan."],
        tests: ["Unit test safety and specificity evaluation rules.", "Verify success, no-improvement and escalation completion states.", "Run the full keyboard journey at mobile and desktop widths."],
        prohibitedScope: ["Behavioral tracking", "Analytics dashboard", "Automated contractor contact", "New recommendation categories"],
        definitionOfDone: ["Action evidence is visible", "Safety review passes", "Critical states are covered", "Launch blockers are explicit"],
      },
    ],
    review: {
      purposeAlignment: ["The plan prioritizes a safe next action over decorative inspiration.", "Photo analysis depends on context, safety boundaries and an explainable evidence model."],
      unresolvedQuestions: ["Which four context questions improve recommendation quality most?", "Which room discomforts can be addressed safely without sensors or professional inspection?"],
      launchBlockers: ["No building-safety review of recommendation boundaries yet", "No observed room-capture sessions with target users"],
    },
  };
}
