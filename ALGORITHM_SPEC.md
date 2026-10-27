> **Supporting specification, not implemented functionality:** Apply with the [canonical PRD](docs/smartbudget-2.0/02-PRD.md) and [roadmap](ROADMAP.md). Preserve detailed financial/security/content contracts. Old phase numbers refer to the historical sequence. MVP is US/USD only, one active household, free beta and 15 free reviewed lessons. Credit-card spending remains deferred; schema credit types do not enable it.

# Deterministic allocation specification

Version 1. Recommendations assign settled cash to envelopes; they never execute payments. No generative model participates in arithmetic or ranking.

## Money and period semantics

All monetary values are nonnegative integer USD cents except posted account balances, which may be negative. Use safe integers with checked bounds; reject NaN, fractions, overflow, mixed currencies, missing IDs, and invalid dates. Never silently clamp malformed data. Dates are workspace-local ISO dates; timestamps are UTC. A period is [start_date, next_pay_date), or [start_date, user_selected_end_date) for irregular income. End must be later than start. Bills due exactly at the boundary belong to the next period; a user can explicitly fund them early through a separate request.

For a snapshot:

- C = sum of posted balances in eligible cash accounts (checking/cash/savings explicitly included); exclude credit limits, investment values, pending deposits, and forecast income. Negative eligible account balances reduce C.
- P = sum of all active envelope reservations in this workspace, including already-funded goals and the protected buffer envelope.
- U = C - P. If C < 0 or P > C, return blocked/unreconciled, with no acceptable plan. Otherwise available new funding F = U.
- A confirmed paycheck is already included in C through its posted transaction. Never add the paycheck amount to F again.

Envelope balances decrease with posted categorized cash expenses; refunds restore the original envelope when attributable. Credit spending creates a matching payment reserve from its category; settling that credit payment consumes the reserve and cash once. Credit balances and principal repayments must not be treated as new income. Full credit-ledger behavior is Phase 2 work and must be tested before support is enabled.

## Inputs and reproducibility

Snapshot includes workspace_id, currency, ledger_version, rule_version, settings_version, period boundaries, account balances, envelope reservations, outstanding obligations, minimum debt payments, buffer target, goal targets, percentage settings, and user locks. All inputs are immutable during calculation. Output records these versions and canonical-input hash, stable request IDs, additions, reasons, unmet demand, and unassigned remainder. No current-time reads, network calls, random choices, or locale-dependent ordering inside the engine.

## Demand preparation

Each demand has stable ID, envelope ID, tier, due date if applicable, target cents, already-reserved cents, and optional cap. Net demand = max(0, target - already_reserved); this subtraction represents a legitimate fully-funded demand, not malformed input handling. Distinct obligations cannot claim the same outstanding liability twice. Occurrence IDs distinguish recurring bills; recurrence expansion belongs to a validated input adapter, not the allocator. Marked paid/cancelled occurrences have no outstanding demand.

## Allocation order

1. Apply explicit user locks that reserve additional cash. Validate all locks together: total ≤ F; no demand cap exceeded. If invalid, reject all and ask for revision. Locks may override priority but show unmet higher-priority needs and require acknowledgment before acceptance.
2. Fund essential living obligations and minimum debt payments overdue or due before period end. Sort by due date ascending, explicit user priority ascending, then stable ID lexical order. Missing due dates require input correction. Partial funding is allowed and clearly labeled.
3. Fund user-estimated essential variable needs for the period (food, transport, etc.), sorted by explicit user priority and stable ID. Targets are user inputs, never hidden cost-of-living estimates.
4. Top up the protected buffer envelope to its configured target. Zero is permitted. Do not release existing protected funds automatically.
5. Divide the remaining cash among configured discretionary, extra-debt, and savings/goal envelopes using percentage weights in integer basis points totaling exactly 10,000. Weights are user-configurable; a missing configuration leaves cash unassigned rather than inventing a universal recommended ratio.
6. Leave any amount not assigned due to caps or absent targets as unassigned. Do not automatically redistribute capped surplus in v1. Explain it.

Within step 5, calculate floor(remaining * weight / 10000), then distribute rounding cents by descending fractional remainder, ties by stable envelope ID. Use checked exact intermediate arithmetic (BigInt or safe checked multiplication). Apply each envelope’s remaining target cap after computing its share; capped cents become unassigned. Locked additions reduce residual targets in every tier, preventing double funding.

Hybrid means hard needs-first rules in steps 1–4 and percentage distribution in step 5. Percentages never outrank essentials unless the user explicitly chooses a validated lock. No automatic access to protected balances or private household-member funds.

## Result and explanation contract

