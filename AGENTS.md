# Repository instructions for coding agents

## Scope and source of truth

Read README, PRD, ALGORITHM_SPEC, UI_UX_DESIGN_SYSTEM, ACADEMY_SPEC, ARCHITECTURE, DATABASE_SCHEMA, and ROADMAP before substantial changes. User instructions take precedence. Document a plan before implementation. CODEX_PROMPT_01 authorizes only foundation; later roadmap entries are not standing authorization.

## Working rules

- Inspect repository state and preserve unrelated changes. Reuse existing architecture when reasonable.
- Keep changes focused and reviewable. Avoid unrelated rewrites, invented requirements, and unnecessary dependencies.
- Use TypeScript with explicit domain contracts. Domain logic stays independent of UI and network services.
- Every financial amount is integer cents with checked safe bounds. Do not use floating-point currency arithmetic.
- Validate dates and periods explicitly. Expected income is forecast, not available cash.
- Require workspace IDs at data boundaries. Household members never gain private workspace access.
- Allocation previews are pure. Future acceptance must be atomic, idempotent, authorized, version-checked, and auditable.
- Never place credentials or real financial data in code, fixtures, documentation, logs, screenshots, or commits. Expo public variables are public.
- Do not send messages, invitations, create hosted resources, deploy, or perform financial actions without explicit task authorization.
- Synthetic fixtures must be labeled. Demo success screens must not imply real money or persistence.
- Use semantic theme tokens, accessible labels, scalable text, and meaningful empty/error states.
- Academy content must be supportive and reviewed before publication. Completion never changes money.

## Verification and reporting

Run checks appropriate to the changed behavior. Financial/domain changes need invariant and edge-case tests; authorization changes need negative access tests. Low-impact copy changes do not require redundant test suites. Record commands and actual results. Never claim a device test, security property, or release readiness based solely on compilation. Update affected specifications and README when contracts or setup change.

Do not add a separate approval gate for ordinary reversible work already authorized by the user. Ask when a material missing decision blocks progress or an action requires authorization. Stop at the requested phase boundary and report deferred work.
