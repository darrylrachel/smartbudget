> Current requirements: [canonical PRD](../docs/smartbudget-2.0/02-PRD.md), [roadmap](../ROADMAP.md), [status](../docs/PROJECT_STATUS.md). Initial beta is completely free; this package currently implements synthetic sample functionality only.

# SmartBudget 2.0 web foundation

Responsive light-first sample PWA with optional dark mode built with React, TypeScript, Vite and React Router. This package is independent of the preserved Expo prototype in the repository root.

## Run locally

Use Node 22.12+ within Node 22 (22.14.0 verified), npm 11.2.0:

```sh
cd web
npm ci
npm run dev
```

The development URL is printed in the terminal. Production/PWA preview:

```sh
npm run build
npm run preview
```

Open http://127.0.0.1:4173. PWA service workers run only from the production build. Installation support depends on browser/platform. HTTPS and SPA deep-link fallback will be required for future hosting; no site was deployed.

## Verify

```sh
npm run typecheck
npm run lint
npm test
npx playwright install chromium
npm run build
npm run test:browser
```

Browser tests start their own strict-port preview on 4183. They include desktop/mobile screenshots, automated axe scans, direct-link reloads, money validation, workspace resets, browser-Back draft protection, sample lesson progress, public cache exclusions, offline navigation and user-controlled service-worker updates. See ../docs/WEB_FOUNDATION_VERIFICATION.md for actual outcomes and untested platforms.

## Scope and provenance

Money helpers, date/allocation contracts, sample workspace records and Academy metadata were copied/adapted from ../src of the existing local Expo prototype. The web presentation is semantic HTML/CSS. Workspace identifiers are reusable validated IDs; only the mock adapter restricts demo aliases. Async workspace reads support cancellation. Fixture selection and role labels are not authorization.

All amounts are checked integer cents. Expected pay is forecast only. Plan output is hand-authored sample data; no allocator or financial write ledger is implemented. Save/accept/invite/export/deletion actions remain unavailable. All 15 catalog topics are present: 14 unpublished and one sample reader. Progress is in memory and resets on reload. No authentication, backend SDK, real finance data, bank connection, billing or telemetry is included.

## PWA contract

Build scripts produce actual 192/512 PNG icons, a maskable PNG and a service worker whose cache allowlist contains only build-owned public assets. API/auth/RPC/export requests and navigation responses are not cached. Offline navigation uses a public explanation page. No financial data or tokens enter localStorage, IndexedDB or Cache Storage. Updates wait for explicit discard/reload confirmation. Public bundles contain synthetic sample fixtures only.

## Profile and theme

Open the named sample profile in the header to switch workspace or toggle dark mode. Light is the default. Only the nonfinancial theme choice is persisted under `smartbudget-theme` in localStorage, and the toggle still works for the current session when storage is unavailable. The displayed sample name is replaced by a real authenticated profile in a later phase.
