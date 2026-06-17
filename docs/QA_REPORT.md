# QA Report — Nilou Personal Assistant

> QA Engineer · Date: 2026-06-16 · Sprints under test: S1 (Capture & compute), S2 (Cards & reminders)
> Sources of truth: `DOMAIN_MODEL.md` §9 (money math), `PRODUCT_BRIEF.md` (scope), `BACKLOG.md` (AC).

---

## Verdict: **GO (conditional)**

The money math is correct and fully verified, the unit suite is green, types compile, and
every Sprint-1/Sprint-2 (UI-complete) feature behaves to its acceptance criteria. **All money
tests are green — no red money path.**

The single material risk is **not a money bug**: the database **read** layer (`getDashboard`,
`getAccounts`, and the inline query in `SettlementsPage`) has **no error handling and no
`error.tsx` boundary**, so a *reachable-but-failing* DB connection throws an unhandled error →
HTTP 500 on `/`, `/accounts`, and `/settlements`. The write actions were hardened against this
(try/catch → `SaveResult`); the read paths were not. This is the **same class of bug** the
prior 500 fix targeted, relocated from writes to reads. It does **not** affect pure demo mode
(no `DATABASE_URL`). See FAIL-1.

Recommendation: ship demo/MVP as-is; **fix FAIL-1 before pointing the app at a live Neon DB**
(which `.env.local` currently does).

---

## Test execution (exact counts)

| Command | Result |
|---|---|
| `npx vitest run` | **41 passed / 41** (2 files: `lib/money/index.test.ts` 25, `lib/reminders/dates.test.ts` 16). 0 failed. |
| `npx tsc --noEmit` | **0 type errors** (exit 0). |
| `npx next build` | Compiled & loaded `.env.local`; **no errors emitted** before the 40s harness timeout (build is slow, not broken). |

---

## Money math — independent hand-verification

All recomputed by hand in integer cents and cross-checked by executing `lib/money/index.ts`
and `lib/reminders/dates.ts` directly. Every value matched the code.

| Case | Hand calc | Code output | Match |
|---|---|---|---|
| `tobaccoNet(1, $100, 30%)` | 1×10000×0.30 = **3000¢ ($30)** | 3000 | ✅ |
| `rakeRound` pot $100 | max(1000,1500)=**1500¢ ($15)** floor | 1500 | ✅ |
| `rakeRound` pot $150 (boundary) | max(1500,1500)=**1500¢ ($15)** | 1500 | ✅ |
| `rakeRound` pot $500 | max(5000,1500)=**5000¢ ($50)** | 5000 | ✅ |
| `dealerCut($100,$40,50%)` | (10000+4000)×0.5=**7000¢ ($70)** | 7000 | ✅ |
| `momOwesNilou` $100 household, Nilou paid | 10000×0.5=**5000¢ ($50)** | 5000 | ✅ |
| `momOwesNilou` $50 mom, Nilou paid | **5000¢ ($50)** | 5000 | ✅ |
| `momOwesNilou` − $20 repayment | 5000−2000=**3000¢ ($30)** | 3000 | ✅ |
| `nextDueDate(31, Jun 16)` | clamp 31→**Jun 30** | Tue Jun 30 2026 | ✅ |
| `nextDueDate(31, Feb 10 2026)` | clamp 31→**Feb 28** | Sat Feb 28 2026 | ✅ |
| `daysUntilDue(31, Feb 10 2026)` | Feb28−Feb10 = **18** | 18 | ✅ |
| `formatCents(-1)` (neg rounding) | **-$0.01** | -$0.01 | ✅ |
| odd household share 333¢×0.5 | round(166.5)=**167¢** (half-up) | 167 | ✅ |

Integer-cent storage is honored throughout (`schema.ts` uses `integer` columns; percentages
stored as basis points / decimals). No float drift observed.

---

## Feature coverage

