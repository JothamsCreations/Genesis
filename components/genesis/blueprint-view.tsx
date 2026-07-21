import type { RefObject } from "react";

import { Button } from "@/components/ui/button";
import { BuildPackLibrary } from "@/components/genesis/build-pack-library";
import { FieldShieldPrototype } from "@/components/genesis/fieldshield-prototype";
import type { BlueprintGenerationMeta, ProductBlueprint, Specialist } from "@/lib/blueprint/types";
import { FIELD_SHIELD_CREATION_PRINCIPLE, FIELD_SHIELD_SPECIALIST_NAMES, FIELD_SHIELD_SYNTHESIS } from "@/lib/demo/fieldshield";

type BlueprintViewProps = {
  blueprint: ProductBlueprint;
  fieldShieldDemo?: boolean;
  copyStatus: "idle" | "copied" | "error";
  headingRef: RefObject<HTMLHeadingElement | null>;
  meta: BlueprintGenerationMeta;
  onCopy: () => void;
  onDownload: () => void;
  onReset: () => void;
};

const specialistNames: Record<Specialist, string> = {
  vision: "Vision architect",
  user: "User advocate",
  risk: "Risk strategist",
  architecture: "Systems architect",
};

function SectionLabel({ children, number }: { children: string; number: string }) {
  return <p className="section-label"><span>{number}</span>{children}</p>;
}

