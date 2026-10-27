> **Current alignment:** Preserve the existing web CSS design system, responsive navigation, forest-green actions and optional dark mode. The [approved PRD](02-PRD.md) governs; sample foundation screens do not establish implemented financial workflows. The beta has no premium gates or upgrade prompts.

# UI/UX specification

Proposed responsive web experience. Preserve calm light surfaces, forest green actions and plain supportive language. The current prototype's centered 720px column is a reference for mobile content, not the desktop layout contract.

## Navigation and layout

Public: welcome, product/privacy explanation, sign-in and installation help. Authenticated: Home (/), Plan (/plan), Activity (/activity), Goals (/goals), Learn (/learn); Settings (/settings) and Household (/household). Details use /plan/review, /transactions/new, /goals/:id and /learn/:slug. Foundation shows sample mode without authentication. Server/session-backed routes arrive later.

Desktop ≥1024px: 232px left navigation, workspace switcher at top, content max-width 1280px, 32px gutters. Home uses a main planning column plus supporting upcoming/learning rail. Plan uses demand table plus 320px sticky summary. Activity uses sortable/filterable table. Tablet 768–1023px: compact labeled navigation, two columns only where content fits. Mobile <768px: single column, 16px gutters, five labeled bottom destinations, workspace header; reserve safe-area padding so navigation/actions do not cover content. Breakpoints are proposed design values; test at 320, 390, 768 and 1440px and at 200% zoom.

Financial entry and review use dedicated routes on mobile; desktop may use a focus-managed dialog while retaining a direct-link route. Browser back must behave predictably. Unsaved form discard requires a specific confirmation. Every page has one h1, navigation landmarks, a skip link and visible focus. Tables become labeled cards on narrow screens while preserving amount/date/type relationships.

## Visual system

| Token | Value | Purpose |
| --- | --- | --- |
| background / surface / muted | #F7F8F4 / #FFFFFF / #EDF2EB | Light canvas and grouping |
| primary / pressed / onPrimary | #174D38 / #103B2B / #FFFFFF | Primary actions |
| text / secondary | #17251C / #4E6255 | Main and supporting copy |
| border / controlBorder | #CED8CE / #738477 | Decoration / usable input boundary |
| warning text / surface | #754400 / #FFF1D6 | Shortfall and attention |
| error text / surface | #A12622 / #FDECE9 | Blocking state |
| success text / surface | #1A583C / #E8F3E9 | Confirmed result |
| focus | #275DAD | Visible keyboard focus |

System sans-serif, tabular money numerals; 16/24px body, 14/20 labels, 20/28 sections, 24/32 page titles and 32/40 primary balance. Use rem sizing and flexible line wrapping. Spacing 4/8/12/16/24/32/48px; cards radius 16, controls 12; touch targets ≥44px, prefer 48px. Verify actual rendered color pairs against WCAG AA; tokens alone do not prove contrast. Color and animation never carry unique meaning. Respect reduced motion.

## Screen contracts

| Screen | Content order and primary action | Critical states |
| --- | --- | --- |
| Home | Workspace/freshness → available-to-assign → next expected pay → urgent needs → Review paycheck → goal/lesson | Zero cash offers setup; forecast is separate; deficits block planning |
| Plan | Period → cash/reserved/buffer breakdown → demand waterfall → weights/remainder → Review | Missing boundary, invalid weights, partially funded needs, reconciliation |
| Review | Snapshot time/period → proposed changes and reasons → unmet needs/overrides → acknowledgments → Accept allocations | Stale version offers refresh; blocked cannot accept; shortfall requires acknowledgment |
| Activity | Workspace → date/account/type filters → posted entries → Add entry | Loading, incomplete history, no results, offline, denied, retry |
| Entry | Workspace → type/account/date/category/envelope/amount → review → Save | Exact money validation, missing references, stale account, duplicate retry |
| Goals | Reserved/target/date with text equivalent to progress bar → details → assign through plan | No goals, target reached, archived envelope; no extra cash counter |
| Learn | Resume → suggested path → 15 topics → lesson reader | Unpublished unavailable, source/review information, optional check, private progress |
| Household | Shared-ledger explanation → role/member list → invite/manage | Viewer read-only, pending/expired invite, revoked, ownership resolution |
| Settings | Pay schedule, timezone, preferences, privacy, export/deletion/install | Unavailable controls disclosed; destructive consequences explicit |

Plan summary always distinguishes eligible cash, total reserved, protected buffer included within reserved, available new funding, requested funding, proposed additions and unassigned remainder. Do not label unassigned as universally “safe to spend.” Reasons expand per row in human language, such as “$200 reserved for rent due before your next paycheck.” Percentages apply to remainder, not the full paycheck.

## Detailed interaction flows

Paycheck: confirm actual posted amount/date/account → receive authoritative snapshot → select next boundary → preview → edit → validate → review → acknowledge shortfalls/priority overrides → accept → show updated reservations. Confirmation says “Allocations saved. No bank money was moved.” This copy is used only after server confirmation. Mock mode instead disables save/accept and explains that nothing persists.

Workspace switch: select destination → if dirty, explain discarded draft → cancel or confirm → clear old queries/forms/details → load destination → show new identity before data. Reject late old-workspace responses. A denied destination returns to an authorized workspace without flashing cached records.

Entry: edit amount as a decimal string; validate adjacent to the field; convert once to cents. Display transaction sign/type, selected account and envelope on review. On network uncertainty show “We could not confirm the save. Retry safely” using the same request key. Avoid a success toast before confirmed persistence.

Learning: choose lesson → read objective and fictional example → optional check with explanation → mark complete regardless of answer → optional link into an unsaved budget draft. Household context does not change learning privacy. No streak penalties or shame copy.

## Components and states

AppShell, WorkspaceSwitcher, MoneyText, CashBreakdown, PayPeriodPicker, DemandTable/Row, AllocationReason, WeightEditor, ShortfallSummary, TransactionTable/Row, AmountField, GoalCard, LessonReader, StatusBanner, EmptyState, ErrorState, ConfirmationDialog and InstallHelp.

All applicable screens have loading, empty, populated, validation error, recoverable network error, offline, stale and permission-denied variants. Keep input after a recoverable error in the same authorized workspace. Focus the first invalid field, announce async outcomes, return focus after dialogs, and use native button/link/input semantics. Keyboard testing covers the entire main journey. No tooltip-only explanation or icon-only navigation.

Useful copy: “Expected income — not available yet”; “This plan leaves $150 of essential needs unfunded”; “Your budget changed. Refresh this plan before accepting”; “Sample data • Changes are not saved”; “Connect to load your budget.” Show data freshness and workspace at review, not just in a distant header.

## Review checklist

Verify reflow, zoom, long labels/amounts, focus order, screen-reader field errors, reduced motion, contrast, touch targets and bottom-bar overlap. Verify desktop/tablet/mobile screenshots of Home, Plan, Review, Activity, Learn and key empty/error states. Browser screenshots and manual observations must be recorded; a rendered component test is not visual or assistive-technology approval.
