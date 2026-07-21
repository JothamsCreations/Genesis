"use client";

import type { RefObject } from "react";
import { useState } from "react";

import { BuildPackLibrary } from "@/components/genesis/build-pack-library";
import { FieldShieldPrototype } from "@/components/genesis/fieldshield-prototype";
import { Button } from "@/components/ui/button";
import type { BlueprintGenerationMeta, ProductBlueprint, Specialist } from "@/lib/blueprint/types";
import {
  FIELD_SHIELD_CREATION_PRINCIPLE,
  FIELD_SHIELD_SPECIALIST_NAMES,
  FIELD_SHIELD_SYNTHESIS,
} from "@/lib/demo/fieldshield";

type FieldShieldDemoWorkspaceProps = {
  blueprint: ProductBlueprint;
  copyStatus: "idle" | "copied" | "error";
  headingRef: RefObject<HTMLHeadingElement | null>;
  meta: BlueprintGenerationMeta;
  onCopy: () => void;
  onDownload: () => void;
  onReset: () => void;
};

const stages = [
  { id: "purpose", label: "Purpose", cue: "Find the real product" },
  { id: "council", label: "Council", cue: "Distribute the thinking" },
  { id: "premortem", label: "Premortem", cue: "Expose failure early" },
  { id: "order", label: "Creation order", cue: "Sequence dependencies" },
  { id: "pack", label: "Build pack", cue: "Make it executable" },
  { id: "proof", label: "Working proof", cue: "Show what gets built" },
] as const;

const specialistRoles: Record<Specialist, string> = {
  vision: "Defines the operating truth",
  user: "Protects the field experience",
  risk: "Finds compounding failure",
  architecture: "Orders the foundations",
};

function ScopePanel({ blueprint }: { blueprint: ProductBlueprint }) {
  const essentials = blueprint.boundaries.features
    .filter((feature) => feature.priority === "essential")
    .slice(0, 4);
  const nonGoals = blueprint.boundaries.nonGoals.slice(0, 4);

  return (
    <div className="demo-scope">
      <section>
        <div className="demo-section-heading">
          <h2>Build now</h2>
          <span>{blueprint.boundaries.features.filter((feature) => feature.priority === "essential").length} essentials</span>
        </div>
        <div className="scope-stack">
          {essentials.map((feature) => (
            <article key={feature.id}>
              <strong>{feature.name}</strong>
              <p>{feature.rationale}</p>
            </article>
          ))}
        </div>
      </section>
      <section>
        <div className="demo-section-heading">
          <h2>Do not build</h2>
          <span>{blueprint.boundaries.nonGoals.length} exclusions</span>
        </div>
        <ul className="scope-exclusions">
          {nonGoals.map((goal) => <li key={goal}>{goal.replace(/^Do not /, "")}</li>)}
        </ul>
      </section>
    </div>
  );
}

function PurposeStage({
  blueprint,
  headingRef,
}: {
  blueprint: ProductBlueprint;
  headingRef: RefObject<HTMLHeadingElement | null>;
}) {
  return (
    <div className="demo-purpose">
      <div className="demo-purpose-lead">
        <p className="demo-kicker">GENESIS synthesis</p>
        <h1 ref={headingRef} tabIndex={-1}>FieldShield is the real product.</h1>
        <p className="demo-purpose-statement">{blueprint.purpose.purposeStatement}</p>
        <div className="idea-reframe">
          <span>The request</span>
          <p>{blueprint.intake.idea}</p>
          <span>The real need</span>
          <p>{blueprint.purpose.desiredTransformation}</p>
        </div>
      </div>
      <ScopePanel blueprint={blueprint} />
    </div>
  );
}

function CouncilStage({ blueprint }: { blueprint: ProductBlueprint }) {
  return (
    <div className="demo-council">
      <header className="demo-panel-header">
        <p className="demo-kicker">Distributed intelligence</p>
        <h1>Four specialists. One product decision.</h1>
        <p>Each agent protects a different part of the idea. GENESIS keeps them aligned to one purpose.</p>
      </header>
      <div className="council-layout">
        <div className="council-list">
          {blueprint.specialistFindings.map((item, index) => (
            <article key={item.specialist}>
              <span className="council-number">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <div className="council-name">
                  <h2>{FIELD_SHIELD_SPECIALIST_NAMES[item.specialist]}</h2>
                  <span>{specialistRoles[item.specialist]}</span>
                </div>
                <p>{item.finding}</p>
                <strong>{item.recommendation}</strong>
              </div>
            </article>
          ))}
        </div>
        <aside className="orchestrator-decision">
          <span>Central decision</span>
          <h2>Build the evidence pipeline before the control room.</h2>
          <p>{FIELD_SHIELD_SYNTHESIS}</p>
          <dl>
            <div><dt>Preserve</dt><dd>KoboToolbox for questionnaire administration</dd></div>
            <div><dt>Add</dt><dd>Coordination, quality, continuity and handover</dd></div>
          </dl>
        </aside>
      </div>
    </div>
  );
}

