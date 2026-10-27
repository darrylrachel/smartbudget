# Phase 1 verification — October 27, 2026

## Review baseline and scope

Phase 1 began as uncommitted work in `repository-alignment` on `chore/repository-alignment-ci` at `0cb4efa35b50d7a485148597e5f66d753bc66a48`. All existing changes and untracked Phase 1 files were retained. GitHub main was fetched at `eced00b36beb664c15fa30a61db80206915025b7`; its tree matches the Phase 0 branch. Created `feat/phase-1-financial-engine` from that current main, carrying the Phase 1 work without reset, stash, deletion or rewriting existing commits.

The separate `C:/Users/rache/Code/smartbudget` checkout still has modified specifications and untracked Expo implementation/toolchain files. Inspected its status read-only and left all of that work untouched. It is excluded from this PR.

## Phase 0 confirmation (separate from this PR)

Repository documentation reconciliation and `.github/workflows/web-ci.yml` were completed in [PR #1](https://github.com/darrylrachel/smartbudget/pull/1), merged October 27, 2026. Verified the workflow exists on GitHub main. [Web CI run 40568044540](https://github.com/darrylrachel/smartbudget/actions/runs/40568044540) completed successfully; inspected its job steps and confirmed clean install, typecheck, lint, domain tests, production build, Chromium installation and Playwright all passed. No missing Phase 0 implementation was identified. Unrelated source-checkout reconciliation and repository visibility review remain separate owner tasks.

The Phase 1 diff does not modify the Phase 0 workflow, dependency versions, lockfile, historical Expo code, UI or design tokens. Successful historical Phase 0 CI is not a claim about this PR's future CI; inspect the new PR checks independently.

## Specification review and delivered contracts

- Conservation: available funding is checked posted cash minus existing reservations; additions plus unassigned equal available funding. Existing reservations remain protected, including unused goal/buffer envelopes. Negative accounts reduce cash; negative net cash or over-reservation block allocation. Overflow and malformed monetary inputs reject.
- Locks/caps: locks are included once, reduce every residual target and obey available cash plus target/cap headroom. Invalid lock sets reject without mutating input or returning a partial plan. Existing reserves count toward caps; capped weighted surplus stays unassigned rather than being redistributed.
- Priority/shortfall: overdue/due bills and debt minimums sort by date, priority, ID, then variable essentials by priority/ID, then buffer and weighted remainder. Added a regression that failed before correcting optional variable dates incorrectly outranking priority. Unmet nonweighted needs produce shortfall and acknowledgment metadata; a blocked plan cannot be accepted.
- Rounding: BigInt products and largest fractional remainders with stable envelope-ID ties. Includes zero weights and maximum safe-integer funding. Missing weights leave cash unassigned.
- Reproducibility: explicit canonical fields, locale-independent ID ordering, SHA-256 and version/workspace identity. Every snapshot array is normalized. Inputs are copied before asynchronous hashing; frozen inputs and edits remain unchanged. Hash identifies the snapshot, not an acceptance token or the edited payload.
- Forecast exclusion: only `postedCash` funds a plan. Extra transport forecast/confirmed-pay fields have no effect. Recurrence returns dates only and never contributes money. The adapter remains responsible for excluding pending/ineligible/foreign-workspace records.
- Recurrence: anchored weekly/biweekly, calendar monthly/semimonthly, half-open ranges, no bank-holiday shifting, month-end clamping without drift, leap/century/year/DST boundaries. Clamped semimonthly collisions yield one date. Irregular periods require explicit valid boundaries.

## Test review

24 domain tests: 7 preserved foundation tests and 17 engine/recurrence tests. Existing assertions were retained. The original 200 generated invariant cases are supplemented with 200 cases varying existing reserves, locks, caps and weights across the basis-point range. These also revalidate generated plans as edits and compare totals/unmet amounts. Additional coverage checks invalid edits/locks, fully funded needs, cap headroom with reservations, all canonical array orders, relevant hash-field changes, frozen/caller-mutated input, variable-priority regression and calendar boundary rules.

No server authorization, concurrent acceptance, idempotency, refund/transfer ledger or credit spending behavior is claimed from pure-domain or mock-isolation tests.

## Local commands and actual results

Windows, Node v22.14.0, installed lockfile dependencies, commands from `web/`:

| Command | Result |
| --- | --- |
| `npm run typecheck` | Passed |
| `npm run lint` | Passed |
| `npm test` | 24/24 passed, no failures/skips; includes 400 generated cases |
| `npm run build` | Passed; two React Router dependency warnings for ignored `use client` directives |
| `npm run test:browser` | 7/7 Chromium tests passed in 33.4 seconds on approved unrestricted retry |
| `git diff --check` (repository root) | Passed |

The first sandboxed Playwright run stalled during local server/browser startup and was stopped; the retry required local server/browser permissions. The priority regression was observed failing before its implementation fix. No tests were weakened or skipped. Browser coverage verifies the unchanged sample application; the pure engine is not wired into its screens. Device installability, manual screen-reader testing and production performance were not verified.

## Final diff and remaining risks

Reviewed the exact changed-file list and text, including all new source/test files, for scope, generated output and credential patterns. Changes consist of allocator/recurrence modules, engine tests, test discovery and directly affected documentation. Build output, Playwright reports/results and dependencies remain ignored; generated public PNGs have no tracked changes. No secrets or real financial records were identified; fixtures are synthetic. No deploy or Phase 2 work was performed.

The v1 adapter must supply one reconciled outstanding demand per envelope, matching reservations and workspace-scoped eligible posted balances. Duplicate envelope demands reject instead of double-counting an existing reserve. Obligation occurrence/payment reconciliation and general multi-obligation envelope modeling remain adapter integration work. Semimonthly clamping can collapse two configured dates into one forecast date; this must remain visible when future schedule UI is integrated. Web Crypto SHA-256 requires the supported runtime/secure browser context.

UI previews remain explicitly hand-authored and read-only. Persisted editing, server authorization and atomic/idempotent/version-checked acceptance, stale/conflicting commands, ledger reconciliation, credit spending, refunds/transfers and secure persistence remain deferred. No plan can be saved or accepted by this increment. The PR is for Phase 1 domain review only.