Return status (ready, shortfall, blocked), original F, additions per envelope, unmet requests, unassigned cents, and reason codes: USER_LOCK, DUE_ESSENTIAL, MINIMUM_DEBT, VARIABLE_ESSENTIAL, BUFFER_TOP_UP, WEIGHTED_REMAINDER, TARGET_CAP, INSUFFICIENT_FUNDS, STALE_SNAPSHOT. Include plain-language explanation templates and relevant due date/target. A shortfall plan may be accepted only after the user acknowledges unmet needs. A blocked result cannot be accepted. Explanations must describe the actual order and amounts.

## Safety invariants

- Every addition ≥ 0; every addition and remainder is integer cents.
- sum(additions) + unassigned = F. Existing P is preserved unless the user runs a separate explicit reallocation operation.
- Final reservations P + sum(additions) ≤ C. Every capped envelope respects its cap after existing reservations and locks.
- Identical canonical inputs produce byte-equivalent normalized output.
- No expected pay, credit capacity, pending money, or another workspace’s funds enter F.
- Pure previews never mutate data. Accepting twice with one idempotency key changes reservations once.
- Any relevant ledger/settings change makes a preview stale. Server acceptance recalculates or verifies against locked versions in one database transaction; conflicts require a fresh preview.
- An expense reducing cash below reservations triggers reconciliation; the allocator must not hide the mismatch.

## Worked fixtures (amounts shown in cents)

| Case | Inputs | Expected new allocation |
| --- | --- | --- |
| Standard | C=100000, P=20000; due essential 40000; variable 20000; buffer gap 10000; residual weights goals 6000/discretionary 4000 | F=80000; 40000 essential, 20000 variable, 10000 buffer, 6000 goals, 4000 discretionary; remainder 0 |
| Shortfall | C=25000, P=0; essential A due earlier needs 20000, B needs 20000 | A=20000, B=5000, unmet B=15000; acknowledgment required |
| Rounding | F=101, no higher tiers; A=5000 bp, B=5000 bp; A sorts first | A=51, B=50 |
| Capped | F=10000, no higher tiers; A/B each 5000 bp; A cap=2000 | A=2000, B=5000, unassigned=3000 |
| Fully reserved | C=P=10000 | F=0; additions 0; demands shown unmet if present |
| Over-reserved | C=9000, P=10000 | blocked; no acceptance |
| Double pay protection | C=100000 already includes posted pay 80000, P=20000 | F=80000, never 160000 |

## Required verification before live use

Test fixtures above plus zero weights, duplicate IDs, period boundary bills, leap dates, overdue debt, partial existing funding, valid/invalid locks, credit reserve accounting, oversized integers, refunds/voids, transfers, negative account balances, stale previews, concurrent accepts, and cross-workspace rejection. Property tests cover conservation, determinism under input reordering, caps, and nonnegativity. The UI and persistence layer must use the same validated money domain. Phase 1 implements pure allocation and recurrence; ledger mutation, stale/concurrent acceptance, refunds, transfers, credit reserve accounting and production workspace authorization remain later backend work. See docs/PHASE_1_VERIFICATION.md for implemented contracts and evidence.


## Phase 1 adapter contract (October 27, 2026)

`web/src/domain/allocator.ts` exports asynchronous `previewAllocation(input)` and `previewEdits(input, edits)`; both use the same snapshot/cash/cap validation and produce pure results. Async is for platform Web Crypto SHA-256 only. Inputs are copied before hashing. The hash identifies the canonical snapshot, not an acceptance token or edited-plan payload; future acceptance must validate the submitted edits and current versions atomically. Malformed inputs/invalid locks throw; unreconciled cash returns blocked with zero assignable cash. No preview accepts or persists anything.

The v1 adapter supplies eligible posted cash only (including signed balances), outstanding unpaid/noncancelled demands, and one aggregate demand per envelope. It must scope all records to the input workspace and reconcile occurrences before aggregation. Duplicate envelope demands are rejected to avoid counting the same existing reserve twice. Demand `reserved` must equal its snapshot envelope reservation; caps and targets include existing reserves. Unused reservations remain protected. Weights reference weighted demands only; omitted weights leave residual cash unassigned. This is an adapter contract, not production access enforcement.

Edits express total new additions per request including locks. Omitted requests retain only their locked additions. Future dated demands require an explicit lock for early funding. Unmet nonweighted needs require acknowledgment; weighted goals alone do not make a plan shortfall. Capped unmet requests carry TARGET_CAP. Explanation rows report each actual increment; an envelope can have separate lock and ordinary allocation rows.

`paycheckDates` expands forecast dates for an explicit workspace/schedule and half-open period. Weekly/biweekly remain anchored; monthly/semimonthly use original configured days, clamp to the final valid date without drift, and make no holiday adjustment. Clamped semimonthly collisions yield one date. Dates before the anchor are excluded. Irregular schedules use an explicit `period(start, end)` rather than inventing future income. Recurrence never adds money to cash.
