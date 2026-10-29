# SmartBudget 2.0 project status

Historical reconciliation baseline: `fada3e7c4daed98a59dcf78cf83ec1c4b8efb214`. For Phase 1 review on October 27, 2026, origin/main was fetched at `eced00b36beb664c15fa30a61db80206915025b7`, which includes merged Phase 0 [PR #1](https://github.com/darrylrachel/smartbudget/pull/1). Its [Web CI run](https://github.com/darrylrachel/smartbudget/actions/runs/40568044540) passed all checks including Playwright. The Phase 1 feature branch starts at that merged baseline; no Phase 0 changes are added to its diff. Repository visibility remains public; owner review of proprietary-code access is outstanding.

The source checkout at `C:/Users/rache/Code/smartbudget` has modified root specifications and untracked Expo implementation/toolchain files. They are preserved untouched. This change uses an isolated feature-branch worktree from the committed web baseline; it does not incorporate or overwrite those local edits. Review/reconcile that separate work before combining branches. This is deliberate isolation of conflicting documentation edits, not a claim that the source checkout was clean.

## Implemented

`web/`: Vite/React/TypeScript/React Router sample foundation, existing CSS tokens and light/dark themes, responsive navigation and profile controls, synthetic workspace isolation, exact-money/date primitives, sample plan/entry/goal/report views, 15-entry Academy catalog and sample lesson, public-shell manifest/service worker, domain and Chromium tests. Sample lesson progress is in memory. Disabled actions disclose unavailable persistence. Fixture isolation does not establish production authorization.

Phase 1 domain increment: pure deterministic allocator, shared preview/edit validation, SHA-256 canonical snapshot identity, locks/caps, exact weighted rounding and calendar paycheck recurrence. See [verification](PHASE_1_VERIFICATION.md). The displayed sample previews remain hand-authored; engine integration into budgeting screens is deferred to Phase 3.

## Planned requirements

Backend, email/password auth with verification/reset and persistent secure sessions, PostgreSQL migrations, server-enforced role boundaries, idempotent atomic writes, persistent budgeting, household invitations/revocation, 15 reviewed lessons/private progress, export/deletion and operational policies. See the canonical PRD and root roadmap. The beta is completely free; billing and premium entitlements are excluded.

## Outstanding decisions

Backend execution/runtime and secure session architecture; production providers/region (Vercel + Supabase proposed); identity/email delivery; retention/deletion/backup durations; monitoring/recovery/support ownership; content reviewers; browser/performance release profiles; owner review of repository visibility and proprietary-code access. Geography/USD, household limit/roles, free beta and proprietary licensing are approved, not open choices.

Historical audit, foundation plan/verification and migration documents retain dated evidence. Their stage numbering and provider/runtime/session proposals do not override the current roadmap or approved PRD. Remote CI success and release readiness require separate evidence.

## Phase 2 PR 1 foundation (2026-10-29)

Fastify/TypeScript local backend, GET /health, strict configuration, safe errors and local Supabase config are implemented. Authentication, household operations and persistence remain deferred. The allocation engine stays in web/src/domain and executes directly in backend tests. Sparse semimonthly input validation is corrected. See [ADR](ADR_PHASE_2_BACKEND.md), [local development](LOCAL_BACKEND.md) and [verification](PHASE_2_PR_1_VERIFICATION.md) for current evidence. Docker daemon was unavailable; no local database readiness is claimed. The earlier uncommitted scaffold was backed up before revision.