| Area | Feature / AC | Result | Notes |
|---|---|---|---|
| Dashboard `/` | Demo path (no DB) returns sample figures | PASS | `getDashboard` returns `live:false` block. |
| Dashboard `/` | Live path: month-to-date by business, "Mom owes", "Due this week" | PASS (logic) | MTD filter `occurredOn >= monthStart`; momOwes via `momOwesNilou`; dueSoon `<=7d` + sorted asc. See FAIL-1 for the unguarded-throw risk. |
| Dashboard `/` | Total = sum of business cards | PASS | `reduce` over `monthByBusiness`. |
| Income `/income` | S1-1 CardNightForm live rake `max(10% pot,$15)`/round | PASS | `nightRakeAveraged(rounds, avgPotC)`. |
| Income | S1-2 TobaccoForm net=packs×cost×margin, sale=cost×(1+m) | PASS | Live preview + "Sells at …/pack". |
| Income | S1-3 DealerForm cut=(fee+tips)×split, default 50% | PASS | |
| Income | S1-4 MiscForm net=sell−buy, negative shows as loss | PASS | `ResultBanner` renders red when `cents<0`. |
| Income | Graceful save when DB absent; disabled while pending | PASS | `useSubmit` shows "Not saved — database isn't connected"; button `disabled={pending}`. |
| Expenses `/expenses` | S1-5 responsibility (nilou/household/mom), paidBy, live "Adds to Mom owes" | PASS | Live `momOwesNilou` single-record preview; household note shows 50%. |
| Expenses | Graceful save, disabled-pending | PASS | |
| Settlements `/settlements` | Balance = momOwesNilou(expenses, repayments) | PASS (logic) | See FAIL-1: inline query unguarded. |
| Settlements | RepaymentForm graceful save | PASS | Demo: action returns `no_db`; success text "Repayment recorded ✓". |
| Accounts `/accounts` | S2-1 AccountForm add card / line of credit | PASS | |
| Accounts | Due-day clamp to 1–31 | PASS | `Math.min(31, Math.max(1, n))` on change. |
| Accounts | last4 sanitization (digits only, ≤4) | PASS | `.replace(/\D/g,"").slice(0,4)` + `maxLength`. |
| Accounts | List rendering + due-in-days | PASS (logic) | Sorted by dueDay; `daysUntilDue`. See OBS-1. |
| Accounts | S2-2 "Due this week" from dueDay + today | PASS | `daysUntilDue <= 7`, sorted. |
| `lib/queries.ts` | Guards when `db` undefined | PARTIAL | `getDashboard`/`getAccounts` guard the `!db` case, but do **not** guard a *throwing* db (FAIL-1). |
| `lib/queries.ts` | MTD filtering, due-soon `<=7d` + sort | PASS | |
| `lib/actions/*` | All return `SaveResult`, never throw raw | PASS | income/expense/repayment/account all try/catch → `{ok}|{error}`. **Write-side 500 bug structurally fixed.** |
| Mobile | `max-w-md` container | PASS | `app/layout.tsx` body + `BottomNav`. |
| Mobile | Bottom nav, 5 thumb-reachable items | PASS | `components/BottomNav.tsx`, fixed bottom, safe-area inset. |
| Mobile | ≥44px tap targets | PASS | Buttons/inputs use `p-3` + `text-lg` (≈48px); nav items `py-2`+icon. |
| Mobile | `inputMode` on numeric fields | PASS | `inputMode="numeric"/"decimal"` on packs/rounds/pot/limit/balance/dueDay/last4 + `MoneyField`. |

S1-6 (settlement engine), S1-7 (persistence wiring), S1-8 (test suite) — all PASS via the
unit suite and code review. S2-3/S2-4/S2-5 (recurring expenses, reminders list, properties)
are **not yet implemented in UI** (schema exists); out of scope for this build, not failures.

---

## FAILURES

### FAIL-1 (High) — DB **read** paths can throw a raw 500; no error boundary

