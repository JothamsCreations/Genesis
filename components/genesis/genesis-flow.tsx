"use client";

import Link from "next/link";
import { useLayoutEffect, useReducer, useRef } from "react";

import { AnalysisProgress } from "@/components/genesis/analysis-progress";
import { BlueprintView } from "@/components/genesis/blueprint-view";
import { DemoClarification } from "@/components/genesis/demo-clarification";
import { IdeaIntake } from "@/components/genesis/idea-intake";
import { StageRail } from "@/components/genesis/stage-rail";
import { buildBlueprintMarkdown } from "@/lib/blueprint/build-pack";
import { requestBlueprint } from "@/lib/blueprint/request-blueprint";
import type { BlueprintGenerationMeta, BlueprintGenerationResult, IdeaInput, ProductBlueprint } from "@/lib/blueprint/types";
import { FIELD_SHIELD_CONSTRAINTS, FIELD_SHIELD_INITIAL_IDEA, isFieldShieldBlueprint } from "@/lib/demo/fieldshield";

const SAMPLE_IDEA =
  "Build a service that helps secondary-school teachers identify struggling students before examinations.";
const MINIMUM_IDEA_LENGTH = 24;

type BlueprintGenerator = (input: IdeaInput) => Promise<BlueprintGenerationResult>;

type State = {
  idea: string;
  status: "idle" | "clarifying" | "generating" | "ready" | "error";
  error: string | null;
  blueprint: ProductBlueprint | null;
  meta: BlueprintGenerationMeta | null;
  copyStatus: "idle" | "copied" | "error";
  demoMode: boolean;
};

type Action =
  | { type: "idea_changed"; idea: string }
  | { type: "demo_loaded" }
  | { type: "validation_failed" }
  | { type: "generation_started" }
  | { type: "generation_succeeded"; result: BlueprintGenerationResult }
  | { type: "generation_failed" }
  | { type: "copy_succeeded" }
  | { type: "copy_failed" }
  | { type: "reset" };

const initialState: State = {
  idea: "",
  status: "idle",
  error: null,
  blueprint: null,
  meta: null,
  copyStatus: "idle",
  demoMode: false,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "idea_changed":
      return { ...state, idea: action.idea, error: null, demoMode: false };
    case "demo_loaded":
      return { ...initialState, idea: FIELD_SHIELD_INITIAL_IDEA, status: "clarifying", demoMode: true };
    case "validation_failed":
      return { ...state, error: "Describe the idea in at least 24 characters so GENESIS has enough context." };
    case "generation_started":
      return { ...state, status: "generating", error: null, copyStatus: "idle" };
    case "generation_succeeded":
      return { ...state, status: "ready", blueprint: action.result.blueprint, meta: action.result.meta };
    case "generation_failed":
      return { ...state, status: "error", error: "The blueprint could not be shaped. Your idea is still here; please try again." };
    case "copy_succeeded":
      return { ...state, copyStatus: "copied" };
    case "copy_failed":
      return { ...state, copyStatus: "error" };
    case "reset":
      return initialState;
  }
}

export function GenesisFlow({
  generationDelay = 900,
  generator = requestBlueprint,
}: {
  generationDelay?: number;
  generator?: BlueprintGenerator;
}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const blueprintHeadingRef = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    if (state.status === "ready" || state.status === "idle") window.scrollTo(0, 0);
    if (state.status === "ready") blueprintHeadingRef.current?.focus({ preventScroll: true });
  }, [state.status]);


  async function generateBlueprint(input: IdeaInput) {
    dispatch({ type: "generation_started" });
    try {
      const [result] = await Promise.all([
        generator(input),
        generationDelay > 0
          ? new Promise((resolve) => window.setTimeout(resolve, generationDelay))
          : Promise.resolve(),
      ]);
      dispatch({ type: "generation_succeeded", result });
    } catch {
      dispatch({ type: "generation_failed" });
    }
  }
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = { idea: state.idea.trim(), constraints: [] };

    if (input.idea.length < MINIMUM_IDEA_LENGTH) {
      dispatch({ type: "validation_failed" });
      textareaRef.current?.focus();
      return;
    }

    await generateBlueprint(input);
  }

  async function handleCopy() {
    if (!state.blueprint) return;
    try {
      await navigator.clipboard.writeText(buildBlueprintMarkdown(state.blueprint));
      dispatch({ type: "copy_succeeded" });
    } catch {
      dispatch({ type: "copy_failed" });
    }
  }

  function handleDownload() {
    if (!state.blueprint) return;
    const markdown = buildBlueprintMarkdown(state.blueprint);
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const slug = state.blueprint.purpose.workingTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    link.href = url;
    link.download = `${slug || "genesis"}-build-pack.md`;
    link.click();
    URL.revokeObjectURL(url);
  }

  const activeStage = state.status === "ready"
    ? 6
    : state.status === "generating" ? 2 : state.status === "clarifying" ? 1 : 0;

  return (
    <div className="app-frame">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <header className="site-header">
        <Link className="wordmark" href="/" aria-label="GENESIS home">GENESIS</Link>
        <p>Build Week / Product architect</p>
        <span className="prototype-note">Demo-ready / OpenAI-compatible</span>
      </header>
      <StageRail activeStage={activeStage} />

      {state.status === "ready" && state.blueprint && state.meta ? (
        <BlueprintView
          blueprint={state.blueprint}
          copyStatus={state.copyStatus}
          headingRef={blueprintHeadingRef}
          fieldShieldDemo={state.demoMode || isFieldShieldBlueprint(state.blueprint)}
          meta={state.meta}
          onCopy={handleCopy}
          onDownload={handleDownload}
          onReset={() => dispatch({ type: "reset" })}
        />
      ) : state.status === "clarifying" ? (
        <DemoClarification
          onBack={() => dispatch({ type: "reset" })}
          onContinue={() => void generateBlueprint({ idea: state.idea, constraints: [...FIELD_SHIELD_CONSTRAINTS] })}
        />
      ) : state.status === "generating" ? (
        <AnalysisProgress fieldShield={state.demoMode} />
      ) : (
        <IdeaIntake
          error={state.error}
          idea={state.idea}
          isGenerating={false}
          textareaRef={textareaRef}
          onIdeaChange={(idea) => dispatch({ type: "idea_changed", idea })}
          onRunDemo={() => dispatch({ type: "demo_loaded" })}
          onSubmit={handleSubmit}
          onUseSample={() => dispatch({ type: "idea_changed", idea: SAMPLE_IDEA })}
        />
      )}

      <footer className="site-footer">
        <p>Think before you build. Order before you scale.</p>
        <p>GENESIS / Build Week 2026</p>
      </footer>
    </div>
  );
}
