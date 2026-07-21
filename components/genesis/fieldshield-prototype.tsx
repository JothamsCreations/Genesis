"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { FIELD_SHIELD_PROTOTYPE } from "@/lib/demo/fieldshield";

const percent = (value: number, total: number) => Math.round((value / total) * 100);

function ProgressLine({ label, value, total }: { label: string; value: number; total: number }) {
  const progress = percent(value, total);
  return (
    <div className="progress-line">
      <div><span>{label}</span><strong>{value} / {total}</strong></div>
      <div
        aria-label={label + " progress"}
        aria-valuemax={total}
        aria-valuemin={0}
        aria-valuenow={value}
        className="progress-track"
        role="progressbar"
      >
        <span style={{ width: progress + "%" }} />
      </div>
    </div>
  );
}

export function FieldShieldPrototype() {
  const [selectedName, setSelectedName] = useState(FIELD_SHIELD_PROTOTYPE.lgas[0].name);
  const [handover, setHandover] = useState(false);
  const selected = FIELD_SHIELD_PROTOTYPE.lgas.find((lga) => lga.name === selectedName)
    ?? FIELD_SHIELD_PROTOTYPE.lgas[0];

  return (
    <section className="fieldshield-prototype" aria-labelledby="fieldshield-dashboard-heading">
      <header className="prototype-header">
        <div>
          <p className="section-label">Working evidence</p>
          <h2 id="fieldshield-dashboard-heading">Field Operations Dashboard</h2>
          <p>Fictional operational data shaped from the GENESIS blueprint. No participant information is displayed.</p>
        </div>
        <div className="prototype-state">
          <span>FieldShield / Local-first</span>
          <strong>{handover ? "Delegated supervision" : "Principal researcher"}</strong>
        </div>
      </header>

      <div className="fieldshield-overview">
        <div className="fieldshield-progress">
          <span>Overall field progress</span>
          <strong>{FIELD_SHIELD_PROTOTYPE.totalCompleted} of {FIELD_SHIELD_PROTOTYPE.totalTarget} responses</strong>
          <ProgressLine
            label="Overall fieldwork"
            total={FIELD_SHIELD_PROTOTYPE.totalTarget}
            value={FIELD_SHIELD_PROTOTYPE.totalCompleted}
          />
          <p>{FIELD_SHIELD_PROTOTYPE.totalTarget - FIELD_SHIELD_PROTOTYPE.totalCompleted} responses remain across four LGAs.</p>
        </div>
        <dl className="operations-ledger">
          <div><dt>Research assistants</dt><dd>{FIELD_SHIELD_PROTOTYPE.activeRAs} active / {FIELD_SHIELD_PROTOTYPE.totalRAs}</dd></div>
          <div><dt>Today</dt><dd>{FIELD_SHIELD_PROTOTYPE.todayCompleted} / {FIELD_SHIELD_PROTOTYPE.todayTarget} completed</dd></div>
          <div><dt>Awaiting sync</dt><dd>{FIELD_SHIELD_PROTOTYPE.unsynced} field records</dd></div>
          <div><dt>Quality review</dt><dd>{FIELD_SHIELD_PROTOTYPE.duplicates} possible duplicates / {FIELD_SHIELD_PROTOTYPE.incomplete} incomplete</dd></div>
          <div><dt>Qualitative work</dt><dd>{FIELD_SHIELD_PROTOTYPE.interviewsCompleted} / {FIELD_SHIELD_PROTOTYPE.interviewsTarget} interviews / {FIELD_SHIELD_PROTOTYPE.transcriptionBacklog} awaiting transcription</dd></div>
        </dl>
      </div>

      <div className="fieldshield-workspace">
        <div className="lga-register">
          <h3>Progress by LGA</h3>
          <p>Each location targets 160 responses.</p>
          <div>
            {FIELD_SHIELD_PROTOTYPE.lgas.map((lga) => (
              <button
                aria-label={"Review " + lga.name + " fieldwork"}
                aria-pressed={selected.name === lga.name}
                key={lga.name}
                onClick={() => setSelectedName(lga.name)}
                type="button"
              >
                <ProgressLine label={lga.name} total={lga.target} value={lga.completed} />
                <small>{lga.unsynced} awaiting sync</small>
              </button>
            ))}
          </div>
        </div>

        <article className="lga-detail" aria-live="polite">
          <div className="lga-detail-heading">
            <div><span>Selected territory</span><h3>{selected.name}</h3></div>
            <strong>{selected.target - selected.completed} responses remaining</strong>
          </div>
          <dl>
            <div><dt>Assigned assistants</dt><dd>{selected.assignedRAs.join(", ")}</dd></div>
            <div><dt>Daily output</dt><dd>{selected.dailyOutput} responses</dd></div>
            <div><dt>Unsynchronised</dt><dd>{selected.unsynced} records</dd></div>
            <div><dt>Correction / rejection</dt><dd>{selected.correctionRate}%</dd></div>
          </dl>
          <div className="latest-activity"><span>Latest activity</span><p>{selected.latestActivity}</p></div>
        </article>
      </div>

      <div className="fieldshield-alerts">
        <div>
          <span>Connectivity</span>
          <strong>{FIELD_SHIELD_PROTOTYPE.unsynced} records await synchronisation</strong>
          <p>Oldest queue age: 19 hours. Escalation begins at 24 hours.</p>
        </div>
        <div>
          <span>Data quality</span>
          <strong>{FIELD_SHIELD_PROTOTYPE.duplicates + FIELD_SHIELD_PROTOTYPE.incomplete} records need review</strong>
          <p>Human review is required; FieldShield never rejects participant records automatically.</p>
        </div>
        <div>
          <span>Transcription</span>
          <strong>{FIELD_SHIELD_PROTOTYPE.transcriptionBacklog} interviews in the backlog</strong>
          <p>The oldest fictional interview has waited six days.</p>
        </div>
      </div>

      <div className="handover-panel">
        <div>
          <span>Continuity control</span>
          <h3>{handover ? "Handover brief is now visible to the delegated supervisor." : "Prepare the field operation for delegated supervision."}</h3>
          <p>Transfers priorities, sampling gaps and open quality reviews, not participant identities.</p>
        </div>
        <Button
          aria-pressed={handover}
          onClick={() => setHandover((active) => !active)}
          variant={handover ? "secondary" : "primary"}
        >
          {handover ? "Return to principal researcher" : "Activate Handover Mode"}
        </Button>
      </div>
      <p className="handover-status" role="status">
        {handover
          ? "Handover mode is active. The delegated supervisor now owns the operating brief."
          : "Handover mode is ready. The principal researcher remains in control."}
      </p>
    </section>
  );
}
