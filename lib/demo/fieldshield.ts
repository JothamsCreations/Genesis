import type { IdeaInput, ProductBlueprint, Specialist } from "@/lib/blueprint/types";

export const FIELD_SHIELD_INITIAL_IDEA =
  "I need an application that will help me complete my PhD data collection while pregnant.";

export const FIELD_SHIELD_CONSTRAINTS = [
  "640 questionnaire responses across four LGAs in Oyo State",
  "160 respondents in each LGA",
  "Approximately 16 research assistants",
  "Quantitative questionnaires and qualitative interviews",
  "Five months for data collection and analysis",
  "Childbirth expected during the fieldwork period",
  "Unreliable internet connectivity",
  "English, Yoruba and Pidgin interactions",
  "KoboToolbox already handles questionnaire administration",
];

export const FIELD_SHIELD_CLARIFICATION = {
  facts: [
    { label: "Collection target", value: "640 questionnaire responses" },
    { label: "Coverage", value: "Four Oyo State LGAs / 160 respondents each" },
    { label: "Field team", value: "Approximately 16 research assistants" },
    { label: "Methods", value: "Questionnaires and qualitative interviews" },
    { label: "Continuity risk", value: "Childbirth may interrupt principal-researcher supervision" },
    { label: "Field conditions", value: "Unreliable internet / English, Yoruba and Pidgin" },
    { label: "Existing tool", value: "KoboToolbox already handles questionnaire administration" },
  ],
  insight:
    "The product is not another survey form. It is a fieldwork coordination, continuity, quality-control and handover system.",
};

export const FIELD_SHIELD_SPECIALIST_NAMES: Record<Specialist, string> = {
  vision: "Research Operations Agent",
  user: "User Experience Agent",
  risk: "Risk Agent",
  architecture: "Architecture Agent",
};

export const FIELD_SHIELD_SYNTHESIS =
  "Coordinate the field operation around trustworthy activity records, balanced sampling and delegated continuity. Build the evidence pipeline before the control room.";

export const FIELD_SHIELD_CREATION_PRINCIPLE =
  "Do not begin with the dashboard. The dashboard depends on trustworthy field activity data.";

export type FieldShieldLga = {
  name: string;
  completed: number;
  target: number;
  assignedRAs: string[];
  dailyOutput: number;
  unsynced: number;
  correctionRate: number;
  latestActivity: string;
};

export type FieldShieldPrototype = {
  totalCompleted: number;
  totalTarget: number;
  activeRAs: number;
  totalRAs: number;
  todayCompleted: number;
  todayTarget: number;
  unsynced: number;
  duplicates: number;
  incomplete: number;
  interviewsCompleted: number;
  interviewsTarget: number;
  transcriptionBacklog: number;
  lgas: FieldShieldLga[];
};

export const FIELD_SHIELD_PROTOTYPE: FieldShieldPrototype = {
  totalCompleted: 427,
  totalTarget: 640,
  activeRAs: 14,
  totalRAs: 16,
  todayCompleted: 41,
  todayTarget: 48,
  unsynced: 23,
  duplicates: 7,
  incomplete: 12,
  interviewsCompleted: 31,
  interviewsTarget: 40,
  transcriptionBacklog: 9,
  lgas: [
    { name: "Ibadan North", completed: 118, target: 160, assignedRAs: ["RA-01", "RA-02", "RA-03", "RA-04"], dailyOutput: 12, unsynced: 5, correctionRate: 2.5, latestActivity: "12 field records logged today; five await sync." },
    { name: "Akinyele", completed: 106, target: 160, assignedRAs: ["RA-05", "RA-06", "RA-07", "RA-08"], dailyOutput: 9, unsynced: 8, correctionRate: 4.7, latestActivity: "A supervisor review was opened for two incomplete records." },
    { name: "Ogbomoso North", completed: 111, target: 160, assignedRAs: ["RA-09", "RA-10", "RA-11", "RA-12"], dailyOutput: 11, unsynced: 3, correctionRate: 3.1, latestActivity: "All four assistants reported within the last two hours." },
    { name: "Iseyin", completed: 92, target: 160, assignedRAs: ["RA-13", "RA-14", "RA-15", "RA-16"], dailyOutput: 9, unsynced: 7, correctionRate: 5.4, latestActivity: "Sampling is below this week's trajectory; rebalance recommended." },
  ],
};

