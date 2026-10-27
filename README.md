## SmartBudget 2.0 web development

From `web/`, run `npm ci`, then `npm run dev`. The web app is independent of the preserved root Expo package and needs no environment variables or backend.

Checks: `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`; install the test browser once with `npx playwright install chromium`, then run `npm run test:browser`. `npm run preview` serves the production build on http://127.0.0.1:4173. PWA service workers are registered only in production builds; development mode does not install one. Stop local servers when finished. For hosting later, HTTPS and SPA deep-link fallback are required; publishing is not part of this foundation.

All data is synthetic, all financial writes/invites/export/deletion remain unavailable, and lesson completion resets on reload. The preserved Expo instructions below apply only to the older prototype.
> **SmartBudget 2.0 direction (October 27, 2026):** The canonical product is now a web-first responsive SaaS/PWA. Use [the 2.0 specifications](docs/smartbudget-2.0/README.md), [web architecture decision](docs/ADR_WEB_FIRST.md), and [web foundation plan](docs/WEB_FOUNDATION_PLAN.md). Native-first instructions below describe the preserved Expo prototype and do not authorize rebuilding it. The web package lives in `web/`. The first 2.0 foundation task is implemented; see [verification](docs/WEB_FOUNDATION_VERIFICATION.md). Later engine/backend phases require a new request.

# SmartBudget

A calmer way to decide what your next paycheck needs to cover.

SmartBudget is a planned personal and household budgeting app for iOS and Android. It combines paycheck planning, transparent allocation recommendations, selective household sharing, and practical money education.

**Repository status: documentation starter; no application has been implemented.** No install, run, or test commands are claimed to work yet. This package intentionally contains no dependency versions, lockfile, backend project, credentials, or production configuration.

## Product decisions

- Paycheck-first budgeting with a calendar-month reporting view.
- Hybrid recommendations: deterministic needs-first rules plus configurable target percentages for remaining money. Users review and accept recommendations; the app never moves money.
- Private personal workspace plus a separate household workspace containing only deliberately shared records.
- Light-first interface, forest green primary color, warm neutral surfaces, supportive language.
- Five tabs: Home, Plan, Activity, Goals, Learn. Settings and household management sit outside the tab bar.
- SmartBudget Academy: 15 short MVP lessons, progress tracking, and optional practice.

## Read in this order

1. [PRD](PRD.md): outcomes, scope, acceptance criteria.
2. [Algorithm specification](ALGORITHM_SPEC.md): money semantics and invariants.
3. [Design system](UI_UX_DESIGN_SYSTEM.md): screens, components, accessibility.
4. [Academy](ACADEMY_SPEC.md): curriculum and content structure.
5. [Architecture](ARCHITECTURE.md) and [database schema](DATABASE_SCHEMA.md).
6. [Roadmap](ROADMAP.md), then [first Codex prompt](CODEX_PROMPT_01.md).
7. [Agent rules](AGENTS.md) and [contributing](CONTRIBUTING.md).

## Start with Codex

Open this repository and paste CODEX_PROMPT_01.md. Codex must inspect the repository and write a plan before implementing only Phase 1. A human can review the plan in the same run; routine foundation work does not require a separate approval gate. Stop after foundation validation and report the result. Later roadmap phases need a new request.

## Local configuration

After the foundation exists, copy `.env.example` to `.env.local` only when a real integration is needed. Public Expo variables are readable by app users. Keep privileged credentials out of all client files, fixtures, commits, screenshots, and logs. Mock mode must run without environment variables or a backend.

## Provenance and assumptions

Prepared 2026-10-21 from the linked “Build budgeting app” conversation and the package request. Available conversation text confirms hybrid allocation, paycheck budgeting, household support, light design, and education. Prior assistant bodies were reference markers, so their detailed proposals could not be recovered. This package makes the supplied decisions concrete; it does not claim to reproduce those unavailable responses verbatim.

New specification defaults: USD-only MVP; one active household per user; owner/editor/viewer roles; manual entry; no bank sync; 15 lessons; Expo + TypeScript; proposed Supabase/Postgres backend after foundation. These are coherent starter decisions, not recovered historical agreements. Future changes must update every affected contract.

## Artifact verification

`VERIFICATION.md` records archive/content checks. `SHA256SUMS.txt` hashes package payloads. The ZIP contains one SmartBudget-starter folder, including hidden configuration templates. Verify hashes after downloading if desired. A software license has deliberately not been chosen; select one before distributing application code.
