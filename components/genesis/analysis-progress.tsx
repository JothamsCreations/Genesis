import type { CSSProperties } from "react";

const defaultSpecialists = [
  ["Vision architect", "Clarifying the purpose and smallest meaningful promise"],
  ["User advocate", "Interrogating the user, problem and desired change"],
  ["Risk strategist", "Running the premortem and defining early warning signs"],
  ["Systems architect", "Ordering foundations, dependencies and build phases"],
  ["Central synthesis", "Reconciling findings into one coherent blueprint"],
] as const;
const fieldShieldSpecialists = [
  ["Research Operations Agent", "Testing sampling balance, workloads and continuity"],
  ["User Experience Agent", "Separating the field and supervisor experiences"],
  ["Risk Agent", "Premorteming connectivity, quality and handover failure"],
  ["Architecture Agent", "Ordering offline capture before visible reporting"],
  ["Central GENESIS", "Reconciling the four perspectives into FieldShield"],
] as const;


export function AnalysisProgress({ fieldShield = false }: { fieldShield?: boolean }) {
  const specialists = fieldShield ? fieldShieldSpecialists : defaultSpecialists;
  return (
    <main className="analysis-shell" id="main-content" aria-live="polite">
      <section className="analysis-copy">
        <p className="eyebrow">Distributed intelligence / Central vision</p>
        <h1>Specialists are examining the idea.</h1>
        <p>
          Each perspective works independently, then GENESIS resolves the findings into one ordered plan.
        </p>
      </section>
      <ol className="specialist-progress" aria-label="Specialist analysis progress">
        {specialists.map(([name, task], index) => (
          <li key={name} style={{ "--specialist-index": index } as CSSProperties}>
            <span className="specialist-signal" aria-hidden="true" />
            <div>
              <strong>{name}</strong>
              <p>{task}</p>
            </div>
            <span className="working-label">Working</span>
          </li>
        ))}
      </ol>
    </main>
  );
}
