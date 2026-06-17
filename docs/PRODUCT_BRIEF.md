# Product Brief — Nilou Personal Assistant

> Status: Draft v0.1 · Owner: Product · Last updated: 2026-06-16
>
> Companion to `DOMAIN_MODEL.md`. This doc covers *why, for whom, and in what
> order*. The domain model covers *the entities and the math*.

---

## 1. One-liner

A mobile-first personal finance assistant that lets Nilou record income from her
businesses, track shared/household/Mom expenses with automatic "who owes whom"
settlement, and never miss a credit-card or line-of-credit due date.

## 2. Problem

Nilou's money is spread across several cash businesses (tobacco resale, card
nights, dealer splits, occasional trades) and tangled with household costs she
shares with her mother. Today this lives in her head and scattered notes. She
misses credit-card due dates across **12 cards plus lines of credit**, and she
loses track of what Mom owes her. She needs one phone-friendly place to capture
it all and be reminded.

## 3. Target users

- **Primary: Nilou** — operator. Records income/expenses on her phone, checks
  what's owed and what's due. Power user of the app.
- **Secondary: Mom** — mostly a *subject* of records (her expenses, what she
  owes). May get a read-only view later. Not a day-one editor.

## 4. Goals & non-goals

**Goals (MVP)**
- Fast mobile capture of income per business with the right math applied automatically.
- Expense capture with payer responsibility (Nilou / Household / Mom) and a live
  "Mom owes Nilou" balance plus repayment logging.
- Credit-account registry with due dates and reminders.
- A dashboard: this-month income by business, upcoming due dates, outstanding settlements.

**Non-goals (MVP)**
- Moving money, paying bills, or executing trades. *Recording only.*
- Bank/bureau auto-import (Equifax/TransUnion) — Phase 2+.
- Multi-user editing, accountant exports, tax filing.
- Native mobile apps — this is a responsive PWA-style web app.

## 5. MVP scope (Phase 1)

1. **Auth** — Clerk sign-in; single owner account (Nilou).
2. **Income capture** for `Tobacco`, `CardNight` (with `max(10% pot, $15)` rake),
   `Dealer` split, and `Misc`, each with a tailored quick-entry form.
3. **Expense capture** with category, responsibility, and who paid.
4. **Settlements** — running "Mom owes Nilou" with repayment logging.
5. **Credit accounts** — add/edit cards & lines of credit, due dates.
6. **Reminders (in-app)** — upcoming due dates and recurring expenses on the dashboard.
7. **Dashboard** — month-to-date income by business, upcoming dues, outstanding balances.

## 6. Roadmap (later phases)

- **Phase 2 — Calendar & notifications:** one-way push of reminders to Google
  Calendar; opt-in. Optional email/push nudges.
- **Phase 3 — Bureau import:** read-only Equifax/TransUnion pull to auto-fill
  balances/limits; reconcile against manual entries.
- **Phase 4 — Reporting & inventory:** per-business and per-property summaries,
  annual exports, tobacco standing inventory, multi-partner splits.
- **Phase 5 — Mom view:** read-only access for Mom to see her balance.

## 7. Non-functional requirements

- **Mobile-first, mobile-primary.** Designed for a phone in one hand: large tap
  targets, thumb-reachable primary actions, bottom nav, minimal typing (steppers,
  presets, recent values). Must also work on desktop, but the phone is the design
  baseline.
- **Fast capture.** Logging an income or expense should take seconds.
- **Offline-tolerant later.** Not required for MVP but schema/UX shouldn't block it.
- **Private & secure.** Personal financial data; Clerk-gated, least-data principle.
- **Accurate money math.** Integer-cent storage, unit-tested money functions
  (see domain model §9).

## 8. Tech stack (agreed)

- **Framework:** Next.js (App Router) deployed on **Vercel**.
- **Auth:** **Clerk**.
- **Database:** **Postgres** (Neon/Supabase) via Drizzle ORM.
- **Styling:** Tailwind CSS, mobile-first.
- **Integrations:** Google Calendar (Phase 2), Equifax/TransUnion (Phase 3).
- **Infra options available:** Cloudflare (DNS/edge), Vercel (hosting), Clerk (auth).

## 9. Success criteria

- Nilou logs at least a week of real income/expenses without reaching for notes.
- She can answer "what does Mom owe me?" and "what's due this week?" in one tap.
- Zero missed due dates across the 12 cards + lines of credit once reminders are on.

## 10. Team (AI agents)

Defined in `.claude/agents/`. Four roles drive delivery:

- **Product Owner / Scrum Master** — backlog, priorities, acceptance criteria.
- **UI/UX Designer** — mobile-first flows, components, visual system.
- **Senior Architect / Developer** — stack, schema, implementation.
- **QA Engineer** — test plans, money-math verification, regression safety.
