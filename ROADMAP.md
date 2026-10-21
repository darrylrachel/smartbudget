# Roadmap and gates

No phase is authorized merely by being listed here. The first Codex prompt authorizes Phase 1 only after writing a plan.

| Phase | Deliverables | Exit evidence |
| --- | --- | --- |
| 0 — Product baseline | This documentation package and recorded assumptions | Cross-document consistency and archive verification |
| 1 — Foundation | Expo/TypeScript scaffold; five tabs and representative root-stack placeholders; theme; accessible components; typed domain contracts; mock repository; synthetic fixtures; Academy catalog and one sample reader | Typecheck/lint pass; focused money test; navigation smoke check; mock labeling; no network/backend dependency |
| 2 — Budget domain | Validated accounts/transactions, obligations, envelopes, deterministic allocator, manual review and reconciliation | All algorithm fixtures/properties; no double counting; correct boundary and credit semantics before enabling credit support |
| 3 — Identity and household | Approved backend setup, auth, schema/migrations, RLS, invites, roles, scoped repositories, atomic writes | Full role matrix and direct-ID denial tests; revocation; concurrency/idempotency; no private data leakage |
| 4 — End-to-end budgeting | Actual payday workflow, activity, goals, forecasts, monthly summaries, exports/deletion | Primary journeys on devices; accurate cash/reserve reporting; recoverable errors |
| 5 — Academy and polish | 15 reviewed lesson manuscripts; progress persistence; accessible lesson experience | Source and arithmetic review; progress privacy/versioning; no financial side effects |
| 6 — Release readiness | Device/accessibility testing; privacy/retention decisions; backups; support path; store assets and release review | Documented release checklist and explicit authorization to publish |

## Foundation stop line

Do not implement real authentication, backend connections/migrations, bank sync, payments, financial persistence, the full allocator, household permission services, production analytics, push notifications, deployment, or finished financial advice content in Phase 1. Demo buttons must disclose unavailable behavior. Do not create empty “working” success flows that imply financial actions occurred.

## Risks and responses

- Cash/reservation drift → one domain contract, atomic writes, reconciliation and invariant tests.
- Household privacy leak → separate workspaces, composite references, database authorization tests.
- Scope expansion → explicit phase boundaries and acceptance criteria.
- Beginner overload → progressive disclosure, short lessons, supportive error copy.
- False precision → clear forecasts/shortfalls, no guaranteed outcomes, reviewed examples.
- Dependency churn → choose compatible stable versions during implementation and commit lockfile.
