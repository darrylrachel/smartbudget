> **Supporting specification, not implemented functionality:** Apply with the [canonical PRD](docs/smartbudget-2.0/02-PRD.md) and [roadmap](ROADMAP.md). Preserve detailed financial/security/content contracts. Old phase numbers refer to the historical sequence. MVP is US/USD only, one active household, free beta and 15 free reviewed lessons. Credit-card spending remains deferred; schema credit types do not enable it.

# SmartBudget Academy

## Purpose and guardrails

Accessible personal finance education for people starting from scratch. Use short sentences, explain vocabulary, avoid shame, and recognize that limited income cannot always be solved through budgeting. Content is general education, not individualized financial, legal, tax, or investment advice. No product endorsements, affiliate links, guaranteed savings, or claims that credit outcomes are certain.

MVP: 15 lessons, about 3–5 minutes each, available in any order with a suggested sequence. Progress is private to the user, never shared with a household. No pass requirement, streak penalty, or financial action required to complete a lesson. All lessons must be available without a paywall.

## Curriculum

| ID / slug | Lesson and learning outcome | Optional practice |
| --- | --- | --- |
| 01 / money-without-shame | Starting where you are: distinguish a money habit from personal worth; choose one small next step. | Name a question you want answered. |
| 02 / cash-flow | Cash flow: explain timing versus monthly totals and why a positive month can still have a tight week. | Map one pay date and bill date. |
| 03 / paycheck-plan | Plan a paycheck: identify what must last until the next pay date. | Draft a sample pay period. |
| 04 / needs-and-flexibility | Needs, wants, and flexible choices: categories depend on circumstances, not moral labels. | Sort a fictional example. |
| 05 / bills-and-due-dates | Bill calendar: identify due dates, minimums, and recurring costs. | Add a reminder in a mock example. |
| 06 / envelopes | Envelopes: explain balance versus reserved money and avoid counting money twice. | Assign fictional cash to two needs. |
| 07 / irregular-income | Irregular income: budget settled cash and use cautious forecasts without treating them as funds. | Compare expected and received pay. |
| 08 / small-buffer | Emergency buffer: distinguish a short-term cushion from a long-term goal; start at a feasible amount. | Choose a sample buffer target. |
| 09 / sinking-funds | Sinking funds: prepare for predictable nonmonthly expenses. | Split a fictional annual cost across periods. |
| 10 / debt-basics | Debt basics: understand principal, interest, minimums, and consequences of missed payments. | Identify terms on a fictional statement. |
| 11 / credit-card-cash | Credit card cash: distinguish a credit limit from cash and reserve money for card payments. | Trace a sample purchase and payment. |
| 12 / debt-strategies | Debt strategies: compare highest-rate and smallest-balance approaches while maintaining required payments. | Compare a neutral worked example. |
| 13 / shared-money | Shared money: agree on contributions and boundaries without surrendering privacy. | Draft a household discussion checklist. |
| 14 / realistic-goals | Realistic goals: connect a target, time frame, and affordable contributions; revise when circumstances change. | Adjust a fictional timeline. |
| 15 / reset-and-review | Reset and review: reconcile a plan, handle surprises, and seek trustworthy help when needed. | Walk through a sample overspend reset. |

## Lesson content contract

Each lesson contains stable ID/slug, content version, title, summary, estimated minutes, learning objective, 3–5 short sections, clearly fictional example, one takeaway, optional knowledge check with explanation for every answer, optional practice, glossary terms, review date, and source references. “Mark complete” remains available after reading regardless of check answer. Never collect free-text financial disclosures as lesson responses in MVP.

Example check for lesson 06: “Your cash balance is $100 and $70 is reserved for a bill. How much is unassigned?” Answer: $30. Explain that the reserved $70 still exists in cash but already has a job. Incorrect choices receive supportive explanations; there is no failure state.

## Publishing and review

This starter specifies lessons; it does not contain 15 finished, fact-checked lesson manuscripts. Phase 1 includes catalog metadata and one clearly labeled sample reader. Phase 5 writes all lessons, checks arithmetic, verifies claims against current primary sources (for example official consumer education and regulator materials appropriate to the launch jurisdiction), records exact URLs and reviewed dates, and obtains editorial review before release. No unverified financial guidance should be generated at runtime.

## Progress and integration

Store user_id, lesson_id, completed content version, completion timestamp, and last section key. Progress belongs to the user rather than a financial workspace. A revised lesson may show “Updated since you read it” without deleting completion history. Future action links open a draft flow with workspace clearly identified; the user must explicitly review and save. Lessons cannot accept allocations, create debt, change account balances, or reveal shared activity.

## Acceptance

15 discoverable lesson entries; readable scalable text; resume works after relaunch once persistence is enabled; optional checks give explanations; completion is independent of answers; progress is inaccessible to household peers; version updates are handled; no financial side effects; all published numerical examples and sources reviewed.
