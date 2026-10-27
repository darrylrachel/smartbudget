# Repository alignment and CI verification

October 27, 2026. Scope: documentation and development infrastructure only. See [current status](docs/PROJECT_STATUS.md), [roadmap](ROADMAP.md), [foundation evidence](docs/WEB_FOUNDATION_VERIFICATION.md) and [implementation report](docs/REPOSITORY_ALIGNMENT_REPORT.md).

Baseline: local and remote main at `fada3e7c4daed98a59dcf78cf83ec1c4b8efb214`. Dedicated branch `chore/repository-alignment-ci` in an isolated worktree. Source checkout modified/untracked work was left untouched. Node 22.14.0, npm 11.2.0, Windows.

| Command from web/ | Result | Evidence / limitations |
| --- | --- | --- |
| `npm ci` | Pass on retry | 127 packages installed, zero reported vulnerabilities; initial sandbox run stalled and exited with npm exit-handler error; network-enabled clean install passed |
| `npm run typecheck` | Pass | `tsc --noEmit` |
| `npm run lint` | Pass | ESLint completed without errors |
| `npm test` | Pass | 7 domain tests; zero failures/skips; not allocator or backend security evidence |
| `npm run build` | Pass | Typecheck, PNG generation, Vite assets and public-only service worker; existing two React Router use-client directive warnings |
| `npx playwright install chromium` | Pass on retry | Initial sandbox DNS ENOTFOUND; network-enabled installation succeeded |
| `npm run test:browser` | Pass on retry | 7 Chromium tests passed in 34.9s, no skips; sandbox run stalled, first unrestricted retry encountered occupied port; stopped task-created stalled run before final retry |

CI: `.github/workflows/web-ci.yml` runs on pull requests targeting main, pushes to main and manual dispatch. Ubuntu, Node 22 (within package engine constraint), npm lockfile caching, `npm ci`, actual typecheck/lint/test/build scripts, Playwright Chromium installation with Linux dependencies, then browser tests. Playwright owns strict-port preview 4183. Read-only contents permission; 20-minute job timeout; no deployment, credentials or artifact upload. Remote CI success is not inferred from local checks or Pages/Jekyll.

`git diff --check` passed; reviewed file list contains documentation plus the workflow only. No app source/test/lockfile changes.

Local checks do not establish persistent financial correctness, server authorization, real-device installability, screen-reader approval, production hosting, or release readiness.

---

## Historical starter-package evidence (unchanged below)

# Artifact verification

Verified 2026-10-21 by the package builder.

- 13 requested/optional starter files present, including .gitignore and .env.example.
- UTF-8 Markdown/configuration files written with LF line endings.
- All relative Markdown links resolve to supplied files.
- Academy curriculum contains exactly 15 numbered lesson entries.
- Five-tab names match across product, design, roadmap, and implementation prompt.
- Environment template contains comments only; no active credentials.
- First prompt requires a written plan before implementation and limits work to Phase 1.
- ZIP paths are relative, contain no traversal entries, and include dotfiles.
- Every archived file is byte-for-byte identical to its individual counterpart; ZIP CRC check passes.
- SHA256SUMS.txt covers the 13 starter files and this report; it intentionally does not hash itself.

These checks verify artifact integrity and package structure, not application behavior. No app, allocator, database, device build, or production security system has been implemented or tested. Curriculum is a specification rather than finished reviewed lesson manuscripts. See README for source limitations and selected defaults.

## Phase 1 financial engine

See [Phase 1 verification](docs/PHASE_1_VERIFICATION.md) for the Phase 1 specification review, local typecheck/lint/domain/build/Playwright results, and the remaining adapter/backend boundaries. Phase 0 is merged in PR #1; its Web CI run 40568044540 passed all steps.
