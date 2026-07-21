import type { FormEvent, RefObject } from "react";

import { Button } from "@/components/ui/button";

type IdeaIntakeProps = {
  idea: string;
  error: string | null;
  isGenerating: boolean;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  onIdeaChange: (idea: string) => void;
  onRunDemo: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onUseSample: () => void;
};

export function IdeaIntake({
  idea,
  error,
  isGenerating,
  textareaRef,
  onIdeaChange,
  onRunDemo,
  onSubmit,
  onUseSample,
}: IdeaIntakeProps) {
  return (
    <main className="intake-shell" id="main-content">
      <section className="intake-copy" aria-labelledby="intake-title">
        <p className="eyebrow">Product architecture, before production</p>
        <h1 id="intake-title">Turn an idea into a buildable product.</h1>
        <p className="intake-lede">
          GENESIS separates the essential from the distracting, tests the ways your idea could fail,
          and orders the foundations before visible features.
        </p>

        <form className="idea-form" onSubmit={onSubmit} noValidate>
          <div className="field-heading">
            <label htmlFor="product-idea">Describe what you want to create</label>
            <span>{idea.length}/1200</span>
          </div>
          <textarea
            aria-describedby={error ? "idea-error idea-guidance idea-privacy" : "idea-guidance idea-privacy"}
            aria-invalid={Boolean(error)}
            id="product-idea"
            maxLength={1200}
            onChange={(event) => onIdeaChange(event.target.value)}
            placeholder="For example: Help secondary-school teachers identify struggling students early enough to intervene."
            ref={textareaRef}
            rows={7}
            value={idea}
          />
          <p className="field-guidance" id="idea-guidance">
            Include the person, their problem and the change you hope to create. Rough language is welcome.
          </p>
          <p className="privacy-note" id="idea-privacy">
            Demo mode stays local. When live analysis is enabled, your idea is sent to OpenAI. This prototype keeps no project database.
          </p>
          {error ? <p className="field-error" id="idea-error" role="alert">{error}</p> : null}

          <div className="form-actions">
            <Button disabled={isGenerating} type="submit">
              {isGenerating ? "Shaping the blueprint…" : "Shape the blueprint"}
            </Button>
            <Button disabled={isGenerating} onClick={onRunDemo} type="button" variant="secondary">
              Run FieldShield Demo
            </Button>
            <Button disabled={isGenerating} onClick={onUseSample} type="button" variant="quiet">
              Use sample idea
            </Button>
          </div>
        </form>
      </section>

      <aside className="preview-sheet" aria-label="What GENESIS will resolve">
        <div className="document-kicker">
          <span>GENESIS / Working paper</span>
          <span>01</span>
        </div>
        <h2>What GENESIS will resolve</h2>
        <p>A coherent blueprint, made for decisions and implementation rather than presentation alone.</p>
        <div className="preview-register">
          <div><span>01</span><strong>Purpose</strong><p>Who this serves, what changes and how success becomes visible.</p></div>
          <div><span>02</span><strong>Boundaries</strong><p>The first essentials, later possibilities and explicit non-goals.</p></div>
          <div><span>03</span><strong>Premortem</strong><p>Likely causes of failure, warning signs and preventive tests.</p></div>
          <div><span>04</span><strong>Creation order</strong><p>Foundations, dependencies and Codex-ready completion criteria.</p></div>
        </div>
        <blockquote>“What must already exist for this feature to work well?”</blockquote>
      </aside>
    </main>
  );
}
