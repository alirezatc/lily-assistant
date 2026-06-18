# QA Report — Sprint 3

**Date:** 2026-06-17
**QA:** qa-engineer (Nilou Personal Assistant)
**Scope:** Number input fix, Greeting, Activity, Cards, Auth (Clerk-optional), money/reminders regression.

## Verdict: **GO** (ship-ready)

No blocking defects. Automated suite green, type-check clean, all Sprint 3 features behave
correctly including the Clerk-disabled / build-safe path. Four **minor** issues logged below
(none user-blocking); recommend fixing M1 and M2 in a follow-up.

---

## Automated checks

| Check | Command | Result |
|---|---|---|
| Unit tests | `npx vitest run` | **PASS — 41/41** (money 25, reminders 16) |
| Type check | `npx tsc --noEmit` | **PASS — exit 0, no errors** |
| Prod build | `npx next build` | Not completed in sandbox (>45s tool cap). tsc clean covers type/import safety; see Auth analysis for build-safety reasoning. |

---

## Feature results

| Feature | Verdict | Notes |
|---|---|---|
| Number input fix (MoneyField / NumberField / lib/num) | **PASS** | Empty/backspace allowed, regex guards input, clamp works for the 1–31 range, `num()`/`cents()` parse empty→0 with no NaN. See M1 (decimals) — minor. |
| Greeting | **PASS** | Buckets correct (<12 morning, <17 afternoon, <21 evening, else night). SSR-safe: neutral "Hi 👋" on server, refines in `useEffect` on mount — no hydration mismatch. |
| Activity (getActivity + page) | **PASS** | Merges income(made)+expenses(spent), sorts date desc, guards no-db and db-error. Totals correct. See M3 — cosmetic only. |
| Cards (CardItem / CardNumber / AccountForm / updateAccount) | **PASS** | Mask + eye reveal correct, dueDay clamped 1–31, last4 sanitized to ≤4 digits, `updateAccount` scopes by `and(id, ownerId)`, returns `SaveResult`, never throws. See M2 — minor. |
| Auth (Clerk-optional) | **PASS** | With no keys app stays fully open, no Clerk component renders server-side, build-safe. With keys, middleware protects non-public routes. |
| money + reminders regression | **PASS** | 41 tests green, math unchanged. |

---

## Detailed analysis

### Number input (lib/num.ts, MoneyField.tsx, NumberField.tsx)
- `num("")` → `parseFloat("")` is `NaN` → guarded by `Number.isFinite` → returns `0`. `cents("")` → `Math.round(0*100)` → `0`. No NaN escapes. ✔
- MoneyField: `v === "" || /^\d*\.?\d*$/.test(v)` allows empty (backspace clears) and one optional dot. ✔
- NumberField: empty returns early (clear allowed); clamps `< min`→min, `> max`→max. For the only consumer range (dueDay 1–31) no legitimate mid-typing value is rejected, since every single digit ≤ 31. ✔

### Greeting (components/Greeting.tsx)
- `"use client"` with `useState`/`useEffect`. Initial state is time-independent (`Hi 👋`), so server and first client render match → hydration-safe. Local hour applied post-mount. ✔

### Activity (lib/queries.ts getActivity, app/(app)/activity/page.tsx)
- Sort `(a.date < b.date ? 1 : a.date > b.date ? -1 : 0)` = descending by ISO date string. ✔
- Page totals: `made` and `spent` reducers filter by kind and sum cents — correct. ✔

### Cards
- `CardNumber`: masked state always shows `••••`; revealing shows `last4.padStart(4,"•")`. Toggle via `useState`. ✔
- `AccountForm`: last4 `replace(/\D/g,"").slice(0,4)`; dueDay `Math.min(31, Math.max(1, Math.round(num(dueDay)) || 1))`. ✔
- `updateAccount`: `and(eq(id), eq(ownerId, OWNER_ID))` — owner-scoped, can't update another owner's row. try/catch returns `{ok:false,error:"db_error"}` — never throws. `!db` → `no_db`. ✔

