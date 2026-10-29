# Phase 2 PR 1 verification — 2026-10-29

## Inspection and implementation

Started in specification directory C:/Users/rache/Code/SmartBudget-2.0 (not a Git repository). Reused repository-alignment worktree, initially feat/phase-1-financial-engine at dd2da95. Modified .gitignore, README and PROJECT_STATUS plus untracked server/, supabase/, Vite config and Phase 2 docs were present. Preserved their source files at ../phase2-preexisting-backup before updating this same-task scaffold. Separate historical checkout and pages-fix were untouched. Fetched and fast-forwarded dedicated codex/phase-2-pr1-backend-foundation branch to main 885e6ea; no existing commits rewritten.

Fastify 5.12.7, strict TypeScript, separate npm package, validated PORT, loopback startup, graceful shutdown handlers, safe errors and GET /health implemented. No auth, database adapter, financial endpoint or deployment. Backend imports authoritative existing domain sources directly; no extraction or duplicate engine. Existing Vite proxy retained, with /health tested directly. Non-deploying backend CI job added to existing web CI; Pages workflow unchanged.

## Executed checks

Runtime: Node 22.14.0, npm 11.2.0, Windows PowerShell.

| Check | Result | Evidence |
| --- | --- | --- |
| Clean installs | PASS | npm ci in server and web; audits reported zero vulnerabilities at execution time |
| Backend typecheck | PASS | server: npm run typecheck |
| Backend tests | PASS | server: npm test, 4/4 |
| Real health HTTP integration | PASS | Test starts actual loopback server, verifies 200, JSON content type, no-store and exact payload |
| Safe error and validation behavior | PASS | Test-only routes: generic 500, 400 for string integer/extra/missing fields, valid input accepted, 404 |
| Actual allocation engine on Node | PASS | 1001 cents -> rent 200, a 401, b 400; zero remainder; stable hash/reordered result; input unchanged |
| Backend build | PASS | npm run build -> dist/local.mjs |
| Production startup/config | PASS | node tests/dev-smoke.mjs: starts built entry, GET /health, process cleanup; invalid PORT exits 1 without stack |
| Development command | PASS | npm run dev; Invoke-WebRequest returned 200 application/json; charset=utf-8 and {"status":"ok"}; stopped via Ctrl+C |
| Frontend typecheck | PASS | web: npm run typecheck |
| Frontend lint | PASS | web: npm run lint |
| Frontend/domain tests | PASS | web: npm test, 26/26 including 2 new recurrence tests |
| Frontend build | PASS | web: npm run build, existing React Router use-client directive warnings |
| Browser tests | PASS | web: npm run test:browser, Chromium 7/7 in 36 seconds |
| Diff whitespace | PASS | git diff --check |
| Secret/artifact exclusion | PASS | git check-ignore for .env, dist, node_modules and Supabase temp state; reviewed source/templates before staging |
| Supabase config parsing/start | FAIL | supabase start parsed config then could not connect to Docker Desktop Linux engine named pipe |
| Supabase running services/stop | NOT RUN | CLI 2.22.6 available; Docker executable installed, Linux daemon unavailable |
| POSIX signal drain behavior | NOT RUN | Windows child.kill is process termination, not Unix signal delivery; handler implemented, CI added but remote result not claimed |
| Remote CI | NOT RUN | Local report does not claim GitHub Actions success |

Initial restricted HTTP fetches failed; rerunning backend and browser tests with local network permission passed. First browser retry encountered the preview left by the restricted attempt; only that identified Vite process was stopped before the successful run. Initial backend TypeScript errors were corrected before passing final checks. Dependency installs were rerun via npm ci before final checks.

## Recurrence regression evidence

Before correction, the new malformed-days test failed with Missing expected exception for Array(2). forEach skipped sparse entries, and undefined comparisons failed to reject them. The first nonleap fixture also exposed a test setup error (anchor after range); anchor was corrected to 2023 before final verification.

Correction requires a real array, exactly two own slots, valid integer days 1–31, and ascending distinct order. Regression matrix covers missing/null/non-array fields, wrong lengths, sparse tuples, undefined/null/string entries, out-of-range/fraction/NaN/infinite values, duplicates and reverse order. Valid frozen inputs, leap/nonleap month-end clamping, collisions and irrelevant adapter metadata remain supported. Other cadence behavior remains covered by existing tests. No allocation source code changed.

## Limits and follow-up

Optional Docker services must be verified on a machine with a running Linux container daemon. Financial engine imports currently cross the web/server directory boundary; extract a shared package only when useful, with compatibility checks. No production security/readiness claim. Next authorized increments can address identity, household authorization, database schema/RLS and atomic audited persistence. Hosting remains undecided. See LOCAL_BACKEND.md for exact Windows acceptance commands and ADR_PHASE_2_BACKEND.md for decisions.
