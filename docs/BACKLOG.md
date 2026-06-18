# Backlog & Sprint Plan — Nilou Personal Assistant

> Owner: Product Owner / Scrum Master · Updated: 2026-06-16
> Source of truth: `PRODUCT_BRIEF.md` (scope) + `DOMAIN_MODEL.md` (math).

Personas: **Nilou** (primary operator), **Mom** (subject; later read-only).

---

## Release plan

| Phase | Theme | Sprints |
|---|---|---|
| **1 (MVP)** | Capture + settle + due dates | S1, S2, S3 |
| 2 | Google Calendar push, notifications | S4 |
| 3 | Equifax/TransUnion import | S5+ |
| 4 | Reporting, inventory, multi-partner | later |
| 5 | Mom read-only view | later |

---

## Sprint 1 — "Capture & compute" ✅ (this sprint)

Goal: Nilou can capture income for every business and expenses with correct,
live-previewed math; the data model and settlement logic are implemented and tested.

- **S1-1 — Card-night capture.** *As Nilou, I want to log a card night and see the
  rake instantly, so I trust the number.*
  - Given rounds + average pot, When I type, Then rake = `max(10% pot, $15)`/round
    updates live. ✅ (`CardNightForm`)
- **S1-2 — Tobacco capture.** *…log a tobacco lot and see net profit.*
  - Given packs, cost/pack, margin (default 30%), Then net = packs×cost×margin
    shown live; sale price = cost×(1+margin). ✅ (`TobaccoForm`)
- **S1-3 — Dealer capture.** *…log my partner's dealer night and my split.*
  - Given fee, tips, split (default 50%), Then my cut = (fee+tips)×split live. ✅ (`DealerForm`)
- **S1-4 — Misc capture.** *…log a one-off buy/sell trade.*
  - Given buy + sell, Then net = sell−buy live (negative = loss). ✅ (`MiscForm`)
- **S1-5 — Expense capture.** *…record an expense and say who's responsible.*
  - Given amount, category, responsibility (Nilou/Household/Mom), paidBy, Then the
    form previews how much this adds to "Mom owes you". ✅ (`ExpenseForm`)
- **S1-6 — Settlement engine.** *…see what Mom owes me.*
  - `momOwesNilou` implemented + unit-tested across full/half/repayment cases. ✅
- **S1-7 — Persistence layer.** Drizzle schema + server actions for income,
  expense, repayment, credit accounts (run once `DATABASE_URL` is set). ✅ wiring
- **S1-8 — Money + reminder math tests.** Vitest suite green. ✅

DoD: forms render mobile-first at 375px, money tests green, docs in sync.

---

## Sprint 2 — "Cards & reminders"

Goal: the 12 cards + lines of credit live in the app and Nilou never misses a due date.

- **S2-1** Credit-account CRUD UI (add/edit/list, due day, limit, balance).
- **S2-2** Dashboard "Due this week" computed from `dueDay` + today.
- **S2-3** Recurring expenses (property tax, utilities per property, phone, internet)
  with cadence + next-due; auto-generate upcoming instances.
- **S2-4** In-app reminders list with lead-days; dismiss/mark paid.
- **S2-5** Properties CRUD; group fixed costs per property.

## Sprint 3 — "Live data & polish"

- **S3-1** Connect Neon Postgres; migrate; replace demo dashboard figures with
  real month-to-date queries by business.
- **S3-2** Repayment flow UI (Mom pays Nilou → balance drops).
- **S3-3** Empty/loading/error states; offline-tolerant capture queue (stretch).
- **S3-4** End-to-end smoke test of capture → dashboard.

## Sprint 4 — "Calendar"

- **S4-1** Google OAuth (opt-in).
- **S4-2** One-way push of due-date/recurring reminders to Google Calendar.

## Phase 3+ (later)

- Equifax/TransUnion read-only import → auto-fill balances/limits (`source`/`external_ref` already in schema).
- Reporting/exports, tobacco standing inventory, multi-partner splits, Mom read-only view.

---

## Definition of Done (every story)
AC met · money paths unit-tested · usable at 375px width · no regressions ·
docs updated if the model changed · the app never moves money.

---

## Sprint 3 — "Make her love opening it" ✅ (shipped)

Product Owner ordering (delivered): UX pain first, then delight, then security.

- **S3-1 — Fix numeric inputs.** String-based MoneyField/NumberField; empty/backspace works; no stuck `0`. ✅
- **S3-2 — Time-based greeting.** Good morning/afternoon/evening/night, local time. ✅
- **S3-3 — Feminine redesign.** Rose/pink palette, Quicksand font, soft cards, pink favicon, modern lucide icons replacing emoji nav. ✅
- **S3-4 — Activity table.** Income (made) + expenses (spent) merged, newest first; made/spent totals. ✅
- **S3-5 — Cards upgrade.** Per-card nickname, edit existing cards, masked number `•••• •••• •••• 1234` with eye reveal. ✅
- **S3-6 — Login + splash (Clerk).** Splash + sign-in/up; conditional so the app stays open until Clerk keys are set; protects all routes once enabled. 2FA-ready. ✅

QA: GO, 41/41 tests, tsc clean; 4 minor items, 3 fixed (blank balance→unknown, integer-only day field, activity error flag).

## Sprint 4 — "Connected & secure" (next)

- **S4-1 — Turn on Clerk** (needs free Clerk account + 2 keys in Vercel) → enforce login.
- **S4-2 — Two-factor auth** (toggle on in Clerk once live).
- **S4-3 — Google Calendar** push for due-this-week (Google OAuth) so she gets phone notifications.
- **S4-4 — Editable business names** (settings store + migration): rename "Tobacco" → anything; dashboard/income labels follow. (User said "in the future".)
- **S4-5 — Activity date-range filter** (date picker).
- **S4-6 — Optional encrypted full card number** storage (only if she wants it; security-reviewed).
- **S4-7 — Recurring fixed costs** per property (property tax/utilities) with auto due reminders.
