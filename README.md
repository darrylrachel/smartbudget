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
