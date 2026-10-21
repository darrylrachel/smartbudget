# Proposed database schema

Logical Postgres design for later implementation, not executable migrations. All financial tables carry workspace_id; IDs are UUIDs; created_at/updated_at are UTC timestamps. Money columns are BIGINT cents with domain validation and safe client serialization. Currency is USD in MVP. Date-only fields use DATE and workspace time zone rules.

## Tables

| Table | Core columns and constraints |
| --- | --- |
| profiles | user_id PK/FK auth identity; display_name; preferences; no public profile listing |
| workspaces | id PK; kind personal/household; name; currency; time_zone; ledger_version; settings_version; owner_id |
| memberships | workspace_id + user_id composite PK; role owner/editor/viewer; joined_at; at most one active household per user |
| invitations | id; workspace_id; recipient lookup; token_hash unique; invited_role editor/viewer; expires_at; accepted_at; revoked_at; inviter_id |
| accounts | id; workspace_id; name; type cash/checking/savings/credit; eligible_cash boolean; opening_balance_cents; opening_date; archived_at |
| categories | id; workspace_id; name; kind essential/flexible/debt/savings; sort_order; archived_at |
| envelopes | id; workspace_id; category_id; name; target_cents nullable; is_buffer; archived_at |
| transactions | id; workspace_id; account_id; type income/expense/transfer/refund/adjustment; signed_amount_cents; posted_date; status posted/pending/void; category_id nullable; envelope_id nullable; transfer_group_id nullable; client_request_id; actor_id |
| income_schedules | id; workspace_id; amount_cents; cadence; next_expected_date; account_id; active; forecast only |
| obligations | id; workspace_id; envelope_id; name; amount_cents; recurrence_definition; priority; kind essential/minimum_debt; active |
| obligation_occurrences | id; workspace_id; obligation_id; due_date; outstanding_cents; status; unique occurrence key; source payment reconciliation metadata |
| goals | id; workspace_id; envelope_id unique; title; target_cents; target_date nullable; status |
| allocation_settings | workspace_id PK; rule_version; weighted_envelope configuration; buffer_target_cents; version |
| plan_snapshots | id; workspace_id; start_date; end_date exclusive; input_hash; ledger_version; settings_version; rule_version; normalized_input; result; status preview/accepted/expired |
| allocation_events | id; workspace_id; envelope_id; signed_delta_cents; event_type allocate/spend/refund/release/credit_reserve; plan_id nullable; transaction_id nullable; actor_id |
| accepted_plans | id; workspace_id; plan_id unique; idempotency_key unique within workspace; accepted_by; accepted_at; shortfall_acknowledged; override_acknowledged |
| academy_lessons | id/slug unique; version; metadata; content source reference; publication status; reviewed_at; public published educational content only |
| lesson_progress | user_id + lesson_id composite PK; completed_version nullable; completed_at nullable; last_section_key; updated_at |
| audit_events | id; workspace_id nullable; actor_id; action; entity_type; entity_id; timestamp; minimized change metadata; never client-editable |

Posted account balance derives from opening balance plus posted signed transactions. Do not maintain a separately client-writable current balance. Envelope reservations derive from allocation_events. Goal progress derives from the associated envelope, never a second independent money counter. Allocation acceptance adds reservations but no transaction or cash. Transfers have two equal-and-opposite entries in the same workspace and commit atomically. Cross-workspace transfers are not automatic linked entries in MVP; contributions are separately confirmed bookkeeping with no private-source reference.

## Relational integrity

Every workspace-scoped table has UNIQUE(workspace_id, id), and composite foreign keys enforce matching workspace for account/category/envelope/goal/plan references. Do not rely solely on globally unique IDs. Enforce positive targets, nonnegative requested amounts, valid date order, exactly one buffer envelope per workspace, and valid transaction sign/type combinations. Financial history is voided or reversed with audit records rather than hard deleted during normal editing. Opening balance changes also invalidate ledger versions.

Allocation events may be negative only for explicit spend/release/reversal events. Server transactions ensure no ordinary reservation mutation overdraws available cash or an envelope; imported/corrected deficits must enter a visible reconciliation state. A unique client_request_id per workspace prevents duplicate transaction submits.

## Authorization matrix

| Resource/action | Personal owner | Household owner | Household editor | Household viewer | Nonmember |
| --- | --- | --- | --- | --- | --- |
| Read workspace financial data | Own only | Yes | Yes | Yes | Deny |
| Add/edit financial records; accept plan | Own only | Yes | Yes | Deny | Deny |
| Manage roles/invitations | N/A | Yes | Deny | Deny | Deny |
| Transfer ownership/delete household | N/A | Yes, confirmed | Deny | Deny | Deny |
| Read/write lesson progress | Own user only | Own user only | Own user only | Own user only | Authenticated own user only |

Personal workspaces cannot add other members. Household owner must have exactly one matching owner membership; ownership transfer updates both atomically. Invite acceptance checks authenticated recipient, token hash, expiry, unused state, and household limit in one transaction. Tokens are one-use and not logged. Membership role changes and revocations must never be self-escalatable. Database policies cover SELECT/INSERT/UPDATE/DELETE and both old and new workspace IDs on updates. Security-definer functions require fixed search paths and explicit authorization checks; never expose generic privileged SQL to clients.

## Concurrency and indexes

Index memberships by user_id, transactions by (workspace_id, posted_date), occurrences by (workspace_id, due_date, status), and events by (workspace_id, envelope_id). Accept-plan operation locks the workspace version, verifies authorization and versions, validates result, inserts accepted_plans and events, increments ledger_version, and appends audit record atomically. Retry using the same idempotency key returns the prior committed result only when the request matches; a mismatched payload conflicts. Any transaction affecting cash/reservations and any rule/target edit invalidates relevant previews.

## Required migration evidence

Before backend use, implement migrations, rollback/recovery notes, policies, and negative authorization tests for every scoped table, including nested joins and guessed IDs. Test simultaneous invite acceptance and owner transfer, revoked sessions/subscriptions, stale plan acceptance, duplicate payment posting, cross-workspace references, and private progress isolation. Deletion/export retention rules must be chosen and tested before production; this logical schema alone is not a secure deployed database.
