# Domain Model — Nilou Personal Assistant

> Status: Draft v0.1 · Owner: Architecture · Last updated: 2026-06-16
>
> This is the source of truth for *what the system tracks and how the money math
> works*. The product brief describes *why* and *for whom*; this document
> describes the entities, rules, and invariants. When code and this doc disagree,
> fix one of them — don't let them drift.

---

## 1. Purpose

Nilou runs several small cash-based businesses and shares a household with her
mother. She needs one place on her phone to:

1. Record **income** from each business and see what she actually earned.
2. Record **expenses** and know **who owes what** (her, the household, or Mom).
3. Track **credit accounts** (12 cards + lines of credit) and never miss a **due date**.
4. Get **reminders** (in-app and optionally on Google Calendar).

The app is bookkeeping and reminders only. It records money that has already
moved; it never moves money itself.

---

## 2. Core Concepts (Ubiquitous Language)

| Term | Meaning |
|---|---|
| **Household** | The shared home Nilou and Mom live in. The top-level tenant/scope. |
| **Person** | A human the system tracks money for: `Nilou`, `Mom`, and optionally others. |
| **Business** | A revenue activity: `Tobacco`, `CardNight`, `Dealer`, `Misc`. |
| **Income Event** | A single recorded inflow tied to a Business. |
| **Expense** | A single recorded outflow, attributed to a Payer responsibility. |
| **Payer / Responsibility** | Who is ultimately on the hook for an expense: `Nilou`, `Household` (split), or `Mom`. |
| **Settlement** | Net amount one Person owes another after attribution (e.g. "Mom owes Nilou $X"). |
| **Credit Account** | A credit card or line of credit with a balance and a recurring due date. |
| **Reminder** | A scheduled nudge (due date, recurring expense) surfaced in-app and/or on Calendar. |

---

## 3. People & Attribution

There are at least two People: **Nilou** (the owner/operator) and **Mom**.

Every **Expense** carries a `responsibility` field with one of:

- `nilou` — Nilou's own cost. No settlement.
- `mom` — Mom's cost, but often **paid by Nilou's card/cash first** → creates a
  debt: *Mom owes Nilou*.
- `household` — shared cost, **split by a configurable ratio** (default 50/50).
  Mom's share becomes *Mom owes Nilou* (when Nilou fronted it).

Each Expense also records `paid_by` (who actually fronted the money). The
**settlement** between two people is:

```
balance(Mom → Nilou) =
    Σ expenses where paid_by = Nilou AND responsibility = mom (full amount)
  + Σ expenses where paid_by = Nilou AND responsibility = household (Mom's split share)
  − Σ repayments Mom → Nilou
```

A **Repayment** is its own record (Mom hands Nilou cash / e-transfer) so the
running balance can be zeroed out and audited.

**Invariant:** an expense's responsibility split shares always sum to the full
amount. Household split ratio is stored per-household and can be overridden
per-expense.

---

## 4. Income Streams

All income produces an **Income Event** with common fields:
`id, business, occurred_on, gross, net, notes, created_at`. Each business adds
its own structured detail captured below and stored as typed columns or a JSON
`detail` payload.

### 4.1 Tobacco Resale (`Tobacco`)

Nilou buys packs at a **cost per pack** and resells at a **margin**.

- Inputs per lot: `packs`, `cost_per_pack`, `margin_pct` (default 30%).
- `sale_price_per_pack = cost_per_pack × (1 + margin_pct)`
- `revenue = packs × sale_price_per_pack`
- `cost   = packs × cost_per_pack`
- `net    = revenue − cost = packs × cost_per_pack × margin_pct`

> Example: 1 pack @ $100 cost, 30% margin → sells $130, **net $30**.

Optionally track **inventory** (packs bought vs. sold) in a later phase. MVP can
record each sale as a closed lot (bought-and-sold together).

### 4.2 Card Night (`CardNight`)

Nilou hosts a poker/card tournament for invited players and takes a **rake** per
round, then splits the night's take.

**Rake per round** (confirmed rule):

```
rake_round = max(0.10 × pot_round, 15)        # 10% of the pot OR $15, whichever is higher
```

- A **Card Night** is a session with: `date`, `players[]`, and a list of **rounds**.
- Each round records its `pot`. The app computes `rake_round` and sums them:
  `night_rake = Σ rake_round`.
- For speed, MVP may let Nilou skip per-round entry and instead enter
  `rounds_count` + `avg_pot`, computing `night_rake = rounds_count × max(0.10×avg_pot, 15)`.
  Per-round entry is the precise mode; averaged entry is the quick mode.
- **Split:** the night's rake is divided among the operating partners by a
  configurable `split_ratio` (default: 100% Nilou unless a partner is set). The
  result is Nilou's `net` for that night.

> The `max(10%, $15)` floor is the agreed formula. If the real rule turns out to
> be tiered or table-size dependent, change it **here first**, then in
> `lib/money/rake.ts`, then add a regression test.

