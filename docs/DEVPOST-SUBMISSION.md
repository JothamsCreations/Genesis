# GENESIS — Devpost submission draft

Replace bracketed placeholders before submission.

## Project name

GENESIS

## One-line pitch

GENESIS turns a vague product idea into a purpose-led, premortemed, dependency-ordered blueprint and a downloadable pack of Codex-ready tasks.

## Track

Developer Tools

## Project URL

[DEPLOYED_URL]

## Repository

[REPOSITORY_URL]

## Demo video

[PUBLIC_YOUTUBE_URL]

## Codex session

[PRIMARY_CODEX_FEEDBACK_SESSION_ID]

## Inspiration

AI coding tools make production dramatically faster. That speed is valuable, but it also makes it easier to build the wrong product, add distracting features, or implement visible surfaces before the foundations they depend on.

GENESIS began with a different question: what if AI helped a builder think clearly before helping them produce quickly?

Its seven-stage method is grounded in a simple creation philosophy: purpose before production, separation before expansion, foundations before visible features, continuous evaluation, a premortem before major investment, central vision with distributed specialist intelligence, and completion followed by review.

## What it does

A builder enters a rough product idea. GENESIS then:

1. identifies the primary user, their problem and the observable transformation;
2. separates first-version essentials from later possibilities and explicit non-goals;
3. analyzes the idea through vision, user, risk and systems-architecture perspectives;
4. runs a premortem with failure causes, warning signs, prevention and early tests;
5. orders foundations and phases by dependency;
6. generates Codex-ready tasks with expected files, acceptance criteria, tests, prohibited scope and definitions of done;
7. reviews the result against the original purpose and exposes unresolved questions and launch blockers.

The complete blueprint can be copied or downloaded as Markdown and handed directly to Codex.

## How we built it

GENESIS is a Next.js App Router application written in TypeScript with React and Tailwind CSS.

The server uses the official OpenAI JavaScript SDK and the Responses API with GPT-5.6 Sol. The model returns a strict ProductBlueprint Structured Output defined with Zod. The application then performs a second semantic pass that verifies:

- required specialist coverage;
- unique identifiers;
- valid foundation, phase and task references;
- forward-only dependency order;
- task-to-phase integrity.

If the API key is absent, the request fails, the schema is invalid, or dependency integrity fails, GENESIS returns a transparent deterministic local blueprint. This keeps the complete judge journey available without hiding which mode produced the result.

The interface uses a restrained working-paper visual language rather than a generic AI dashboard. The seven stages remain visible as an orientation rail, while the result reads as a structured editorial document.

## How we used GPT-5.6

GPT-5.6 Sol acts as the central product architect. It receives the product idea as escaped, explicitly untrusted JSON data and synthesizes four bounded specialist perspectives into one blueprint.

The prompt instructs the model to avoid invented market evidence, mark unsupported claims as assumptions, preserve explicit non-goals, and reference only valid earlier dependency IDs. Structured Outputs guarantee the required shape; application-level semantic validation guarantees that the plan is logically traversable.

## How we used Codex

Codex was the primary build environment. It helped:

- inspect and preserve the repository-scoped skill structure;
- convert the product philosophy into typed runtime contracts;
- implement the application through test-driven vertical slices;
- integrate GPT-5.6 and the Responses API using current official guidance;
- identify a Structured Outputs keyword incompatibility before live deployment;
- add semantic dependency validation and prompt-data isolation;
- refine responsive behavior, accessibility and visual hierarchy;
- run type, lint, unit, route, component, coverage, production-build and browser verification;
- prepare the README, judge path, demo script and submission materials.

The important product decisions remained human-led: constrain the MVP, make provenance explicit, refuse invented evidence, preserve completion criteria and avoid unnecessary infrastructure.

## Challenges

### A blueprint can be structurally valid and still be impossible

A JSON schema can prove that a dependency is a string, but not that the referenced item exists or appears earlier. We added a semantic validation layer that rejects circular, forward, unknown and duplicate references before a result reaches the interface.

### Structured Outputs supports a deliberate JSON Schema subset

The first runtime schema used string-length keywords that were suitable for local Zod validation but not appropriate for the strict model-facing schema. We separated route input limits from model-output constraints and added a regression test that checks the exact generated schema for unsupported keywords.

### Reliability without hiding failure

The Build Week demo must remain judgeable even when credentials or a network are unavailable. The deterministic fallback follows the same ProductBlueprint contract and clearly labels itself as local. Network, server and validation failures also receive distinct provenance messages.

### Showing multi-perspective intelligence without building agent theater

We avoided decorative agent avatars and fake chat transcripts. The progress state names the bounded work being performed, while the final artifact exposes each specialist's actual finding, recommendation and confidence.

## Accomplishments

- A complete idea-to-Codex-build-pack journey with no authentication or database.
- Strict structural and semantic validation of model output.
- Prompt-injection-resistant serialization of product ideas as untrusted data.
- A useful deterministic fallback rather than a dead demo state.
- A responsive editorial interface with keyboard focus, reduced motion, active-step semantics and accessible contrast.
- Automated unit, route, component and desktop/mobile browser coverage of the critical journey.

## What we learned

The hardest part of AI product planning is not producing more text. It is preserving the relationship between purpose, evidence, scope, risk and implementation order.

We also learned that reliable Structured Outputs need two contracts: a shape contract for the model and a meaning contract in application code. Both matter when the output is intended to drive real engineering work.

Finally, a visible fallback is more trustworthy than a seamless-looking failure. Builders should always know whether they are reviewing live model analysis or deterministic sample reasoning.

## What's next

After Build Week, the strongest next steps are:

1. an interactive clarification exchange before synthesis;
2. saved local projects, without introducing accounts prematurely;
3. evaluation datasets that compare blueprints against expert product reviews;
4. optional Codex task execution only after the blueprint is approved;
5. domain-specific specialist packs for education, research and developer tools.

Authentication, billing, team collaboration, GitHub synchronization and deployment automation remain intentionally outside the competition MVP.

## Technologies

- Next.js
- React
- TypeScript
- Tailwind CSS
- OpenAI Responses API
- GPT-5.6 Sol
- OpenAI JavaScript SDK
- Zod
- Vitest
- Testing Library
- Playwright

## Judge test instructions

1. Open [DEPLOYED_URL].
2. Select **Use sample idea**.
3. Select **Shape the blueprint**.
4. Observe the specialist synthesis state.
5. Review the premortem, foundations, ordered phases and all Codex-ready tasks.
6. Select **Download Markdown**.
7. Confirm the source label identifies GPT-5.6 or local fallback.

The repository README contains local setup and complete verification commands.
