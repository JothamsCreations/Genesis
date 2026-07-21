# GENESIS

GENESIS is an AI product architect that turns a vague product idea into a clear, risk-aware, dependency-ordered implementation blueprint and a downloadable pack of Codex-ready tasks.

> Think before you build. Order before you scale.

## What it does

A builder describes an idea once. GENESIS then:

1. clarifies the purpose, primary user, problem and intended transformation;
2. separates first-version essentials from distractions and explicit non-goals;
3. synthesizes vision, user, risk and architecture specialist perspectives;
4. runs a product premortem with warning signs and early validation tests;
5. orders the foundations and build phases by dependency;
6. creates Codex-ready tasks with expected files, acceptance criteria and tests;
7. performs a final purpose-alignment and launch-blocker review.

The result can be copied or downloaded as a complete Markdown build pack.

## Build Week implementation

- Next.js App Router, React, TypeScript and Tailwind CSS
- OpenAI Responses API with `gpt-5.6-sol`
- Zod Structured Outputs for the complete product-blueprint contract
- Semantic validation for unique IDs, specialist coverage and forward-only dependencies
- Escaped untrusted-input boundaries to prevent product ideas from changing system instructions
- Server-only API credentials; the browser never receives the OpenAI API key
- Deterministic local fallback when a key is absent, the request fails, or output validation fails
- Explicit demo mode that never makes an OpenAI request, even if a key is present
- Editorial, responsive interface with keyboard, focus and reduced-motion support
- Unit, route, component and Playwright end-to-end tests

There is deliberately no authentication, payment system, database, collaboration layer, GitHub synchronization, deployment automation or visual website builder in this competition version.

## Run locally

Requirements: Node.js 20.19+, 22.13+, or 24+ and npm. Windows, macOS and Linux are supported anywhere Next.js and Node.js run.

```bash
npm install
copy .env.example .env.local
npm run dev
```

On macOS or Linux, replace the `copy` command with:

```bash
cp .env.example .env.local
```

The copied environment file starts in deterministic demo mode:

```text
GENESIS_AI_MODE=mock
OPENAI_API_KEY=
OPENAI_MODEL=gpt-5.6-sol
```

`OPENAI_API_KEY` is optional in mock mode. To enable live generation later, add a funded project key and set `GENESIS_AI_MODE=auto` or `GENESIS_AI_MODE=live`. Missing keys, exhausted quota, request failures and invalid model output all fall back safely to the deterministic blueprint.

Open [http://localhost:3000](http://localhost:3000). Never commit `.env.local`; it is ignored by Git.

### Judge test path

1. Select **Run FieldShield Demo**.
2. Review how GENESIS turns the vague PhD-fieldwork request into a precise coordination and continuity problem.
3. Select **Shape the FieldShield blueprint**.
4. Review the four domain specialists, six-risk premortem and eight-step creation order.
5. Open any of the seven build-pack documents; copy or download actions are functional.
6. In the embedded FieldShield prototype, select **Akinyele** to inspect its field operation.
7. Select **Activate Handover Mode** and confirm delegated supervision becomes active.

FieldShield is demonstration evidence inside GENESIS, not a separate submission. All field metrics and research-assistant codes are fictional fixtures.

In the default mock mode, the same path returns a transparent deterministic demo blueprint so the complete product remains testable without billing or network access. The result identifies whether it came from GPT-5.6, deliberate demo mode or a live-analysis fallback.

## Verification

```bash
npm run typecheck
npm run lint
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

## Architecture

```text
Browser
  -> GenesisFlow (idea, progress, result, export)
  -> POST /api/blueprint
     -> validate IdeaInput
     -> generation service
        -> OpenAI Responses API + Zod Structured Output
        -> validate ProductBlueprint
        -> deterministic fallback on any failure
  -> editorial blueprint document
```

- `app/api/blueprint/route.ts` is the small server boundary.
- `lib/blueprint/schema.ts` is the runtime contract for input and output.
- `lib/blueprint/openai-requester.ts` contains the isolated GPT-5.6 request.
- `lib/blueprint/generation-service.ts` owns validation, provenance and fallback behavior.
- `lib/blueprint/mock-generator.ts` creates stable judgeable sample output.
- `lib/blueprint/build-pack.ts` produces the complete Codex-ready Markdown artifact.
- `components/genesis/` owns the accessible product journey and document view.

No generated model output reaches the interface unless it passes both the ProductBlueprint schema and dependency-integrity validation.

## How Codex accelerated the build

Codex was used as the primary implementation environment to:

- inspect and preserve the repository-scoped skill architecture;
- turn the product philosophy into a typed blueprint contract;
- implement the Next.js product from vertical-slice tests;
- integrate the official OpenAI SDK and Responses API;
- catch scope drift, encoding issues and fallback ambiguities;
- run type, lint, unit, route, component, build and browser verification;
- prepare the judge test path and submission materials.

Human product decisions remained explicit: narrow scope, purpose before features, a premortem before investment, transparent provenance, no invented market evidence, no hidden failure state and no unnecessary infrastructure.

## Repository-scoped skills

The project includes reusable Codex skills under `.agents/skills/` for design quality, frontend patterns, test-driven work and verification. They guide implementation; they are not bundled into the production application.

## Product philosophy

- Purpose before production
- Essentials separated from distractions
- Foundations before visible features
- Continuous evaluation
- Premortem before major investment
- Central vision with distributed specialist intelligence
- Completion and review

## Submission checklist

See [docs/DEVPOST-SUBMISSION.md](docs/DEVPOST-SUBMISSION.md), [docs/SUBMISSION-CHECKLIST.md](docs/SUBMISSION-CHECKLIST.md) and [docs/FIELDSHIELD-DEMO-SCRIPT.md](docs/FIELDSHIELD-DEMO-SCRIPT.md).

Before a public submission, the repository owner must choose and add the appropriate license. Alternatively, keep the repository private and share judge access as required by the Build Week rules.
