# Local backend and Supabase development (Windows)

Use Node >=22.12.0 <23 and npm. Open PowerShell at the repository root. All fixtures are synthetic. No provider account, credentials or running database are required.

## Install and run

```powershell
npm ci --prefix web
npm ci --prefix server
cd server
npm run dev
```

Expected: server listens on loopback port 3001; source edits restart it. In another PowerShell:

```powershell
Invoke-RestMethod http://127.0.0.1:3001/health
# To inspect HTTP status and headers:
Invoke-WebRequest http://127.0.0.1:3001/health
```

Expected: HTTP 200, application/json and status ok. Health makes no network requests or database queries. Ctrl+C stops the server. Optional `$env:PORT='3002'` changes the port; `Remove-Item Env:PORT` restores the default. The server/.env.example is documentation, not automatically loaded.

## Verify and run production output

From server/:

```powershell
npm run typecheck
npm test
npm run build
node tests/dev-smoke.mjs
npm start
```

Expected: strict typecheck, four passing tests, dist/local.mjs build, production health/config smoke on port 3007, then listener on port 3001. Stop npm start with Ctrl+C. Keep these ports free. Tests import the existing financial engine; they do not mock it. Windows smoke termination does not prove POSIX graceful signal delivery.

From web/:

```powershell
npm run typecheck
npm run lint
npm test
npm run build
npx playwright install chromium
npm run test:browser
npm run dev
```

Expected: 26 unit/domain tests, seven Chromium tests, successful build, unchanged sample interface at http://127.0.0.1:5173. Browser tests use port 4183 and require a preceding build. Open navigation, switch synthetic workspaces and theme, and inspect Plan/Activity; no persistence is claimed. Web build has existing React Router directive warnings. The /api development proxy is retained for future versioned routes; /health is accessed directly on the backend port.

## Optional local Supabase

Install a Supabase CLI and Docker Desktop with Linux containers using the [official setup](https://supabase.com/docs/guides/local-development/cli/getting-started). CLI 2.22.6 is the inspected version for the retained config; check CLI help before upgrades. No CLI dependency is added to either application package. Start Docker Desktop, then from repository root:

```powershell
supabase --version
supabase start --help
supabase stop --help
supabase start
supabase status
supabase stop
```

Expected with a working Docker daemon: local containers become healthy; stop preserves local data. The committed config is already initialized: do not run init over it. Initial startup downloads images. Status can display local credentials: keep its output private. Auth, signup, email, storage, realtime, studio, edge runtime and analytics are disabled. No financial tables, migrations or seeds are included. Local project ID is smartbudget-2-local; API port 54321 and database port 54322. Keep local services restricted to your machine.

On 2026-10-29 start parsed config but failed because Docker Desktop's Linux engine pipe was absent. Container readiness and start/stop were therefore not verified. Backend checks passed independently.

Hosted Supabase has separate project settings, managed infrastructure and real secrets. This local config does not configure or secure a hosted project. Do not link this scaffold to a remote project or run remote migrations. Future public configuration may use a project URL and publishable key; privileged keys and database connection secrets remain server-only and never use VITE_ or EXPO_PUBLIC_ prefixes. Environment files, local CLI state, builds and dependencies are ignored by Git.