export function isFieldShieldIdea(idea: string) {
  const value = idea.trim().toLowerCase();
  return value.includes("fieldshield")
    || (value.includes("phd") && value.includes("data collection"))
    || (value.includes("pregnant") && value.includes("fieldwork"))
    || (value.includes("questionnaire") && value.includes("research assistant"));
}

export function isFieldShieldBlueprint(blueprint: ProductBlueprint) {
  return blueprint.purpose.workingTitle === "FieldShield";
}

const foundationSpecs = [
  ["foundation-roles", "Research structure and user roles", "Define who can record, supervise and assume stewardship."],
  ["foundation-assignments", "LGA, community and RA assignments", "Attach every activity record to an accountable territory and assistant."],
  ["foundation-offline", "Offline activity capture", "Keep fieldwork moving when connectivity disappears."],
  ["foundation-sync", "Synchronisation queue", "Move locally captured activity into a trustworthy shared record."],
  ["foundation-progress", "Progress and quota calculations", "Calculate sampling balance only from reconciled activity."],
  ["foundation-quality", "Data-quality warnings", "Detect duplicates and incomplete records before they compound."],
  ["foundation-dashboard", "Supervisor dashboard", "Reveal operational truth without replacing field evidence."],
  ["foundation-handover", "Alerts, handover and reporting", "Keep decisions moving when the principal researcher is unavailable."],
] as const;

