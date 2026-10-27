> **Superseded historical specification/prompt:** Preserve the detail below as provenance. Current authority: [approved PRD](docs/smartbudget-2.0/02-PRD.md), [roadmap](ROADMAP.md) and [project status](docs/PROJECT_STATUS.md). Native-first setup, old phase numbers, unfinished-app claims and open-license/provider choices below are not current instructions. The web foundation is implemented; this task authorizes Phase 0 alignment and CI only.

> **SmartBudget 2.0 direction (October 27, 2026):** The canonical product is now a web-first responsive SaaS/PWA. Use [the 2.0 specifications](docs/smartbudget-2.0/README.md), [web architecture decision](docs/ADR_WEB_FIRST.md), and [web foundation plan](docs/WEB_FOUNDATION_PLAN.md). Native-first instructions below describe the preserved Expo prototype and do not authorize rebuilding it. The web package lives in `web/`. The first 2.0 foundation task is implemented; see [verification](docs/WEB_FOUNDATION_VERIFICATION.md). Later engine/backend phases require a new request.

# Codex prompt 01 — Plan, then implement the foundation only

You are working in the SmartBudget repository. Read AGENTS.md and all supplied product/specification Markdown files before editing. The documentation is the implementation baseline. If actual repository instructions conflict, identify and resolve the conflict within the authorized foundation scope; ask only if a material product decision cannot be inferred.

## First: inspect and plan

Inspect existing files, repository status, and any applicable agent instructions. Preserve unrelated user work. Write `docs/IMPLEMENTATION_PLAN.md` before implementation, covering current state, selected compatible toolchain versions, proposed files, component/route map, domain/repository boundaries, verification commands, assumptions, and explicit exclusions. Do not claim to have executed checks you have not run.

Share a concise plan summary, then proceed with the reversible Phase 1 work in the same run. A separate plan-approval pause is not required by this prompt. Do not interpret “then implement” as authorization for later phases.

## Then: implement Phase 1 only

1. Create or adapt a minimal Expo React Native TypeScript app with Expo Router. Select mutually compatible stable dependencies, record them, and commit a lockfile if repository policy allows. Do not overwrite an existing app to force the proposed structure.
2. Build Home, Plan, Activity, Goals, and Learn tabs with visible labels and centralized light-first forest-green design tokens.
3. Create the documented root-stack placeholders or simple sample screens. Implement real navigation, accessible controls, and realistic synthetic mock/empty/error states. Show the active workspace and “Sample data • Changes are not saved.”
4. Define safe integer-cent money helpers, validated input contracts, allocation types/reason codes, workspace-scoped repository interfaces, and mock adapters. Do not implement the complete allocation engine or real ledger persistence. Clearly label fixture recommendation previews as samples.
5. Supply synthetic personal/household mock workspaces whose data never blends. Workspace switching clears stale details/forms. Mock role labels illustrate planned behavior without claiming security enforcement.
6. Add metadata for all 15 Academy lessons and one clearly labeled sample lesson reader. Leave unpublished lesson content explicitly unavailable. Progress can be in-memory only and must be labeled as reset on restart.
7. Add a small set of meaningful checks: cents parsing/formatting boundary tests, repository workspace isolation, typecheck/lint, and route smoke verification using supported tooling. Do not mirror every component in tests.
8. Update README with actual local setup/run/check commands and current implementation limitations. Keep all other specifications aligned with changes.

## Constraints

- No secrets, production credentials, privileged keys, real financial records, or copied personal transaction data.
- Foundation runs in mock mode without an account, external service, or environment variables.
- No backend project, database migrations, auth SDK, bank connection, payments, external invitations/messages, production telemetry, deployment, or full allocation implementation.
- No floating-point currency calculations, forecast cash treated as available, hidden allocation decisions, or private data shown in household demos.
- Treat public Expo environment variables as public. Do not put secrets into `.env.example` or tracked files.
- Use the design and accessibility acceptance criteria. Keep work within this scope; record deferred items rather than silently implementing later phases.

## Completion report and stop

Run appropriate checks and fix failures within scope. Report what was built, exact commands run and outcomes, unverified device/platform behavior, changed files, and remaining limitations. If blocked by missing tools or required network approval, state that accurately; do not report a passing check. Stop after Phase 1. Do not publish, deploy, create production resources, or start Phase 2 without a new user instruction.
