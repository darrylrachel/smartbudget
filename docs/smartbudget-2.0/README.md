# SmartBudget 2.0 specification package

Prepared October 27, 2026. Product direction: web-first SaaS, installable responsive PWA, paycheck-first hybrid budgeting, separate private and household ledgers, practical education, light design.

Read in order:

1. [Repository audit](01-REPOSITORY-AUDIT.md): verified remote versus local state, evidence and gaps.
2. [PRD](02-PRD.md): scope, product behavior, acceptance criteria and open decisions.
3. [Technical architecture](03-TECHNICAL-ARCHITECTURE.md): proposed web stack, money model, authorization and PWA contract.
4. [UI/UX specification](04-UI-UX-SPECIFICATION.md): responsive layouts, flows and state handling.
5. [Migration plan](05-MIGRATION-PLAN.md): reuse decisions, ordered increments and release gates.
6. [First implementation prompt](06-CODEX-IMPLEMENTATION-PROMPT.md): a bounded, executable web foundation task.

These are proposed 2.0 specifications, not claims of implemented functionality. They supersede the old native-first direction for the proposed work. Existing remote files and local uncommitted work were preserved. No source code was changed, pushed or deployed during this audit. Markdown documents are the editable deliverables.

Evidence labels throughout: **Verified** = directly inspected repository/API or local source; **Proposed** = a new design decision; **Assumption** = a default requiring validation; **Unknown** = not established by this audit. The referenced conversation contained only “Let's begin working on SmartBudget 2.0”; no additional prior assistant specifications were available. This package existed when the current continuation began and was reviewed and updated against fresh GitHub and local-source evidence. See VERIFICATION.md for the distinction between earlier recorded checks and current verification.