export function generateFieldShieldBlueprint(input: IdeaInput): ProductBlueprint {
  const idea = input.idea.trim();
  const foundations = foundationSpecs.map(([id, name, whyRequired], index) => ({
    id,
    name,
    whyRequired,
    dependsOn: index === 0 ? [] : [foundationSpecs[index - 1][0]],
    unlocks: index === foundationSpecs.length - 1 ? [] : [foundationSpecs[index + 1][0]],
    completionCriteria: [name + " has a typed contract.", "A representative offline or handover case passes review."],
  }));

  const essentialNames = [
    "Research-assistant assignments",
    "Daily collection targets",
    "Progress by LGA",
    "Offline activity and synchronisation status",
    "Incomplete-record warnings",
    "Possible duplicate warnings",
    "Interview and transcription tracking",
    "Supervisor handover mode",
    "Daily fieldwork summary",
  ];

  const risks: ProductBlueprint["premortem"] = [
    ["sampling", "Sampling balance", "One or more LGAs finish materially under target.", "Daily effort is not rebalanced against the 160-response quota.", "An LGA remains below 70% of weekly target.", "Reassign assistants and rebalance the next day's targets.", "Simulate an under-target LGA and verify a supervisor sees the intervention."],
    ["duplicates", "Data quality", "Duplicate participant records distort the sample.", "Similar records are accepted without a review path.", "Repeated demographic and contact patterns appear.", "Flag possible duplicates for human review without deleting source data.", "Seed two similar fictional records and verify the review warning."],
    ["sync", "Connectivity", "Offline submissions remain invisible for too long.", "Devices do not surface the age and state of their sync queue.", "A device stays unsynchronised for more than 24 hours.", "Persist a local queue and escalate ageing submissions.", "Keep a fixture offline for 25 hours and verify the alert."],
    ["continuity", "Operations", "Field decisions stop around childbirth.", "Authority and context remain concentrated in one researcher.", "Open decisions have no delegated owner.", "Provide a deliberate handover mode with a concise operating brief.", "Activate handover and verify a supervisor can see priorities."],
    ["transcription", "Qualitative research", "Interview audio accumulates without transcription.", "The team tracks completions but not ageing work.", "The transcription backlog exceeds seven days.", "Show backlog age and prioritize the oldest interview.", "Age a fictional interview eight days and verify its priority."],
    ["incomplete", "Team quality", "One assistant repeatedly submits incomplete records.", "Error patterns are hidden inside aggregate progress.", "An assistant's correction rate rises above the team.", "Surface the pattern and trigger targeted retraining.", "Seed repeated incomplete records and verify an assistant-level warning."],
  ].map(([id, category, failure, cause, warning, prevention, validation]) => ({
    id: "risk-" + id,
    category,
    failure,
    underlyingCause: cause,
    likelihood: "high" as const,
    impact: "high" as const,
    warningSigns: [warning],
    prevention,
    validationTest: validation,
  }));

  return {
    schemaVersion: "1.0",
    id: "bp-fieldshield-demo",
    createdAt: "2026-07-21T00:00:00.000Z",
    intake: { idea, constraints: input.constraints.length ? [...input.constraints] : [...FIELD_SHIELD_CONSTRAINTS] },
    purpose: {
      workingTitle: "FieldShield",
      purposeStatement: "Keep fieldwork accurate, balanced and operational even when the principal researcher cannot personally supervise every team or location.",
      primaryUser: "A principal researcher coordinating assistants across disconnected field locations",
      problem: "Sampling progress, data quality, interview work and field decisions become fragmented across locations and can stall when supervision is interrupted.",
      desiredTransformation: "Move the researcher from fragile personal oversight to a balanced, observable field operation that can continue safely through delegated supervision.",
      valueProposition: "One offline-aware command centre for assignments, sampling balance, quality warnings, interview backlog and deliberate handover.",
      successCriteria: ["Each LGA stays within 10% of its planned weekly trajectory.", "Offline records older than 24 hours and quality exceptions are visible to a supervisor.", "Handover preserves open decisions and current field priorities."],
    },
    boundaries: {
      features: essentialNames.map((name, index) => ({ id: "feature-" + (index + 1), name, rationale: "Required for reliable field coordination and continuity.", priority: "essential" as const })),
      nonGoals: ["Do not replace KoboToolbox questionnaire administration.", "Do not perform statistical analysis.", "Do not process participant payments.", "Do not add research-assistant payroll.", "Do not add complex geofencing.", "Do not become a general-purpose research-management platform."],
      assumptions: [
        { id: "assumption-activity", statement: "Assistants can record a small operational activity log consistently.", confidence: "assumption", evidenceNeeded: "Observe a week of realistic field use." },
        { id: "assumption-supervisor", statement: "A delegated supervisor can act on concise warnings.", confidence: "assumption", evidenceNeeded: "Rehearse one full handover." },
        { id: "assumption-offline", statement: "Devices can retain activity safely until connectivity returns.", confidence: "supported", evidenceNeeded: "Test queue recovery after interruption." },
        { id: "assumption-quality", statement: "Metadata can reveal exceptions without exposing participant identities.", confidence: "assumption", evidenceNeeded: "Review the minimal-data policy." },
      ],
    },
    specialistFindings: [
      { specialist: "vision", finding: "The real product is operational continuity, not another survey tool.", recommendation: "Organise the experience around balanced sampling and delegated decisions.", confidence: "supported" },
      { specialist: "user", finding: "Assistants need fast local capture while supervisors need exceptions, not raw forms.", recommendation: "Separate the field recorder from the supervisor command view.", confidence: "supported" },
      { specialist: "risk", finding: "Connectivity, concentrated authority and hidden quality drift can compound.", recommendation: "Treat sync age, sampling balance and handover readiness as first-class signals.", confidence: "supported" },
      { specialist: "architecture", finding: "The dashboard is downstream of offline capture, sync reconciliation and quality rules.", recommendation: "Build the trustworthy activity pipeline before visible reporting.", confidence: "validated" },
    ],
    premortem: risks,
    foundations,
    dependencies: foundationSpecs.slice(0, -1).map((item, index) => ({ from: item[0], to: foundationSpecs[index + 1][0], reason: foundationSpecs[index + 1][1] + " depends on " + item[1].toLowerCase() + "." })),
    buildPhases: [
      { id: "phase-structure", name: "Establish field structure", purpose: "Define roles, assignments and accountable territories.", dependencyIds: [], outcomes: ["Typed research structure", "Fictional assignment fixtures"], exitCriteria: ["Every activity resolves to one role and territory."] },
      { id: "phase-capture", name: "Make activity trustworthy", purpose: "Capture offline work and reconcile it safely.", dependencyIds: ["phase-structure"], outcomes: ["Offline queue", "Sync states", "Progress calculations"], exitCriteria: ["Interrupted activity survives and later reconciles."] },
      { id: "phase-control", name: "Surface exceptions", purpose: "Turn trustworthy activity into quality and sampling decisions.", dependencyIds: ["phase-capture"], outcomes: ["Quality warnings", "Supervisor view"], exitCriteria: ["A supervisor can explain every warning."] },
      { id: "phase-continuity", name: "Complete and hand over", purpose: "Preserve decisions, alerts and reporting through absence.", dependencyIds: ["phase-control"], outcomes: ["Handover mode", "Daily field brief"], exitCriteria: ["A delegated supervisor can continue the field operation."] },
    ],
    codexTasks: [
      { id: "task-contract", phaseId: "phase-structure", title: "Define the field operations contract", purpose: "Represent roles, territories, assignments and privacy-safe activity.", dependencies: ["foundation-roles"], expectedFiles: ["lib/fieldshield/types.ts", "lib/fieldshield/fixtures.ts"], acceptanceCriteria: ["Types cover roles, assignments and activity.", "Fixtures use anonymous RA codes."], tests: ["Validate all fixtures against the contract."], prohibitedScope: ["Authentication", "Participant records", "Database"], definitionOfDone: ["Types compile.", "Fixtures validate."] },
      { id: "task-offline", phaseId: "phase-capture", title: "Implement offline activity and sync states", purpose: "Preserve field activity through unreliable connectivity.", dependencies: ["task-contract", "foundation-assignments", "foundation-offline", "foundation-sync"], expectedFiles: ["lib/fieldshield/sync.ts", "components/field-activity.tsx"], acceptanceCriteria: ["Queued activity survives interruption.", "Sync age is visible."], tests: ["Test queued, syncing, failed and reconciled states."], prohibitedScope: ["KoboToolbox replacement", "Background infrastructure"], definitionOfDone: ["State tests pass.", "Recovery path is demonstrated."] },
      { id: "task-quality", phaseId: "phase-control", title: "Build sampling and quality warnings", purpose: "Expose under-sampling, duplicates and incomplete work.", dependencies: ["task-offline", "foundation-progress", "foundation-quality"], expectedFiles: ["lib/fieldshield/warnings.ts", "components/quality-brief.tsx"], acceptanceCriteria: ["Warnings cite their source signal.", "No warning automatically rejects a record."], tests: ["Test all six premortem warning cases."], prohibitedScope: ["Statistical analysis", "Automated participant decisions"], definitionOfDone: ["Warning tests pass.", "A supervisor can inspect evidence."] },
      { id: "task-dashboard", phaseId: "phase-continuity", title: "Complete the supervisor dashboard and handover", purpose: "Turn verified activity into an actionable operating brief.", dependencies: ["task-quality", "foundation-dashboard", "foundation-handover"], expectedFiles: ["components/field-operations-dashboard.tsx", "components/handover-mode.tsx"], acceptanceCriteria: ["All four LGAs reveal progress and exceptions.", "Handover changes the visible operating state."], tests: ["Run desktop, mobile and keyboard journeys."], prohibitedScope: ["Authentication", "Notifications", "Deployment automation"], definitionOfDone: ["Acceptance criteria pass.", "Production build passes.", "The demo can run without a network."] },
    ],
    review: {
      purposeAlignment: ["The plan coordinates existing questionnaire work instead of duplicating it.", "Every visible metric depends on trustworthy field activity."],
      unresolvedQuestions: ["Which metadata identifies duplicates without storing participant identity?", "Who is the designated handover supervisor?"],
      launchBlockers: ["No field rehearsal has yet validated the handover brief.", "The minimal-data policy needs research-ethics review."],
    },
  };
}
