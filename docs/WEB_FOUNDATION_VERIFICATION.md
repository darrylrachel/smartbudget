# SmartBudget 2.0 web foundation verification

October 27, 2026. Foundation implemented in `web/`, alongside the preserved Expo prototype. No push, commit, PR, deployment, hosted resources or real financial records were created.

## Changed files

- New independent `web/` package: exact dependencies/lockfile; React/TypeScript client; React Router; semantic responsive UI; money/date/contracts port; scoped synchronous/async mock adapters; synthetic fixtures; Academy metadata; manifest/offline page/PNG icons; public-only service-worker generator; domain/browser tests; local README.
- New docs: WEB_FOUNDATION_PLAN.md, ADR_WEB_FIRST.md, this verification report, smartbudget-2.0 specification copies and web-foundation-evidence screenshots.
- Existing root README, PRD, ARCHITECTURE, UI_UX_DESIGN_SYSTEM, ROADMAP and CODEX_PROMPT_01 received additive web-first direction notices. README gained isolated web setup commands. Existing native descriptions and unrelated local edits were retained.
- Existing Expo app/, src/, tests/, root package manifest/lockfile and scripts were preserved. Modified root files already present at task start remain user work; this task did not reset them.

## Actual results

Runtime: Windows, Node 22.14.0, npm 11.2.0. Test browser: Playwright Chromium 156.0.8078.4 (revision 1248). Exact dependency versions are in web/package.json and the lockfile.

| Command (from web/) | Actual result |
| --- | --- |
| npm ci | Passed with normal install scripts; 127 packages, audit reported zero vulnerabilities at execution |
| npm run typecheck | Passed |
| npm run lint | Passed with ESLint 10.13.0 |
| npm test | Passed: 7 tests |
| npm run build | Passed; generated production assets, PNGs and service worker |
| npm run test:browser | Passed: all 6 Chromium tests, 20.5 seconds |

Domain checks cover exact cents input/output and safe bounds, invalid amounts/dates/weights, checked sums, defensive fixture copies, private/shared read separation, allocation input contracts, fixture conservation, 15-topic catalog, exclusive pay-date boundary and cancellation of obsolete async reads. These are not allocator or backend authorization tests.

Browser checks exercise five destinations and detail-route reloads; skip-link keyboard entry; adjacent validation and focus; truthful disabled actions; cancel/keep draft; browser-Back draft protection; workspace discard dialog, Escape and focus restoration; reset forms and private-goal denial in shared context; activity filters/empty/error retry; optional sample check/completion and reset on reload.

Responsive checks cover Home, Plan, Review, Activity, Learn and Entry at 1440, 390 and 320px with no horizontal overflow. Automated axe WCAG-tagged scans returned no violations in those 18 page/size combinations. Mobile navigation was exercised. A 720px layout viewport models 1440px at 200% zoom, followed by a 2x root-text scaling check. This is reflow/text-scale evidence, not a test of the browser's actual zoom menu or assistive technology. Desktop/mobile Home screenshots were visually inspected for hierarchy, alignment, wrapping and usable spacing. Screenshots of all six screens are saved under web-foundation-evidence/.

PWA checks verify manifest identity/display, actual PNG signatures and dimensions, service-worker registration, public Cache Storage contents, no API/auth/rest/RPC/export probe caching, empty localStorage/sessionStorage/IndexedDB, offline deep-link explanation, waiting update banner, keeping the current version, and explicit discard/update activation. Navigation responses are network-only with a public offline fallback. No financial payloads are persisted. The public bundles include synthetic fixtures only.

## Failures corrected and environment notes

- Initial dependency lookup failed with restricted DNS; approved network access completed installation.
- The first build failed on a stray empty CSS import; it was removed and subsequent builds passed.
- Initial local preview tests could not connect to the restricted server and then collided with its port. Task-created stale preview processes were stopped; final tests use their own strict port 4183 and passed with approved local connection access.
- A clean-install attempt while preview processes held a native dependency failed with Windows EPERM. After stopping those processes, the full npm ci passed. The failed attempt used ignore-scripts; the successful final clean install did not.
- The first browser run had 5 passes and one skip-link focus failure. Initial page-load focus was corrected; the final suite passed all 6 tests, including browser Back.
- Vite emits two dependency `use client` directive warnings from React Router. This app is entirely a browser client; the build and tested routes pass. No server-component behavior is implemented or claimed.

## Remaining limits and stop line

No OS-level installation/standalone launch, physical phone, Safari/Firefox/Edge-specific install behavior, screen reader, actual browser zoom-menu operation or production hosting was tested. Installation help is capability-aware, but manifest/offline evidence alone does not establish all-platform installability. No real-data security or SaaS readiness claim is made.

All financial save/accept, invitations, export and deletion actions are unavailable. Plan recommendations remain hand-authored fixtures. There is no backend/auth SDK, real allocator, financial persistence, bank sync, billing or telemetry. Academy contains 14 unpublished topics and one unreviewed sample manuscript; completion is memory-only. The next authorized increment should be the pure financial engine and recurrence adapter, with invariant/rounding/cap/date tests. This task stops at foundation.
## Profile menu and appearance update — October 27, 2026

The top-right profile disclosure now displays Alex Morgan (explicitly labelled Sample profile), with workspace switching and a working light/dark appearance switch. A real display name will come from the authenticated profile in a later increment. The nonfinancial `smartbudget-theme` preference is saved in localStorage; financial records and tokens remain unpersisted. Escape, outside pointer/focus, keyboard tab access and dialog focus restoration are supported. Light remains the default.

Verification: typecheck, lint and production build passed. All 7 Chromium browser tests passed in 32.6 seconds, including the preserved foundation flows plus theme persistence after reload, switching back to light, menu dismissal, and dark-mode axe scans on six screens at 1440, 390 and 320px. No axe violations were reported in those dark combinations. Initial palette/focus issues found during checks were corrected before this final run. This update did not modify money logic or the financial model; existing domain tests were not redundantly rerun. Dark desktop/mobile screenshots are in web-foundation-evidence/profile-dark-1440.png and profile-dark-390.png. The existing dependency directive build warnings remain unchanged.
