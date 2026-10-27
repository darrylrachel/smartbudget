# Web foundation implementation plan

October 27, 2026. Scope: execute only the SmartBudget 2.0 foundation prompt.

## Inspected baseline
main at 63e8f4a45c19a3e0c67e012a484f85f09878eefe; origin https://github.com/darrylrachel/smartbudget.git. Root specs already modified; Expo app/src/tests/package files untracked. Preserve all existing application source and root package scripts. No web package exists. User explicitly requested implementation, superseding the ancestor learning-only guidance for this task.

## File map and reuse
- web/src/domain: copy exact checked cents helpers and date/period contracts; adapt reusable workspace IDs away from demo-only union.
- web/src/data and fixtures: scoped defensive-copy mock adapter, async cancellation and synthetic records ported from Expo.
- web/src/content: preserve all 15 catalog entries (14 unpublished, one sample); one optional sample check and memory-only completion.
- web/src: semantic React UI, one browser router, responsive light tokens, focus management and truthful disabled financial actions.
- web/public and scripts: manifest, generated PNG icons, public offline page, build-generated public-only service-worker allowlist.
- web/tests: domain boundaries and real Chromium journeys, accessibility, PWA cache/offline/update checks and screenshot evidence.
- docs: this plan, web-first ADR and actual verification report; copy 2.0 specs into docs/smartbudget-2.0, then add precise direction notices to existing specs without replacing their contents.

## Toolchain and commands
Runtime inspected: Node 22.14.0, npm 11.2.0. Exact dependencies will be recorded in web/package.json and lockfile after registry compatibility checks. Commands from web/: npm ci, npm run typecheck, npm run lint, npm test, npm run build, npm run test:browser, npm run dev, npm run preview.

## Acceptance
Five destinations and all detail routes; desktop sidebar/mobile bottom navigation at 1440/390 and 320px; 200% zoom equivalent reflow and keyboard focus; adjacent amount/date errors; scoped reads and draft-discard confirmation; no stale workspace data; reviewed sample-mode copy. Manifest/icons/service-worker allowlist; no financial API/auth/export cache; offline explanation and user-controlled update. Automated accessibility and screenshots; installation/screen reader results reported only if exercised.

## Stop line
No allocator, real authentication, database, persistence of finances, invitations/email, billing, hosted resources, publishing, PR or deployment. Preserve Expo source and unrelated changes. Foundation verification does not establish SaaS release readiness.

## Selected exact web toolchain

Node 22.14.0 / npm 11.2.0; React and React DOM 19.2.3; React Router DOM 7.18.4; Vite 8.3.5; TypeScript 6.0.3; ESLint 10.13.0; typescript-eslint 8.72.1; tsx 4.23.15; Playwright 1.64.1; axe Playwright 4.14.0. Exact type packages are pinned in web/package.json. npm lockfile records the resolved graph. Registry engine metadata confirms Vite requires Node ^20.19 or >=22.12, and Router requires >=20; the inspected runtime satisfies both. Vite handles TSX directly; no second framework or backend SDK is installed. ESLint was moved from the initially selected unsupported 9.x release to supported 10.13.0.