- **Where:** `lib/queries.ts` `getDashboard` (lines ~36–66) and `getAccounts` (lines ~69–73);
  `app/(app)/settlements/page.tsx` inline query (lines ~13–27). No `app/**/error.tsx` exists.
- **What:** The write actions were hardened (try/catch → `SaveResult`), but the read/query
  layer was not. The `db` guard only handles `db === undefined`. When `DATABASE_URL` **is**
  set (it is — `.env.local` points at a live Neon URL), `db` is truthy and the pages run
  `await db.select()...`. If that query rejects (host unreachable, bad creds, SSL, timeout),
  the rejection is **unhandled** → Next.js returns **HTTP 500** with no recovery UI on `/`,
  `/accounts`, and `/settlements`. This is the *same failure mode* as the prior write-side 500
  bug, just on the read side.
- **Repro:**
  1. Keep `.env.local` `DATABASE_URL` set (current state) but make the DB unreachable
     (offline, or point at a dead host — e.g. mangle the password).
  2. `npm run build && npm start`; open `/`. → 500, not a graceful "couldn't load" state.
  3. Contrast: remove `DATABASE_URL` entirely → demo mode renders fine.
- **Suggested fix:** Wrap each read in try/catch and fall back to safe defaults (e.g.
  `getDashboard` → return the demo/empty block with `live:false`; `getAccounts` → `[]`;
  settlements → `balance:0, configured:false`), **and** add an `app/(app)/error.tsx` boundary
  as defense-in-depth. Mirror the `SaveResult` discipline already used in `lib/actions/*`.

---

## Observations / minor (non-blocking)

- **OBS-1 — Demo mode is OFF with current `.env.local`.** `lib/db/index.ts` treats *any*
  truthy `DATABASE_URL` as "connected", so `DemoBanner` hides and the dashboard shows **live**
  (currently empty/zero) figures instead of the sample numbers, the moment that env file is
  present — even before migrations have run. If the URL is a placeholder rather than a working
  DB, this directly triggers FAIL-1. Consider gating "live" on a successful connection, or
  document that `.env.local` must point at a migrated DB.
- **OBS-2 — Negative / non-integer free-text input not clamped.** Number inputs (packs,
  rounds, margin %, split %, amounts) accept negatives and arbitrary values via keyboard.
  e.g. `packs = -2` yields a negative "Net profit"; `rounds = -1` yields negative rake;
  `margin % = 1000` computes a 10× net. The math is *correct for the inputs given*, but there
  is no validation/min on these fields (only dueDay is clamped). Low risk for a single trusted
  operator; worth a `min={0}` and basic sanity bounds for robustness.
- **OBS-3 — `rakeRound(0)` returns the $15 floor by design** ("a played round still rakes the
  floor"). Matches the domain note. Confirmed intentional, not a bug — flagging only so the
  rule stays visible: an empty/zero pot still contributes $15 to night rake.
- **OBS-4 — ExpenseForm does not expose a custom household split.** It always uses the 50%
  default (no per-expense override UI), though the schema (`householdMomShareBp`) and
  `momOwesNilou` both support an override. Fine for MVP; the override is simply not reachable
  from the UI yet.
- **OBS-5 — `category.replace("_"," ")` only replaces the first underscore** (e.g.
  `property_tax` → "property tax" is fine, but any 2-underscore category would keep the
  second). No current category has two underscores, so cosmetic-only today.

---

## Sign-off

- Money correctness: **VERIFIED** (41/41 tests green; 13 cases hand-checked).
- Types: **CLEAN** (`tsc --noEmit` exit 0).
- Sprint-1 AC: **MET**. Sprint-2 implemented stories (S2-1, S2-2): **MET**.
- Blocking issue for **live** deployment: **FAIL-1** (read-path 500). Non-blocking for demo.

**Verdict: GO for demo/MVP review; fix FAIL-1 before connecting a live database.**
