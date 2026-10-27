# Repository audit

Audit date: October 27, 2026. Repository: https://github.com/darrylrachel/smartbudget.

## Executive finding

**Verified:** GitHub is a documentation starter, not a working budgeting application. The default branch is `main` at `63e8f4a45c19a3e0c67e012a484f85f09878eefe` (initial commit, October 21). Its recursive tree contains 14 files: 12 Markdown documents plus `.env.example` and `.gitignore`. No application source, package manifest, lockfile, tests, database migrations or workflow directory is present in that tree. The remote README explicitly says no application has been implemented.

**Verified separately:** `C:\Users\rache\Code\smartbudget` has the same HEAD but contains modified specifications and untracked application files. This is a local Expo prototype, not code published on GitHub. Its presence is valuable salvage evidence; it cannot be counted as remote implementation or a released MVP. Existing `dist` and `node_modules` directories do not establish deployment or reproducibility.

## Evidence register

| ID | Source inspected | What it establishes |
| --- | --- | --- |
| E1 | [Repository metadata](https://api.github.com/repos/darrylrachel/smartbudget) | Public repository, default main, no declared license, no homepage; GitHub Pages disabled at inspection |
| E2 | [Branches](https://api.github.com/repos/darrylrachel/smartbudget/branches) | Returned main at the audited SHA; branch metadata reports protected=false; full ruleset policy was not audited |
| E3 | [Pinned recursive tree](https://api.github.com/repos/darrylrachel/smartbudget/git/trees/63e8f4a45c19a3e0c67e012a484f85f09878eefe?recursive=1) | Complete 14-file tree, truncated=false; no implemented application |
| E4 | [Pinned README](https://github.com/darrylrachel/smartbudget/blob/63e8f4a45c19a3e0c67e012a484f85f09878eefe/README.md) | Documentation-only status; iOS/Android direction; starter defaults explicitly distinguished from historical agreements |
| E5 | [Algorithm specification](https://github.com/darrylrachel/smartbudget/blob/63e8f4a45c19a3e0c67e012a484f85f09878eefe/ALGORITHM_SPEC.md) | Deterministic waterfall, conservation, caps, date boundaries and acceptance requirements are specified |
| E6 | [Architecture](https://github.com/darrylrachel/smartbudget/blob/63e8f4a45c19a3e0c67e012a484f85f09878eefe/ARCHITECTURE.md), [schema](https://github.com/darrylrachel/smartbudget/blob/63e8f4a45c19a3e0c67e012a484f85f09878eefe/DATABASE_SCHEMA.md) | Expo/native baseline, proposed Supabase/Postgres, logical tables and role rules; no deployed implementation proven |
| E7 | Local git status, package.json, app.json, app/, src/, tests/ | Uncommitted Expo Router prototype, static web output configured, React Native UI, sample workspaces |
| E8 | Local src/domain/money.ts and contracts.ts | Exact decimal parsing using BigInt, checked cents, dates/periods and allocation input contracts; workspace IDs restricted to two demo literals |
| E9 | Local mockRepository.ts, AppContext.tsx, BudgetScreens.tsx, components/ui.tsx | Fixture reads, in-memory lesson progress, sample recommendation rows, unavailable save/accept actions, workspace reset behavior, max content width 720 |
| E10 | Local Academy catalog and tests | 15 lesson metadata entries: 14 unpublished and one sample; money/date/fixture boundary tests and route smoke tests exist; these are not backend security or real browser tests |

The API establishes current remote state; local source establishes prototype behavior only. The original starter files under this document workspace were also reviewed for algorithm/design context. Prior chat retrieval yielded only the initial request, so no historical feature promises are inferred.

## Capability and gap assessment

| Capability | GitHub | Local prototype | Required 2.0 work |
| --- | --- | --- | --- |
| Web-first desktop/mobile | Native-first documentation | Expo screens, narrow shared layout | Semantic web shell, desktop navigation, mobile layouts, direct-link/keyboard checks |
| Installable PWA | Not implemented | Static web export setting only | Manifest, icons, service worker, install/update/offline behavior and browser verification |
| Money primitives | Specified | Checked helpers and validation | Reuse after tests; remove demo ID coupling; shared server validation |
| Paycheck hybrid engine | Detailed specification | Hand-authored preview, no allocator | Deterministic engine, invariant/property tests, period/recurrence adapter |
| Accounts/activity/goals | Specified | Read-only fixtures and sample form validation | Posted ledger, expenses/refunds/transfers, goal reservations, reconciliation |
| Persistence/auth | Proposed only | Mock repository, no real write path inspected | Authenticated repositories, migrations, authorization, atomic mutations |
| Household | Separate-ledger requirements | Two selectable fixtures; illustrative roles | Membership/invitation lifecycle, role enforcement, revocation, negative-access tests |
| Education | 15-lesson curriculum | Unpublished catalog/sample experience | Reviewed manuscripts, private versioned progress and resume |
| SaaS operation | Not implemented | No operational evidence | Hosting, recovery, privacy, deletion/export, support and monitoring |
| Quality | No executable tests in remote tree | Domain and navigation tests | Reproducible CI, web E2E, accessibility, PWA and database concurrency coverage |

## Priority findings

1. **P0 before real data:** household security, persistence and allocation acceptance are requirements, not verified implementations. A fixture selector is not authorization.
2. **P0 before implementation:** platform direction conflicts. Existing ARCHITECTURE/README/CODEX_PROMPT_01 and related routes assume native-first Expo. Update them together when adopting 2.0; leaving both prompts active risks rebuilding the wrong product.
3. **P1:** the financial engine has not been built. The local preview explicitly discloses hand-authored recommendations and disables acceptance; preserve that honesty until real logic exists.
4. **P1:** PWA installation is not established by a web bundle. There is no manifest/service-worker source in the inspected app source inventory.
5. **P1:** local progress can be lost or accidentally overwritten if an implementation assumes GitHub and the checkout are identical. Preserve and inventory all untracked source before migration.
6. **P2:** the logical model is a strong starting point but must become executable constraints, policies and transaction functions. Published education also needs source/editorial review.

## Limits and unknowns

No production site, real database, live authorization, browser installation, mobile device, recovery procedure or financial behavior was exercised. No vulnerability scan or dependency security certification was performed. Repository metadata is not evidence about hosting outside GitHub. Local test results are recorded separately in VERIFICATION.md. Passing local tests cannot establish SaaS readiness.

**Assumptions for planning:** USD-only launch, manual entry, one personal workspace and at most one active household, owner/editor/viewer roles, no bank sync, 15 free lessons. These come from starter defaults, not newly confirmed user decisions. Monetization, hosting region, retention, identity providers and licensing remain open.
