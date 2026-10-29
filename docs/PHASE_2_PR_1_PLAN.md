# Phase 2 PR 1 implementation plan

Initial checkout: feat/phase-1-financial-engine at dd2da95. Existing uncommitted Phase 2 scaffold is preserved outside the repository at ../phase2-preexisting-backup; unrelated checkouts remain untouched. Dedicated branch starts from origin/main 885e6ea after fast-forward.

1. Reuse and finish the existing scaffold with Fastify, strict TypeScript, explicit port validation, safe errors/logging and graceful shutdown. GET /health is process-only liveness.
2. Keep financial sources in web/src/domain; bundle direct imports for Node ESM compatibility. Add an independent backend allocation fixture, without exposing a financial API.
3. Reproduce sparse semimonthly days before fixing validation. Preserve clamping, ordering and valid public interfaces; document treatment of irrelevant extra fields.
4. Preserve local Supabase configuration and document optional Docker workflow, no hosted access or schema changes.
5. Run installs, backend checks and real startup, all web checks and browser tests. Record exact results and infrastructure limits; commit, push and open a focused PR without merging.
