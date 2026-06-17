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
