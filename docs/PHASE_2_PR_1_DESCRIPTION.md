## Summary

Establish a minimal Fastify/TypeScript backend with GET /health, explicit port validation, development/build/start commands, safe HTTP errors and shutdown handlers. Retain the local Supabase configuration with Windows setup guidance; health and backend tests need neither credentials nor Supabase.

Reuse the authoritative web/src/domain engine directly in a backend test. Correct sparse semimonthly schedule validation: missing array slots previously bypassed forEach and could silently omit paydays. Require two own numeric integer-day entries and preserve valid month-end clamping and existing interfaces. No financial API, auth, persistence or deployment added.

## Validation

- npm ci in server and web: passed.
- Backend typecheck, 4 tests, production build and real production health/config smoke: passed.
- npm run dev plus actual GET /health: HTTP 200 and exact JSON.
- Web typecheck, lint, 26 unit/domain tests, build and 7 Chromium tests: passed.
- Regression reproduced before correction (Missing expected exception for sparse two-slot array).
- git diff --check and ignored-secret/artifact checks: passed.
- Supabase CLI 2.22.6 parsed local config but startup failed: Docker Desktop Linux daemon pipe unavailable. Running local database/stop checks remain unverified.
- POSIX shutdown signal semantics and remote CI are not claimed from Windows results. Non-deploying backend CI job included.

## Scope and evidence

Existing uncommitted Phase 2 scaffold was backed up outside the worktree before revision. Existing Pages workflow and unrelated checkouts were preserved. See docs/ADR_PHASE_2_BACKEND.md, docs/LOCAL_BACKEND.md and docs/PHASE_2_PR_1_VERIFICATION.md for inspection, decisions, Windows acceptance commands and limitations.