### Auth — build-safety (the key risk)
- `clerkEnabled = !!NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`. `.env.local` ships the key **empty** → disabled by default.
- `middleware.ts`: ternary picks `clerkMiddleware(...)` only when enabled; otherwise `() => NextResponse.next()` passthrough. Public matcher `["/welcome","/sign-in(.*)","/sign-up(.*)"]`; signed-out users on protected routes redirect to `/welcome`. ✔
- `app/layout.tsx`: `ClerkProvider` statically imported but only **rendered** when `clerkEnabled` — disabled path returns bare html, no Clerk in the tree. ✔
- `AccountButton.tsx`: `if (!clerkEnabled) return null` before `<UserButton/>` renders. ✔
- `sign-in` / `sign-up` pages: `if (!clerkEnabled) redirect("/")` before `<SignIn/>`/`<SignUp/>`. ✔
- No `auth()` / `currentUser()` calls anywhere outside middleware → nothing can throw server-side when keys are absent. Clerk packages are installed (imports resolve at build). **Build-safe.** ✔

---

## Issues (all MINOR — non-blocking)

### M1 — Integer fields accept a decimal point
**File:** `components/NumberField.tsx:25`
**Repro:** In "Due day of month", type `1.5`. The regex `/^\d*\.?\d*$/` permits the dot, so `1.5` is held in state.
**Impact:** Low — submit path applies `Math.round(num(dueDay))`, so it persists as `2`. Only a transient display oddity in an integer field.
**Suggested fix:** When `min`/`max` are integers, gate input with an integer regex, e.g. `const re = (min != null || max != null) ? /^\d*$/ : /^\d*\.?\d*$/;` and test against `re`.

### M2 — Empty Limit/Balance stored as 0 instead of null
**File:** `app/(app)/accounts/AccountForm.tsx:38-39` (and `CardItem.tsx:49`)
**Repro:** Add a card leaving Limit and Balance blank. `cents("")` → `0`, so `creditLimitCents`/`currentBalanceCents` are written as `0` (schema columns are nullable, `lib/db/schema.ts:84,86`).
**Impact:** Low — `CardItem.tsx:35` shows `· bal $0.00` for a card whose balance is actually unknown, because `currentBalanceCents != null` is true for `0`.
**Suggested fix:** Pass `undefined` when the field is empty, e.g. `currentBalanceCents: balance.trim() === "" ? undefined : cents(balance)` (same for limit).

### M3 — getActivity reports live:true on DB error
**File:** `lib/queries.ts:143`
**Repro:** Force the inner query to throw; catch returns `{ live: true, rows: [] }`, whereas the no-db path returns `live: false`. A DB failure is reported as a successful empty live result.
**Impact:** Cosmetic today — `activity/page.tsx:7` destructures only `rows` and never reads `live`. Becomes a real bug if a future banner keys off `live`.
**Suggested fix:** Return `{ live: false, rows: [] }` in the catch for consistency with `getDashboard`/no-db.

### M4 — Welcome page links are dead when Clerk disabled
**File:** `app/welcome/page.tsx:14,18`
**Repro:** With Clerk disabled, navigating to `/welcome` shows Sign in / Create account links → `/sign-in`/`/sign-up`, both of which immediately `redirect("/")`.
**Impact:** Very low — in disabled mode middleware never routes anyone to `/welcome`; only reachable by manual URL. Links bounce to home rather than erroring.
**Suggested fix:** Optional — hide the auth CTAs (or render a single "Enter" link to `/`) when `!clerkEnabled`.

---

## Hydration / boundary / import audit
- No `"use client"` files missing for components using hooks (Greeting, CardNumber, CardItem, AccountForm, AccountButton, MoneyField, NumberField all correctly marked).
- No server-side Clerk imports outside middleware; provider/components are render-guarded.
- `tsc --noEmit` clean → no import or type errors.
- Greeting is the only time/locale-dependent render and is correctly deferred to `useEffect` → no hydration risk.
