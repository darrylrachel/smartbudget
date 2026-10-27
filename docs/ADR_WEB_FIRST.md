# ADR: web-first foundation beside the Expo prototype

Status: accepted for this user-authorized foundation, October 27, 2026.

Use React/TypeScript, Vite, semantic HTML/CSS and React Router in web/. Keep the native prototype and its root scripts intact. Reuse pure money/date helpers, synthetic data and Academy metadata with source provenance; port interaction intent rather than React Native components. This supports desktop layout, native web controls, keyboard interaction and explicit PWA behavior without a native presentation dependency.

The local root is not a published production app. No data migration is needed in this phase. Only public shell assets may be cached; financial state remains synthetic and in memory. Future server acceptance and household authorization remain separate increments. The canonical 2.0 specification package is docs/smartbudget-2.0. Earlier native route/stack descriptions document the preserved prototype only.
