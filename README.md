# SmartBudget 2.0

Web-first personal finance SaaS and installable responsive PWA built with React, TypeScript, Vite and React Router in `web/`. The existing CSS tokens, forest-green actions, light-first interface and optional dark mode are retained.

## Current implementation

The web foundation provides responsive navigation, profile/theme controls, synthetic personal and household workspaces, exact-money primitives, sample plan and transaction views, a 15-entry Academy catalog with a sample reader, and a public-shell service worker. All financial data is synthetic. Financial writes, authentication, secure household services, export and deletion are unavailable. Learning progress resets on reload. The pure financial allocator and paycheck recurrence adapter are implemented and tested independently of the sample UI. There is no persistent backend or production security guarantee. See [Phase 1 verification](docs/PHASE_1_VERIFICATION.md).

## Development

Use Node `>=22.12.0 <23` (CI uses Node 22) and npm. No environment variables or backend are needed for the sample app.

```sh
cd web
npm ci
npm run dev
```

Vite serves development at http://127.0.0.1:5173. To verify:

```sh
npm run typecheck
npm run lint
npm test
npm run build
npx playwright install chromium
npm run test:browser
```

On Linux, use `npx playwright install --with-deps chromium` to install browser system dependencies too. Browser tests start their own production preview at port 4183, require a preceding build, and refuse to reuse another server. `npm run preview` serves the build at port 4173. Stop local servers when done. Service workers register only in production builds; installability needs separate browser verification. Future hosting requires HTTPS and SPA deep-link fallback.

## Product and documentation authority

- [Canonical PRD](docs/smartbudget-2.0/02-PRD.md): approved requirements, detailed correctness contracts and outstanding decisions.
- [Canonical roadmap](ROADMAP.md): Phases 0–6, dependencies and exit criteria.
- [Project status](docs/PROJECT_STATUS.md): implemented versus planned, local-work preservation and decisions.
- [Technical architecture](docs/smartbudget-2.0/03-TECHNICAL-ARCHITECTURE.md), [financial rules](ALGORITHM_SPEC.md), [logical schema](DATABASE_SCHEMA.md), [design specification](docs/smartbudget-2.0/04-UI-UX-SPECIFICATION.md), and [Academy specification](ACADEMY_SPEC.md): detailed contracts. These do not claim backend implementation.
- [Web ADR](docs/ADR_WEB_FIRST.md), [verification](VERIFICATION.md), [contributing](CONTRIBUTING.md) and [agent instructions](AGENTS.md).

The initial beta is completely free: no payment or credit card, checkout, premium gates or upgrade prompts. Approved testers receive all completed beta MVP functionality, including 15 free reviewed lessons. Pricing, tiers and entitlements are a separate post-validation design task.

## Proprietary code and historical work

SmartBudget is a proprietary commercial product. No open-source license is approved; do not add one or assume redistribution rights. Repository visibility must be reviewed by the owner. A missing LICENSE does not make a public repository private; avoid publishing proprietary material without authorization. Never commit credentials or real financial data.

Root Expo/React Native assets and older native-first specifications are preserved historical work, outside the canonical web build. Superseded prompts do not authorize rebuilding or migrating the app. Audit and foundation reports retain their original evidence and dates; consult current status for subsequent changes.

## Local backend scaffold

Phase 2 PR 1 adds a minimal Fastify/TypeScript backend with `GET /health` and local Supabase configuration. No authentication or persistence is implemented. See [local development commands](docs/LOCAL_BACKEND.md), [architecture ADR](docs/ADR_PHASE_2_BACKEND.md), and [verification](docs/PHASE_2_PR_1_VERIFICATION.md).
