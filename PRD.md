# SmartBudget product requirements

Status: finalized v1 starter baseline • 2026-10-21. “Finalized” means an internally consistent implementation baseline, subject to explicit product revisions. See README for provenance and newly selected defaults.

## Problem and intended outcome

People who were never taught personal finance often know their balance but cannot tell what is available after upcoming bills. SmartBudget helps a user answer: “What must this paycheck cover, what can wait, and what can I safely assign next?” It teaches without shame and explains every recommendation.

## Users and jobs

- Individual: plan from actual pay, protect necessities, track spending and goals.
- Household contributor: coordinate shared obligations without exposing private finances.
- Beginner: learn one practical concept and apply it without a quiz becoming a barrier.

## MVP boundaries

Manual accounts, opening balances, cleared transactions, scheduled income, obligations, categories/envelopes, payday plans, goals, household invitations and scoped permissions, recommendation review, monthly summaries, and Academy progress. One USD currency per workspace; integer cents throughout. Pay frequency may be weekly, biweekly, semimonthly, monthly, or irregular with an explicit next planning boundary.

Excluded: bank integrations, payments, transfers at financial institutions, investments, tax optimization, credit scoring, AI-generated allocation decisions, multicurrency conversion, automatic bill negotiation, advertisements, and paid subscription systems. Account transfers entered in the app are bookkeeping only.

## Workspace and privacy model

Each user has one private personal workspace and may belong to one active household. Every financial record belongs to exactly one workspace. Switching workspace visibly changes the entire financial context. No combined balance spanning personal and household is shown in MVP.

The household is a separate ledger. Sharing a contribution or obligation creates a deliberate household record; it does not grant access to its private source account or transaction history. Record only the contributed amount and optional user-approved note. Never maintain a client-readable link back to a private source record. Household funding is confirmed once and counted only in that workspace’s cash accounts.

Owner manages membership and all shared data. Editor manages shared financial records and plans. Viewer reads shared data only. Private workspace access remains exclusive to its owner. Owners cannot leave without transferring ownership or deleting the household after an explicit confirmation. Revoked members lose access immediately; cached household data is cleared on revocation/sign-out. An export must respect the same scope.

## Primary journeys

1. Welcome → privacy explanation → local/mock personal workspace → choose pay schedule → add cash opening balance → obligations → view an empty or sample plan.
2. Real paycheck clears → user confirms amount/account/date → preview allocation → inspect reasons and shortfalls → edit → accept once → envelopes update atomically.
3. Add expense → choose workspace/account/category → review → save → available envelope decreases; duplicate submission is rejected.
4. Invite household member → recipient authenticates and explicitly accepts → member sees shared ledger only → contributor records confirmed contribution → shared plan can use that cash.
5. Learn → lesson → optional check → mark complete → optional deep link into a budgeting flow, without changing finances.

## Functional acceptance criteria

| Area | Required behavior |
| --- | --- |
| Income | Expected pay appears as forecast only; recommendations use settled cash. Irregular pay requires a planning end date. |
| Plan | Display period, eligible funds, protected funds, requested funding, recommendations, reasons, shortages, and remainder. |
| Edits | User edits are validated with the same invariants as generated recommendations. |
| Accept | A single atomic, idempotent acceptance rejects stale input versions and preserves cash. |
| Activity | Manual entry, edit, and void with audit history; internal transfers do not count as income/expense. |
| Goals | Targets and optional dates; no guaranteed outcomes, returns, or enforced savings requirement. |
| Household | Direct ID requests and guessed IDs cannot cross workspace boundaries. Invite alone grants no access. |
| Academy | 15 lessons, resume/progress, optional knowledge checks, no financial mutation on completion. |
| Reporting | Monthly income/expense totals use transactions, not allocations; show incomplete-data state. |

## Nonfunctional requirements

Accessible labels, font scaling, sufficient contrast, keyboard support for web preview, and minimum 44-point touch areas (48 preferred). Persist no real financial data during Phase 1. Later backend authorization is mandatory; UI hiding is insufficient. No sensitive analytics payloads, full transaction descriptions, or financial amounts in diagnostics. Recommendation explanations must be available without network calls once authorized inputs are loaded.

## Edge states

Zero cash offers setup or education; insufficient cash shows unmet essentials without inventing money. Missing pay date asks for a planning boundary. Overdue items remain visible until resolved. Invalid balance blocks acceptance. Revoked access clears shared views. Offline may show previously authorized data under a future cache policy, but financial mutations require online confirmation in MVP. Mock foundation data is visibly labeled and never mixed with real data.

## Success measures

Track only consented, minimized event counts: completed onboarding, first accepted plan, return to next payday, lesson completion, and user-rated clarity. Targets require pilot baselines; do not invent efficacy claims. Primary qualitative criterion: users can explain what their money is reserved for and why.

## Release gate

All algorithm invariants, authorization matrix tests, concurrency/idempotency checks, accessible primary journeys, recovery/error states, data deletion/export behavior, and reviewed Academy content must pass before real financial data is introduced. Phase 1 is a mock foundation and is not an MVP release.
