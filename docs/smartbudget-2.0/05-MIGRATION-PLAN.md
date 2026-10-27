> **Historical migration proposal; delivery sequence superseded:** The [root roadmap](../../ROADMAP.md) is the only authoritative phase sequence. Preserve the reuse and recovery guidance below; old repository observations and stage numbers are dated evidence, not current status.

# Grounded migration plan

This is primarily a specification-to-product build plus selective reuse of an uncommitted prototype. There is no verified production database or deployed user data to migrate. Do not invent a production cutover or run destructive data conversion. If implementation discovers real data, stop that migration path, inventory it and design an explicit backup/mapping/reconciliation plan.

## Preserve and reconcile first

Remote baseline: main at 63e8f4a45c19a3e0c67e012a484f85f09878eefe. Local checkout has modified specs and untracked app source. Record status and preserve all local work before editing; do not reset, clean, stash untracked work blindly or overwrite the root app. Use web/ for the first isolated package. Neither this audit nor the roadmap authorizes publishing, provisioning or sending invites.

| Existing asset | Treatment | Reason / verification |
| --- | --- | --- |
| ALGORITHM_SPEC.md | Preserve rules, incorporate 2.0 decisions | Strong conservation/rounding contract; build engine tests before UI arithmetic |
| DATABASE_SCHEMA.md | Evolve into executable migrations later | Table design is useful; no existing RLS/migration implementation to preserve |
| src/domain/money.ts | Copy/adapt with provenance and boundary tests | Pure TypeScript and exact arithmetic; do not couple web build to native dependencies |
| src/domain/contracts.ts | Adapt | Replace demo WorkspaceId union, strengthen aggregate/reference checks and shared boundary validation |
| src/fixtures and mockRepository | Reuse synthetic concepts with web adapters | No persistence/security implied; ensure independent workspace copies |
| Academy catalog and sample | Preserve metadata, unpublished status | Metadata is not 15 reviewed lessons; source/editorial phase remains |
| src/theme and React Native components | Port tokens and interaction intent | Web uses semantic HTML and responsive desktop layout |
| Expo app/router/scripts | Preserve as local prototype | Avoid destructive rewrite; native product deferred |
| Existing tests | Port relevant domain checks, add browser coverage | Jest route smoke cannot establish browser/PWA behavior |
| README/PRD/ARCHITECTURE/design/roadmap/prompt | Align together | Remove contradictory native-first default from canonical 2.0 instructions |

## Ordered increments

| Stage | Concrete deliverable | Exit gate / dependency |
| --- | --- | --- |
| 0: Baseline | Preserve local source; record ADR; canonical 2.0 docs and conflicts | Remote/local inventory complete; no lost user changes |
| 1: Web foundation | Isolated responsive sample web app, public-shell PWA, mock repositories, safe money primitives, sample curriculum | Clean install/typecheck/lint/tests/build; keyboard/mobile/deep-link checks; cache excludes financial data; no false save success |
| 2: Financial engine | Pure allocator, recurrence adapter, checked ledger rules, editable preview contract | All original fixtures plus properties, caps/rounding/locks/periods; no double paycheck counting; credit spending unavailable |
| 3: Auth/data/household | Local versioned migrations, scoped repository, role policies, invite lifecycle, atomic posting/acceptance | Negative role/ID/joins tests, concurrency and retry evidence, revocation and ownership transfer; production providers selected before connection |
| 4: Usable vertical journeys | Real onboarding → posted pay → preview/edit/accept → expense/refund → goal/report; household contribution | Browser end-to-end persistence/reload, stale/retry recovery, reconciliation; server math matches engine fixtures |
| 5: Education/operations | 15 reviewed lessons, private progress, scoped export/deletion, monitoring/restore/support | Content and source review, privacy decisions, restore rehearsal, operational owners |
| 6: Pilot/release | Responsive accessibility/PWA browser matrix, pilot clarity feedback, release evidence | All real-data gates passed; explicit authorization before hosted rollout |

Stage 1 does not authorize stages 2–6. The first implementation prompt stops at its bounded foundation. Estimates require actual team capacity; prioritize gate evidence over calendar promises.

## Risk controls and recovery

Keep the Expo prototype until copied helpers/fixtures pass web checks and a reviewer can compare behavior. Foundation rollback is removal/reversion of only the isolated web change, preserving unrelated source. Commit boundaries should separate product-doc alignment, web scaffold, shell/components and PWA/tests; no commit is created by this audit.

For later database changes use additive migrations first, transactional backfills only after inventory, and verify row counts, workspace ownership, cash totals and reservations before switching readers. Financial correction uses reversal entries; do not rely on dropping columns or restoring a backup to undo accepted plans. Rehearse restore on synthetic data before live use. Destructive schema cleanup is a separate phase after compatibility and retention review.

Main risks: duplicate monetary counters, stale/concurrent accepts, cross-workspace leakage, cached household data, misleading mock success, mixed platform instructions and unpublished educational claims. Each has a named exit gate above. A missing license/region/retention decision is recorded now and resolved before the relevant release action, not filled with an invented historical agreement.