export function BlueprintView({
  blueprint,
  fieldShieldDemo = false,
  copyStatus,
  headingRef,
  meta,
  onCopy,
  onDownload,
  onReset,
}: BlueprintViewProps) {
  const essential = blueprint.boundaries.features.filter((feature) => feature.priority === "essential");
  const resolvedSpecialistNames = fieldShieldDemo ? FIELD_SHIELD_SPECIALIST_NAMES : specialistNames;
  const sourceLabel = meta.mode === "openai"
    ? `Generated with ${meta.model ?? "GPT-5.6 Sol"}`
    : meta.fallbackReason === "demo_mode"
      ? "Demo blueprint"
      : "Local fallback";

  return (
    <main className="blueprint-shell" id="main-content">
      <aside className="blueprint-summary">
        <p className="eyebrow">Blueprint 01 / {sourceLabel}</p>
        <h1 ref={headingRef} tabIndex={-1}>Your GENESIS blueprint</h1>
        <p className="summary-title">{blueprint.purpose.workingTitle}</p>
        <p className="summary-copy">{blueprint.purpose.purposeStatement}</p>
        <dl className="summary-facts">
          <div><dt>Primary user</dt><dd>{blueprint.purpose.primaryUser}</dd></div>
          <div><dt>First-version measure</dt><dd>{blueprint.purpose.successCriteria[0]}</dd></div>
          <div><dt>Current confidence</dt><dd>Assumption-led, ready for validation</dd></div>
        </dl>
        <div className="summary-actions">
          <Button onClick={onCopy}>Copy build pack</Button>
          <Button onClick={onDownload} variant="secondary">Download Markdown</Button>
          <Button onClick={onReset} variant="quiet">Start another idea</Button>
        </div>
        {copyStatus === "copied" ? <p className="copy-status success" role="status">Build pack copied.</p> : null}
        {copyStatus === "error" ? <p className="copy-status error" role="status">Copy failed. Please try again.</p> : null}
        <div className="generation-note">
          <strong>{sourceLabel}</strong>
          {meta.notice ? <p>{meta.notice}</p> : <p>Structured analysis validated against GENESIS schema 1.0.</p>}
        </div>
      </aside>

      <article className="blueprint-document">
        <header className="document-header">
          <div className="document-kicker"><span>Product blueprint</span><span>Schema 1.0</span></div>
          <p>{blueprint.intake.idea}</p>
        </header>

        <section className="blueprint-section" aria-labelledby="purpose-heading">
          <SectionLabel number="01">Purpose before production</SectionLabel>
          <h2 id="purpose-heading">Purpose</h2>
          <p className="section-thesis">{blueprint.purpose.desiredTransformation}</p>
          <div className="two-column-notes">
            <div><h3>Problem</h3><p>{blueprint.purpose.problem}</p></div>
            <div><h3>Value proposition</h3><p>{blueprint.purpose.valueProposition}</p></div>
          </div>
          <div className="criteria-block">
            <h3>Success becomes visible when</h3>
            <ul>{blueprint.purpose.successCriteria.map((criterion) => <li key={criterion}>{criterion}</li>)}</ul>
          </div>
        </section>

        <section className="blueprint-section" aria-labelledby="boundaries-heading">
          <SectionLabel number="02">Separate essentials from distractions</SectionLabel>
          <h2 id="boundaries-heading">Boundaries</h2>
          <div className="boundary-grid">
            <div>
              <h3>Essential now</h3>
              {essential.map((feature) => <div className="boundary-item" key={feature.id}><strong>{feature.name}</strong><p>{feature.rationale}</p></div>)}
            </div>
            <div>
              <h3>Not in this version</h3>
              <ul className="plain-list">{blueprint.boundaries.nonGoals.map((goal) => <li key={goal}>{goal}</li>)}</ul>
            </div>
          </div>
        </section>

        <section className="blueprint-section" aria-labelledby="specialists-heading">
          <SectionLabel number="03">Central vision, distributed intelligence</SectionLabel>
          <h2 id="specialists-heading">Specialist perspectives</h2>
          <div className="specialist-grid">
            {blueprint.specialistFindings.map((item) => (
              <article key={`${item.specialist}-${item.finding}`}>
                <div className="specialist-heading"><h3>{resolvedSpecialistNames[item.specialist]}</h3><span>{item.confidence}</span></div>
                <p>{item.finding}</p>
                <strong>Recommendation</strong>
                <p>{item.recommendation}</p>
              </article>
            ))}
          </div>
          {fieldShieldDemo ? (
            <div className="central-synthesis">
              <span>Central GENESIS synthesis</span>
              <p>{FIELD_SHIELD_SYNTHESIS}</p>
            </div>
          ) : null}
        </section>

        <section className="blueprint-section" aria-labelledby="premortem-heading">
          <SectionLabel number="04">Imagine the failure before investment</SectionLabel>
          <h2 id="premortem-heading">Premortem</h2>
          <div className="risk-list">
            {blueprint.premortem.map((risk, index) => (
              <article className="risk-row" key={risk.id}>
                <div className="risk-index">R{index + 1}</div>
                <div>
                  <div className="risk-meta"><span>{risk.category}</span><span>{risk.likelihood} likelihood</span><span>{risk.impact} impact</span></div>
                  <h3>{risk.failure}</h3>
                  <p>{risk.underlyingCause}</p>
                  <dl>
                    <div><dt>Early warning</dt><dd>{risk.warningSigns.join("; ")}</dd></div>
                    <div><dt>Prevent</dt><dd>{risk.prevention}</dd></div>
                    <div><dt>Test early</dt><dd>{risk.validationTest}</dd></div>
                  </dl>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="blueprint-section" aria-labelledby="foundations-heading">
          <SectionLabel number="05">Foundations before visible features</SectionLabel>
          <h2 id="foundations-heading">Foundations</h2>
          {fieldShieldDemo ? (
            <blockquote className="creation-principle">{FIELD_SHIELD_CREATION_PRINCIPLE}</blockquote>
          ) : null}
          <ol className="foundation-sequence">
            {blueprint.foundations.map((foundation, index) => (
              <li key={foundation.id}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div><h3>{foundation.name}</h3><p>{foundation.whyRequired}</p><small>{foundation.dependsOn.length ? `Depends on ${foundation.dependsOn.length} earlier foundation${foundation.dependsOn.length > 1 ? "s" : ""}` : "Starting foundation"}</small></div>
              </li>
            ))}
          </ol>
        </section>

        <section className="blueprint-section" aria-labelledby="plan-heading">
          <SectionLabel number="06">Create in dependency order</SectionLabel>
          <h2 id="plan-heading">Ordered build plan</h2>
          <ol className="phase-list">
            {blueprint.buildPhases.map((phase, index) => (
              <li key={phase.id}>
                <div className="phase-number">Phase {index + 1}</div>
                <div><h3>{phase.name}</h3><p>{phase.purpose}</p><strong>Exit when</strong><ul>{phase.exitCriteria.map((criterion) => <li key={criterion}>{criterion}</li>)}</ul></div>
              </li>
            ))}
          </ol>
        </section>

        <section className="blueprint-section task-section" aria-labelledby="task-heading">
          <SectionLabel number="06 / Build pack">Ready for Codex</SectionLabel>
          <h2 id="task-heading">Codex-ready tasks</h2>
          <p className="task-intro">Ordered work units that preserve the blueprint&apos;s boundaries and completion standard.</p>
          <ol className="codex-task-list">
            {blueprint.codexTasks.map((task, index) => (
              <li key={task.id}>
                <div className="task-marker">Task {String(index + 1).padStart(2, "0")}</div>
                <p className="task-title">{task.title}</p>
                <p>{task.purpose}</p>
                <div className="task-grid">
                  <div><h3>Acceptance criteria</h3><ul>{task.acceptanceCriteria.map((item) => <li key={item}>{item}</li>)}</ul></div>
                  <div><h3>Tests</h3><ul>{task.tests.map((item) => <li key={item}>{item}</li>)}</ul></div>
                  <div><h3>Expected files</h3><ul>{task.expectedFiles.map((item) => <li key={item}><code>{item}</code></li>)}</ul></div>
                  <div><h3>Prohibited scope</h3><ul>{task.prohibitedScope.map((item) => <li key={item}>{item}</li>)}</ul></div>
                </div>
                <div className="definition"><h3>Definition of done</h3><p>{task.definitionOfDone.join(" | ")}</p></div>
              </li>
            ))}
          </ol>
        </section>

        <section className="blueprint-section review-section" aria-labelledby="review-heading">
          <SectionLabel number="07">Completion and review</SectionLabel>
        {fieldShieldDemo ? (
          <>
            <BuildPackLibrary blueprint={blueprint} />
            <FieldShieldPrototype />
          </>
        ) : null}
          <h2 id="review-heading">Completion review</h2>
          <div className="review-grid">
            <div><h3>Purpose alignment</h3><ul>{blueprint.review.purposeAlignment.map((item) => <li key={item}>{item}</li>)}</ul></div>
            <div><h3>Unresolved questions</h3><ul>{blueprint.review.unresolvedQuestions.map((item) => <li key={item}>{item}</li>)}</ul></div>
            <div><h3>Launch blockers</h3><ul>{blueprint.review.launchBlockers.map((item) => <li key={item}>{item}</li>)}</ul></div>
          </div>
        </section>
      </article>
    </main>
  );
}
