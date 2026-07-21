import { Button } from "@/components/ui/button";
import {
  FIELD_SHIELD_CLARIFICATION,
  FIELD_SHIELD_INITIAL_IDEA,
} from "@/lib/demo/fieldshield";

type DemoClarificationProps = {
  onBack: () => void;
  onContinue: () => void;
};

export function DemoClarification({ onBack, onContinue }: DemoClarificationProps) {
  return (
    <main className="clarification-shell" id="main-content">
      <section className="clarification-copy" aria-labelledby="clarification-title">
        <p className="eyebrow">Purpose before production / Demo scenario</p>
        <h1 id="clarification-title">GENESIS found the product beneath the request.</h1>
        <blockquote>{FIELD_SHIELD_INITIAL_IDEA}</blockquote>
        <p className="clarification-insight">{FIELD_SHIELD_CLARIFICATION.insight}</p>
        <p>
          Before proposing features, GENESIS separates the field operation from the questionnaire
          tool and makes the continuity risk explicit.
        </p>
        <div className="form-actions">
          <Button onClick={onContinue}>Shape the FieldShield blueprint</Button>
          <Button onClick={onBack} variant="quiet">Back to idea</Button>
        </div>
      </section>

      <aside className="clarification-register" aria-label="Clarified FieldShield context">
        <div className="document-kicker"><span>Clarification brief</span><span>01</span></div>
        <h2>The operating reality</h2>
        <dl>
          {FIELD_SHIELD_CLARIFICATION.facts.map((fact) => (
            <div key={fact.label}>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
        <p className="demo-provenance">
          Competition fixture / deterministic, fictional and available without an API connection.
        </p>
      </aside>
    </main>
  );
}
