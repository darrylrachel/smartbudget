# Phase 1 implementation plan

Authorized October 27, 2026: pure financial engine and recurrence tests.

1. Reuse the web money/snapshot contracts; tighten demand/reservation consistency.
2. Implement pure deterministic allocation, validated edits, canonical SHA-256 input identity, versions and acknowledgment metadata. Keep acceptance unavailable.
3. Expand weekly, biweekly, semimonthly and monthly forecast dates with explicit month-end clamping, no holiday adjustment, and half-open periods.
4. Test worked fixtures, edge dates, invalid inputs, locks/caps, stable rounding and generated conservation/reordering cases. Run typecheck, lint, tests and build.
5. Record results and update current status; defer backend, ledger writes and UI budgeting journeys.

## Review preparation plan

Authorized follow-up: inspect against current GitHub main, confirm Phase 0 independently, add regression coverage for review findings and correct Phase 1 defects, run all five requested checks, inspect the complete Phase 1 diff, then commit/push a dedicated branch and open a PR targeting main subject to required permissions. Preserve Phase 0 and the separate source checkout. No merge, deployment or Phase 2 work.