### 4.3 Dealer Nights (`Dealer`)

On some nights Nilou's **partner is the dealer**. A dealer earns from two
sources, and Nilou splits the partner's dealer earnings with them:

- `dealer_fee` — what the dealer charges (per night or per round).
- `dealer_tips` — tips collected during the night.
- `dealer_gross = dealer_fee + dealer_tips`
- Nilou's cut: `net = dealer_gross × nilou_dealer_split` (default 50%).

Dealer income is separate from the table rake (§4.2): a single physical night can
generate **both** a `CardNight` event (the rake) and a `Dealer` event (the dealer
split). They are linked by an optional `session_id`.

### 4.4 Miscellaneous Trades (`Misc`)

Occasional buy/sell of other products. Generic structure:

- `description`, `buy_cost`, `sell_price`, `net = sell_price − buy_cost`.

---

## 5. Expenses

An **Expense** is an outflow with:
`id, occurred_on, amount, category, responsibility, paid_by, recurring, notes`.

**Categories** (extensible): `property_tax`, `utilities`, `car_lease`,
`phone`, `internet`, `inventory` (tobacco/goods purchase), `other`.

**Recurring / Fixed costs.** Some expenses recur on a cadence. A
**Recurring Expense** template carries `cadence` (monthly/quarterly/annual),
`amount`, `category`, `responsibility`, `next_due`, and a `property_id` when
property-scoped (property tax, utilities per property). The app generates concrete
Expense instances and Reminders from the template.

**Properties.** Nilou has multiple properties; each has its own property tax and
utilities. A `Property` entity (`label, address?`) lets fixed costs be grouped
and reported per property.

---

## 6. Credit Accounts & Due Dates

Nilou tracks **12 active credit cards** plus **lines of credit**, each with a
different due date.

**Credit Account** fields:
`id, name, type (credit_card | line_of_credit), last4, issuer, credit_limit,
statement_balance, current_balance, min_payment, statement_day, due_day,
autopay (bool), notes`.

- `due_day` drives recurring **Reminders** (e.g. "Card X due in 3 days").
- MVP entry is **manual**. Phase 2+ may import from **Equifax / TransUnion**
  (read-only bureau pull) to auto-populate balances/limits — modeled now as an
  optional `source = manual | equifax | transunion` field and an
  `external_ref` so the schema is forward-compatible.

**Invariant:** `current_balance ≤ credit_limit` is *expected* but not enforced
(over-limit happens); surface it as a warning, not a hard error.

---

## 7. Reminders & Calendar

A **Reminder** is generated from a due date or recurring expense:
`id, type (credit_due | expense_due | custom), source_id, fire_on, lead_days,
channel (in_app | google_calendar | both), status (scheduled | sent | dismissed)`.

- **In-app**: a "Coming up" list on the dashboard.
- **Google Calendar** (optional, opt-in): push an event / notification to Nilou's
  calendar. Two-way is out of scope for MVP; one-way push (app → calendar) first.
- Reminders are derived data: regenerated when the source (due date, cadence)
  changes. Don't hand-edit fire dates; edit the source.

---

## 8. Entity Relationship Overview

```
Household 1───* Person
Household 1───* Property
Household 1───* Business config (split ratios, defaults)

Business(Tobacco|CardNight|Dealer|Misc) 1───* IncomeEvent
CardNight Session 1───* Round            (round.pot → rake)
CardNight Session 0..1─ DealerEvent      (linked by session_id)

Person(paid_by) 1───* Expense
Expense *───1 Property (optional)
Expense.responsibility ∈ {nilou, household, mom}
RecurringExpense 1───* Expense (generated)

Person 1───* CreditAccount
CreditAccount 1───* Reminder
RecurringExpense 1───* Reminder

Settlement(Mom→Nilou) = derived from Expense + Repayment
```

---

## 9. Money Math — Reference Functions

These live in `lib/money/` and are pure, unit-tested functions. The domain
model owns their definitions:

```ts
tobaccoNet(packs, costPerPack, marginPct)      // packs*cost*margin
rakeRound(pot)            = max(0.10*pot, 15)
nightRake(pots: number[]) = sum(pots.map(rakeRound))
dealerCut(fee, tips, split=0.5) = (fee+tips)*split
miscNet(buy, sell)             = sell - buy
momOwesNilou(expenses, repayments, splitRatio) // §3 formula
```

**Rounding:** money is stored in **integer cents**; display rounds to 2 dp.
Percentages are stored as decimals (0.30, 0.10). Never store floating dollars.

---

## 10. Open Questions / Future Phases

- **Tobacco inventory**: track standing stock vs. lot-based? (MVP: lot-based.)
- **Multi-partner splits**: more than one card-night partner with different ratios.
- **Bureau import** (Equifax/TransUnion): auth, frequency, data retention.
- **Two-way calendar sync** and push notifications.
- **Other household members** beyond Nilou and Mom.
- **Tax/reporting exports** (annual summaries per business).
