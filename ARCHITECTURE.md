# Architecture

## Stack baseline

Expo React Native with TypeScript and Expo Router for iOS and Android; web preview as a development convenience. Select a currently compatible stable Expo SDK at implementation time and record exact dependency versions and lockfile. Proposed later backend: Supabase Auth and Postgres with row-level security. No external service is required for foundation. Do not add a backend SDK, hosted project, or deployment in Phase 1.

## Boundaries

UI renders view models and dispatches intentions. Domain code owns cents, period semantics, invariants, and allocation contracts. Repository interfaces isolate data access. Foundation repositories return explicitly labeled synthetic fixtures; later authenticated adapters implement the same interfaces. Domain modules never import React, router APIs, backend clients, or wall-clock services.

Proposed structure:

```text
app/                     Expo Router layouts and screens
  (tabs)/                Home, Plan, Activity, Goals, Learn
src/
  components/            Accessible reusable controls
  theme/                 Semantic tokens and typography
  domain/                Money, periods, allocation contracts
  features/              Budget, transactions, goals, academy, workspace
  data/                  Repository interfaces and mock adapters
  fixtures/              Synthetic sample data only
  content/academy/       Versioned lesson metadata and later manuscripts
tests/                   Focused domain and navigation checks
docs/                    Future ADRs and implementation plan
```

## State and data flow

Active workspace is explicit context; every financial repository call requires workspace_id. A switch resets queries and sensitive forms before rendering the next context. Server authorization is authoritative in later phases. Academy state is scoped to authenticated user identity, not household identity. Route parameters are untrusted input and validated before data access.

Financial mutation flow in later phases: authorized request → validated cents/date/domain input → database transaction → audit record and ledger-version increment → invalidate cached previews → refresh UI. Preview acceptance verifies snapshot/settings versions and idempotency key inside the transaction. Do not implement this with separate client writes. Expected income is stored separately from posted transactions.

## Security and operational model

Public client configuration contains only project URL and publishable key when integration is enabled. Privileged keys remain server-side. Authenticate and verify membership on every database operation. Apply row-level policies to base tables and protect privileged functions, storage, invitations, exports, and realtime subscriptions. Never trust a client-supplied actor ID. Minimize logs and avoid storing full request bodies containing financial data.

MVP financial writes require online confirmation. Offline financial editing and conflict resolution are out of scope. Cache behavior for real data must be designed before backend launch; memory-only is the safe initial default. Sign-out/revocation clears user/workspace state. Later releases require tested account deletion, retention policy, backup/restore procedures, and incident reporting ownership.

## Quality strategy

Foundation: typecheck, lint, a focused money-conversion test, mock isolation check, and navigation smoke check. Domain phase: fixture/property tests described in ALGORITHM_SPEC. Backend phase: role matrix, invite expiration, direct-ID access denial, atomic acceptance/concurrent write tests, export/deletion authorization. UI: accessibility and device-size verification. Run commands actually provided by the chosen toolchain; document failures accurately.

## Deferred decisions

Authentication providers, email delivery, hosting region, retention durations, crash reporting vendor, app-store identity, analytics consent UI, and license require explicit decisions before their phase. Do not invent account access, deploy resources, send invitations, or enable external telemetry to resolve these choices during foundation.