function PremortemStage({ blueprint }: { blueprint: ProductBlueprint }) {
  const [selectedId, setSelectedId] = useState(blueprint.premortem[0].id);
  const selected = blueprint.premortem.find((risk) => risk.id === selectedId) ?? blueprint.premortem[0];

  return (
    <div className="demo-premortem">
      <header className="demo-panel-header">
        <p className="demo-kicker">Premortem</p>
        <h1>Failure, before investment.</h1>
        <p>GENESIS imagines the fieldwork failed, then converts each cause into an early warning and prevention.</p>
      </header>
      <div className="risk-workbench">
        <nav aria-label="FieldShield premortem risks">
          {blueprint.premortem.map((risk, index) => (
            <button
              aria-current={risk.id === selected.id ? "true" : undefined}
              key={risk.id}
              onClick={() => setSelectedId(risk.id)}
              type="button"
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{risk.failure}</strong>
              <small>{risk.category}</small>
            </button>
          ))}
        </nav>
        <article className="risk-inspection" aria-live="polite">
          <div className="risk-level">
            <span>{selected.likelihood} likelihood</span>
            <span>{selected.impact} impact</span>
          </div>
          <h2>{selected.failure}</h2>
          <p>{selected.underlyingCause}</p>
          <dl>
            <div><dt>Watch for</dt><dd>{selected.warningSigns.join("; ")}</dd></div>
            <div><dt>Prevent it</dt><dd>{selected.prevention}</dd></div>
            <div><dt>Test this week</dt><dd>{selected.validationTest}</dd></div>
          </dl>
        </article>
      </div>
    </div>
  );
}

function OrderStage({ blueprint }: { blueprint: ProductBlueprint }) {
  return (
    <div className="demo-order">
      <header className="demo-panel-header">
        <p className="demo-kicker">Dependency logic</p>
        <h1>Build what the visible product depends on.</h1>
        <p>The most impressive screen comes seventh because six invisible foundations must make it trustworthy.</p>
      </header>
      <blockquote>{FIELD_SHIELD_CREATION_PRINCIPLE}</blockquote>
      <ol className="creation-path">
        {blueprint.foundations.map((foundation, index) => (
          <li key={foundation.id}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div>
              <h2>{foundation.name}</h2>
              <p>{foundation.whyRequired}</p>
            </div>
            <small>{index === 0 ? "Starting point" : "Unlocked by the step before it"}</small>
          </li>
        ))}
      </ol>
    </div>
  );
}

function WorkspaceStage({
  activeStage,
  blueprint,
  headingRef,
}: {
  activeStage: number;
  blueprint: ProductBlueprint;
  headingRef: RefObject<HTMLHeadingElement | null>;
}) {
  switch (stages[activeStage].id) {
    case "purpose":
      return <PurposeStage blueprint={blueprint} headingRef={headingRef} />;
    case "council":
      return <CouncilStage blueprint={blueprint} />;
    case "premortem":
      return <PremortemStage blueprint={blueprint} />;
    case "order":
      return <OrderStage blueprint={blueprint} />;
    case "pack":
      return <BuildPackLibrary blueprint={blueprint} />;
    case "proof":
      return <FieldShieldPrototype />;
  }
}

export function FieldShieldDemoWorkspace({
  blueprint,
  copyStatus,
  headingRef,
  meta,
  onCopy,
  onDownload,
  onReset,
}: FieldShieldDemoWorkspaceProps) {
  const [activeStage, setActiveStage] = useState(0);
  const nextStage = stages[activeStage + 1];
  const sourceLabel = meta.mode === "openai" ? "Live OpenAI analysis" : "Deterministic demo";

  function selectStage(index: number) {
    setActiveStage(index);
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  return (
    <main className="demo-workspace" id="main-content">
      <header className="demo-workspace-header">
        <div>
          <button className="text-action" onClick={onReset} type="button">New idea</button>
          <span aria-hidden="true">/</span>
          <strong>FieldShield</strong>
        </div>
        <p><span className="status-signal" aria-hidden="true" />{sourceLabel}. Fictional data.</p>
        <div className="workspace-actions">
          <Button onClick={onCopy} variant="quiet">Copy full blueprint</Button>
          <Button onClick={onDownload} variant="secondary">Download build pack</Button>
        </div>
      </header>

      <nav className="demo-stage-nav" aria-label="FieldShield demonstration">
        {stages.map((stage, index) => (
          <button
            aria-current={activeStage === index ? "step" : undefined}
            aria-label={stage.label}
            className={activeStage === index ? "active" : activeStage > index ? "complete" : ""}
            key={stage.id}
            onClick={() => selectStage(index)}
            type="button"
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{stage.label}</strong>
            <small>{stage.cue}</small>
          </button>
        ))}
      </nav>

      <section className="demo-stage-canvas" key={stages[activeStage].id}>
        <WorkspaceStage activeStage={activeStage} blueprint={blueprint} headingRef={headingRef} />
      </section>

      <footer className="demo-stage-footer">
        <p>
          <strong>{stages[activeStage].label}</strong>
          <span>{stages[activeStage].cue}</span>
        </p>
        <div>
          {activeStage > 0 ? (
            <Button onClick={() => selectStage(activeStage - 1)} variant="quiet">Back</Button>
          ) : null}
          {nextStage ? (
            <Button onClick={() => selectStage(activeStage + 1)}>
              Continue to {nextStage.label}
            </Button>
          ) : (
            <Button onClick={onReset}>Shape another idea</Button>
          )}
        </div>
      </footer>

      {copyStatus === "copied" ? <p className="workspace-toast" role="status">Full blueprint copied.</p> : null}
      {copyStatus === "error" ? <p className="workspace-toast error" role="status">Copy failed. Download remains available.</p> : null}
    </main>
  );
}
