# SmartBudget 2.0 project status

Reconciled October 27, 2026 against `fada3e7c4daed98a59dcf78cf83ec1c4b8efb214`. Local main HEAD equals this historical audit reference; there are no subsequent local commits. `git ls-remote origin refs/heads/main` also confirmed that SHA during this task. GitHub metadata reported repository visibility as public; owner review of proprietary-code exposure remains outstanding.

The source checkout at `C:/Users/rache/Code/smartbudget` has modified root specifications and untracked Expo implementation/toolchain files. They are preserved untouched. This change uses an isolated feature-branch worktree from the committed web baseline; it does not incorporate or overwrite those local edits. Review/reconcile that separate work before combining branches. This is deliberate isolation of conflicting documentation edits, not a claim that the source checkout was clean.

## Implemented

`web/`: Vite/React/TypeScript/React Router sample foundation, existing CSS tokens and light/dark themes, responsive navigation and profile controls, synthetic workspace isolation, exact-money/date primitives, sample plan/entry/goal/report views, 15-entry Academy catalog and sample lesson, public-shell manifest/service worker, domain and Chromium tests. Sample lesson progress is in memory. Disabled actions disclose unavailable persistence. Fixture isolation does not establish production authorization.

## Planned requirements

Allocator, recurrence, backend, email/password auth with verification/reset and persistent secure sessions, PostgreSQL migrations, server-enforced role boundaries, idempotent atomic writes, persistent budgeting, household invitations/revocation, 15 reviewed lessons/private progress, export/deletion and operational policies. See the canonical PRD and root roadmap. The beta is completely free; billing and premium entitlements are excluded.

## Outstanding decisions

Backend execution/runtime and secure session architecture; production providers/region (Vercel + Supabase proposed); identity/email delivery; retention/deletion/backup durations; monitoring/recovery/support ownership; content reviewers; browser/performance release profiles; owner review of repository visibility and proprietary-code access. Geography/USD, household limit/roles, free beta and proprietary licensing are approved, not open choices.

Historical audit, foundation plan/verification and migration documents retain dated evidence. Their stage numbering and provider/runtime/session proposals do not override the current roadmap or approved PRD. Remote CI success and release readiness require separate evidence.
