# SmartBudget 2.0 PRD

Status: proposed implementation baseline, October 27, 2026. User-confirmed direction: responsive web-first SaaS and installable PWA; paycheck-first hybrid budgeting; shared household; financial education; light design. Audit findings are in document 01. Defaults below are proposals unless marked otherwise.

## Purpose and users

Help people answer: “What must this paycheck cover until the next one, what is already reserved, and what can I assign now?” Support an individual managing timing, a household coordinating shared obligations, and a beginner learning through short practical explanations. The product records plans and bookkeeping; it does not move bank funds.

The primary budgeting unit is the pay period. Calendar-month summaries are a reporting lens over posted activity, never a second independent budget ledger. The hybrid combines needs-first allocation with user-configured percentages of the remainder, plus envelope tracking and goals. It is not a mandatory 50/30/20 budget.

## Release scope

**Foundation:** browser shell and installable sample PWA, five product areas, safe domain contracts, synthetic personal/household data, lesson catalog, truthful unavailable actions. No real financial data.

**Usable SaaS MVP:** authentication; manual cash/checking/savings accounts; posted income/expense/refund/adjustment and same-workspace bookkeeping transfers; scheduled income forecasts; obligations and occurrences; category envelopes; preview/edit/accept plans; goals; household roles/invites; monthly reporting; reviewed education and private progress; export/deletion; responsive PWA.

**Deferred:** bank synchronization, bank payments, investment/tax optimization, generative allocation decisions, multicurrency, native app-store clients, offline financial writes, full credit-card ledger, subscription billing and automated notifications. Debt minimums may be planned as cash obligations; credit capacity is never cash. “SaaS” means hosted authenticated service, not an implied billing feature. Credit-card spending must remain unavailable until payment-reserve accounting is implemented and tested.

## Workspace and privacy contract

Every financial record belongs to one private personal or shared household workspace. Shared membership never exposes a personal ledger. Show workspace identity on every view and mutation. Do not provide a combined personal/household balance. Contributions are deliberate shared bookkeeping entries with no client-readable private-source links; clarify that recording one does not transfer bank money. Two records in different workspaces require separate user confirmation and must not be silently mirrored.

Owner manages membership/ownership and financial records. Editor manages financial records and accepts plans. Viewer reads shared finances only. Invitations grant nothing until authenticated recipient acceptance. Revocation denies subsequent server operations immediately and clears local shared views on detection; do not cache sensitive household data offline. Lesson progress belongs to the user and is never visible to household peers.

## Core journeys and acceptance

| ID | Journey / requirement | Acceptance evidence |
| --- | --- | --- |
| P01 | Onboard: explain privacy, choose schedule, enter opening cash, add essentials, preview | Empty account remains zero; sample mode is isolated; setup can resume after authenticated save |
| P02 | Confirm received paycheck with account, date and actual amount | One posted income event; duplicate request returns same result; expected paycheck cannot increase available funds |
| P03 | Preview needs through next pay boundary, inspect reasons, edit additions | Same engine validates generated and edited allocations; show cash/reserved/buffer/unassigned and shortages |
| P04 | Accept plan | One atomic commit; repeat key cannot apply twice; stale version requires refresh; shortfalls/priority overrides require acknowledgment |
| P05 | Record spending, refund, transfer or correction | Cash and reservations reconcile; transfers excluded from income/expense totals; correction preserves audit history |
| P06 | Goals and buffer | Goal progress derives from its envelope; buffer is included in reserved totals; no duplicated money counters |
| P07 | Household invite, acceptance, switch, revoke, ownership transfer | Full role matrix and guessed-ID denial; personal data absent from shared responses/exports; last owner cannot leave without resolution |
| P08 | Monthly report | Use posted transaction dates and workspace timezone; separate transfers/allocations; disclose missing history |
| P09 | Learn, resume and mark complete | 15 reviewed lessons, optional checks; private progress persists; completion cannot mutate financial records |
| P10 | Install and reopen PWA | Standalone launch where supported, deep links work, installation guidance matches browser capability, unavailable offline writes are explicit |
| P11 | Export and deletion | Scope and authorize export; show consequences; deletion/retention behavior matches selected policy and is tested before launch |

## Financial behavior

Use checked integer USD cents. Eligible posted cash C includes negative balances in included cash accounts. Active reservations P include goals and buffer once. Available new funding F=C−P; block an unreconciled snapshot when C<0 or P>C. A confirmed paycheck is already included in C and is never added again. Forecast income is informational.

Plan interval is [start date, next pay date), or an explicit end for irregular pay. Include overdue essentials; an obligation on the end boundary belongs to the next interval unless explicitly requested early. Weekly, biweekly, semimonthly and monthly schedules require valid calendar expansion; semimonthly is not every 14 days. Proposed month-end policy: clamp scheduled day to the last valid calendar date, display it and allow user adjustment. No automatic bank-holiday adjustment is assumed.

Allocation order: validated user locks; due essential bills and debt minimums; user-estimated variable essentials; buffer top-up; weighted remaining goals/extra debt/flexible envelopes. Sort due items by date, user priority, stable ID. Shortfalls allow partial funding, show unmet amounts, never manufacture cash. Missing weights leave remainder unassigned. Configured weights total 10,000 basis points; round with largest fractional remainders, stable ID ties, then apply caps and leave excess unassigned. Existing reserves are preserved; releasing them is a separate explicit operation.

Conservation: sum(new additions)+unassigned=F; all additions nonnegative; final reserved≤cash; no cap exceeded. Inconsistent input blocks acceptance. Allocation is bookkeeping, not an expense. A cash expense uses its envelope; overspending must trigger visible reconciliation rather than silently consuming another category's reserve.

Worked acceptance example: posted cash $1,000 already includes this paycheck; existing reservations $200 include the buffer. Available new funding is $800. Fund $400 due essentials, $200 variable essentials and a $100 buffer top-up; split the remaining $100 with 60/40 weights into $60 goals and $40 flexible spending. Final reservations are $1,000 and unassigned is $0. A forecast paycheck does not change any of these totals. With only $250 available against two ordered $200 essential needs, fund the earlier need $200 and the next $50, display $150 unmet, and require acknowledgment before acceptance.

## Product quality and success

Light interface, keyboard/screen-reader usable, WCAG 2.2 AA target, 200% zoom and 320px reflow without losing controls. Proposed supported launch browsers: current stable Chrome/Edge/Safari/Firefox; installation behavior verified where browser/platform supports it. Installation is optional; browser access remains complete.

Proposed performance budgets: public shell LCP≤2.5s on a documented mobile profile, preview calculation≤100ms for a 500-demand fixture on the agreed test device. Measure, record and adjust against actual pilot usage rather than claiming compliance from builds.

Measure consented, minimized onboarding completion, first accepted plan, next-payday return, lesson completion and clarity feedback. Do not log amounts, transaction descriptions or household details. Pilot targets need a baseline. Users should be able to explain which needs are funded and what remains unfunded.

## Decisions to validate before their phase

Launch geography/currency; household limit; owner/editor/viewer policy; identity/email provider; hosting/region; retention and deletion timeline including backups; subscription strategy; licensing; support ownership and content reviewer. These do not block a synthetic foundation. They do block relevant production configuration and commitments. No release date or cost estimate is asserted without team capacity and vendor choices.
