# OpenAI Build Week submission checklist

## Product

- [ ] Keep `GENESIS_AI_MODE=mock` for the billing-free demo, or add a funded `OPENAI_API_KEY` and switch to `auto`/`live`.
- [ ] Verify the default result says **Demo blueprint**; if live mode is enabled, also verify **Generated with gpt-5.6-sol**.
- [ ] Complete `npm run typecheck`, `npm run lint`, `npm test`, `npm run build` and `npm run test:e2e`.
- [ ] Test the deployed URL on desktop and mobile.
- [ ] Confirm Markdown copy and download work in the deployed browser.

## Repository

- [ ] Choose a license before making the repository public, or use the private-repository judge-sharing route.
- [ ] Remove no `.agents/skills` license or attribution files required by their sources.
- [ ] Confirm `.env.local`, API keys and secrets are not tracked.
- [ ] Push the verified source and include this README.
- [ ] If private, grant the judge accounts required by the official rules.

## Demo

- [ ] Record a public YouTube video under three minutes.
- [ ] Include audio explaining the product and how GPT-5.6 and Codex were used.
- [ ] Keep the browser zoom and text readable.
- [ ] Show the live source label, specialist state, premortem, ordered plan, Codex task and export.
- [ ] Use the script in `docs/DEMO-SCRIPT.md`.

## Devpost

- [ ] Track: Developer Tools.
- [ ] Add the working project URL.
- [ ] Add the source repository URL and access details.
- [ ] Add the public YouTube demo URL.
- [ ] Add setup and testing instructions.
- [ ] Add the Codex `/feedback` session ID from the primary build task.
- [ ] Explain the technical implementation, UX, credible impact and originality.
- [ ] Submit before Tuesday, July 21, 2026 at 5:00 PM Pacific Time.

## Suggested one-line pitch

GENESIS turns a vague product idea into a purpose-led, premortemed, dependency-ordered blueprint and a downloadable pack of Codex-ready tasks.

## Suggested short description

AI coding tools make production faster, but they can also make it easier to build the wrong product in the wrong order. GENESIS applies purpose clarification, distributed specialist analysis, a product premortem and dependency mapping before generating schema-validated implementation tasks for Codex. It helps builders think before they build, order before they scale and review before they invest further.
