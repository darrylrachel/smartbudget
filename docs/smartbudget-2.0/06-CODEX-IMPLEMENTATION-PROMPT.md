# First actionable Codex implementation prompt

Implement only the SmartBudget 2.0 web foundation described below. Read applicable AGENTS.md, this 2.0 package and existing README/PRD/algorithm/architecture/schema/design/Academy/roadmap before editing. The user's web-first responsive SaaS/PWA direction supersedes the old native-first starter architecture for this task. Preserve paycheck-first hybrid budgeting, separate personal/household ledgers, education and light design.

## Inspect and plan, then proceed

1. Inspect git status, current branch/HEAD, remote configuration, relevant source and instructions. The audited GitHub main was documentation-only at 63e8f4a45c19a3e0c67e012a484f85f09878eefe; a local checkout also had uncommitted Expo source. Verify again rather than assuming it is unchanged. Preserve unrelated edits and every untracked source file. Do not reset/clean or overwrite the Expo prototype.
2. Write docs/WEB_FOUNDATION_PLAN.md with current state, file map, reuse decisions, compatible exact toolchain versions, commands, acceptance checks and exclusions. Record a web-first ADR. Share the short plan, then continue reversible work without an extra approval pause.
3. In a documentation-only checkout create web/. In a checkout with the local Expo prototype also create web/ as an isolated package. If a sound web implementation already exists, adapt it instead and explain the deviation. Use React/TypeScript, Vite, semantic HTML/CSS and one browser router. Record dependencies and a lockfile; do not introduce a second web framework. Follow the environment's normal dependency/network approval process.

## Build the foundation

- Build Home, Plan, Activity, Goals and Learn, plus direct-link review, sample entry, goal detail, lesson, settings and household screens. Desktop gets side navigation and useful columns; mobile gets one column and labeled bottom navigation. Use the layouts/tokens in the 2.0 UI specification. Maintain visible workspace context and keyboard focus.
- Use synthetic fixtures only. Persistent banner: “Sample data • Changes are not saved.” Plan preview says it is hand-authored sample output, not an implemented allocation engine. Save expense, accept allocations, invite and export/deletion actions remain explicitly unavailable; do not display fake success.
- Reuse/adapt inspected pure cents parsing/formatting, sum/date/period helpers with source provenance. Replace demo-specific ID assumptions in reusable contracts while keeping fixture identifiers stable in mock adapters. All amounts are checked integer cents. Do not implement the full allocator or a financial write ledger yet.
- Define workspace-scoped repository interfaces and synchronous/async mock adapters appropriate to the UI. Never mix personal data into household responses. A workspace switch handles draft discard, clears forms/details and ignores late responses for the old context. Mock role labels explicitly say they are illustrative.
- Include all 15 unpublished Academy metadata entries and one labeled sample reader with optional check. Completion can be in-memory only and must disclose reset on reload. No financial side effects; unfinished lesson content stays unavailable.
- Add public-shell PWA support: manifest with stable ID/scope/start URL, standalone display, light colors, actual 192/512 PNG and maskable icons, controlled service-worker registration, offline explanation and update-available UX. Use an explicit allowlist of public shell assets; never cache API/auth/export responses or financial payloads. No financial storage in localStorage/IndexedDB/Cache Storage. Offline financial mutations are unavailable.
- Provide capability-aware install help. A manifest alone does not count as a verified installation; document actual browser results and any unavailable platform tests. Do not provision hosting or deploy to obtain them.
- Align canonical README, architecture/design/roadmap and old first-prompt references so a future agent does not follow contradictory native-first directions. Preserve original financial invariants and mark native prototype status accurately. Do not overwrite unrelated local specification edits; merge intentionally and report conflicts.

## Verification and done criteria

Provide scripts for dev, typecheck, lint, test, browser tests, build and local preview. Run clean-install verification if the environment permits and record the exact runtime/commands/results. Fix failures within foundation scope; do not claim missing tools or browser tests passed.

Meaningful domain tests: exact cents parsing/formatting, invalid/oversized amounts, checked sums, real calendar validation, exclusive period boundary and scoped fixture reads. Browser checks: five destinations and direct-link reload, desktop/mobile navigation, keyboard journey, workspace switch resets stale forms/details, unavailable writes cannot imply persistence, sample lesson progress disclosure. PWA checks: valid manifest/icons, service worker public allowlist, offline explanation, update behavior; inspect caches to ensure no financial/auth payloads. Use at least 390px and 1440px layouts and test 320px reflow/200% zoom. Automated accessibility plus manual focus checks; report screen-reader/installation tests separately when actually performed.

No authentication/backend SDK, database migrations, live credentials, real financial records, complete allocation engine, bank sync, payments, production telemetry, external invitation/email, subscription billing, native app build, hosted resource creation, deployment or publishing in this task.

Finish with changed files, commands and actual outcomes, visual/browser evidence, unresolved limitations and recommended next increment. Write docs/WEB_FOUNDATION_VERIFICATION.md. Stop after foundation. Do not begin engine/backend work merely because the roadmap lists it. Do not push, create a PR or deploy unless separately requested.
