# Contributing

Read [README](README.md), [AGENTS](AGENTS.md), the [approved PRD](docs/smartbudget-2.0/02-PRD.md) and [roadmap](ROADMAP.md). Work on a dedicated branch, preserve local changes and stay within the authorized phase. The canonical app is `web/`; historical Expo work is preserved.

Use the exact setup/check commands in README. CI runs typecheck, lint, domain tests, production build and Chromium tests after `npm ci`. Do not weaken tests to pass CI. Financial changes require conservation/rounding evidence; authorization changes require negative access tests. Compilation cannot establish security or release readiness.

Use synthetic data only. Never put account numbers, statements, secrets, invitation tokens or private financial records in issues, logs, artifacts or pull requests. Revoke/rotate exposed secrets through their provider.

PRs should describe the problem/result, affected contracts, actual verification and limitations. Include screenshots for interface changes. No merge or deployment without owner authorization. SmartBudget is proprietary commercial software; no open-source license is approved. Review visibility/access with the owner; a missing LICENSE does not make a public repository private.
