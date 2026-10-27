> **SmartBudget 2.0 direction (October 27, 2026):** The canonical product is now a web-first responsive SaaS/PWA. Use [the 2.0 specifications](docs/smartbudget-2.0/README.md), [web architecture decision](docs/ADR_WEB_FIRST.md), and [web foundation plan](docs/WEB_FOUNDATION_PLAN.md). Native-first instructions below describe the preserved Expo prototype and do not authorize rebuilding it. The web package lives in `web/`. The first 2.0 foundation task is implemented; see [verification](docs/WEB_FOUNDATION_VERIFICATION.md). Later engine/backend phases require a new request.

# UI/UX design system

## Direction

Light first, calm, clear, and encouraging. Forest green communicates primary actions; warm neutrals make dense financial information approachable. Never celebrate overspending or use shame-based alerts. Dark mode is deferred; central tokens must permit future themes.

## Tokens

| Token | Value | Usage |
| --- | --- | --- |
| background | #F7F8F4 | App canvas |
| surface | #FFFFFF | Cards, sheets |
| surfaceMuted | #EDF2EB | Secondary sections |
| primary | #174D38 | Primary buttons, active tabs |
| primaryPressed | #103B2B | Pressed action |
| onPrimary | #FFFFFF | Text on primary |
| text | #17251C | Headings and body |
| textSecondary | #4E6255 | Supporting copy |
| border | #CED8CE | Decorative dividers |
| controlBorder | #738477 | Interactive field boundary |
| warningText / warningSurface | #754400 / #FFF1D6 | Needs attention |
| dangerText / dangerSurface | #A12622 / #FDECE9 | Blocking errors |
| successText / successSurface | #1A583C / #E8F3E9 | Confirmations |
| focus | #275DAD | Visible focus indicator |

Use primary/text colors for meaningful labels. Decorative border alone is not sufficient to identify controls. Verify rendered contrast for each actual pair: WCAG AA 4.5:1 normal text, 3:1 large text and meaningful UI graphics. Color never carries status alone.

System sans-serif is the baseline (native platform system font); no remote font dependency. Type sizes: display 32/40, title 24/32, section 20/28, body 16/24, label 14/20, caption 12/18. Use tabular numerals for aligned money. Keep essential text ≥14; support system scaling without clipping. Bold balances, not every number.

Spacing scale: 4, 8, 12, 16, 24, 32, 48. Screen gutters 20 (16 on compact widths). Card radius 16; field/button radius 12; chips 999. Buttons minimum height 48. Cards use subtle border; shadows are optional and must not encode hierarchy alone. Content max width 720 on wide screens; use safe areas and scrollable layouts. Respect reduced motion; animations 150–220ms, no essential information conveyed only by animation.

## Navigation contract

Expo Router proposed routes (verify supported package APIs during foundation):

| Tab | Route | Main purpose |
| --- | --- | --- |
| Home | /(tabs)/index | Current workspace, available-to-assign, next pay, urgent needs, plan preview |
| Plan | /(tabs)/plan | Pay-period selector, funding waterfall, envelopes, recommendation review |
| Activity | /(tabs)/activity | Search/filter transactions, add entry, account context |
| Goals | /(tabs)/goals | Progress, target detail, contribution intent |
| Learn | /(tabs)/learn | Academy path, resume lesson, completed lessons |

Root stack routes: /settings, /household, /onboarding, /plan-review, /transaction/new, /goal/[id], /lesson/[slug]. Workspace switcher appears at the top of every tab; personal/household label persists on entry forms and confirmation sheets. Switching clears sensitive stacked views and unsaved forms after a discard warning. Never merge contexts silently. Authentication routes arrive with the backend phase.

## Screen layouts

- Home: greeting/workspace header → available-to-assign summary and data freshness → next payday card → essential shortfall notice → primary “Review this paycheck” → brief goal and lesson cards. Avoid counting reserved cash as spendable.
- Plan: date interval → eligible cash/protected/reserved breakdown → editable demand rows grouped by priority → unassigned total → sticky “Review plan” button. Detail explains why each amount was chosen.
- Plan review: full totals, changed allocations, unmet obligations, user overrides, acknowledgment checkbox when necessary, “Accept allocations” confirmation. Mock foundation uses an explanatory disabled action.
- Activity: workspace label → account and period filters → date-grouped transaction rows → accessible add button. Show amount sign and transaction type; transfers are labeled.
- Goals: cards with current reserve/target/date → goal detail → optional contribution form in later phases. Progress label remains understandable without a colored bar.
- Learn: “Continue learning” → short lesson path with duration → topic list → lesson reader with examples, optional check, takeaway and “Mark complete.”
- Household: membership/roles → invite state → shared ledger explanation → leave/transfer ownership controls in later phases. No private account previews.
- Settings: preferences, privacy, accessibility, account/export/deletion placeholders with explicit availability labels during foundation.

## Component inventory

AppScreen, WorkspaceSwitcher, MoneyText, SummaryCard, PayPeriodPicker, EnvelopeRow, TransactionRow, GoalCard, LessonCard, PrimaryButton, TextField, AmountField, StatusBanner, EmptyState, LoadingSkeleton, ErrorState, ConfirmationSheet, TabIconLabel. Components use semantic tokens and expose accessibility labels, hints, disabled/loading states, and test IDs only where useful.

AmountField edits a decimal string, validates at most two fraction digits, then converts once to cents; never parse currency with floating-point multiplication. MoneyText receives cents and currency, not raw strings. Inline errors stay adjacent to fields and are announced to assistive technology. Charts include a textual equivalent.

## State and copy rules

Every screen needs loading, empty, populated, recoverable error, and permission-denied states where applicable. Mock mode displays “Sample data • Changes are not saved.” Distinguish expected income from available cash. Use “This plan leaves $150 of needs unfunded” and a clear next action. Destructive actions require concrete consequences and confirmation. Academy prompts are optional and never obstruct paying bills or saving a plan.

## Design acceptance

Verify small phone and large font layouts, screen-reader traversal, reduced motion, keyboard focus in web preview, safe-area insets, touch areas, contrast, and workspace identity on all mutations. Phase 1 must show representative empty/error/sample states and all five tabs without pretending unavailable features work.

## User-requested appearance update (October 27, 2026)

The responsive web header now uses a named profile disclosure containing Switch workspace and an accessible light/dark appearance switch. Light is the default; the theme preference persists independently of financial data. Until authentication exists, Alex Morgan is labelled as a sample profile. Both palettes use shared semantic color tokens; menu dismissal and focus restoration work with pointer and keyboard input.
