# QA Report — Multi-Tenant Data Isolation Audit

**App:** Nilou Personal Assistant
**Scope:** Verify every DB read/write is scoped to the signed-in user via `getOwnerId()` (Clerk userId, or `"demo"` when auth disabled).
**Date:** 2026-06-18
**Auditor:** QA Engineer (no code changed — test & report only)

## VERDICT: ✅ GO

No data-isolation leaks found. Every database operation is scoped to `await getOwnerId()`. Writes set/filter `ownerId`; reads filter `ownerId`; `updateAccount` is IDOR-safe (WHERE includes `ownerId`); the old `OWNER_ID` constant is fully gone from `lib/` and `app/`.

## 1. Build & Test Gates

| Gate | Command | Result |
|---|---|---|
| Unit tests | `npx vitest run` | ✅ 2 files, **41/41 passed** (`lib/reminders/dates.test.ts` 16, `lib/money/index.test.ts` 25) |
| Type check | `npx tsc --noEmit` | ✅ **exit 0**, no errors |

## 2. Old `OWNER_ID` Constant Removal

✅ **Fully replaced.** Grep across the repo found zero occurrences in `lib/` or `app/`. The only hit is a stale mention inside historical doc text (`docs/QA_REPORT_SPRINT3.md:55`), which is not live code.

## 3. DB Operation Scoping Matrix

Every `db.select|insert|update|delete` in the codebase (`**/*.ts`) is listed — there are no operations outside this table.

| File:Line | Operation | Table | Scoping | Status |
|---|---|---|---|---|
| lib/actions/income.ts:20 | INSERT (saveIncome) | income_events | `ownerId: await getOwnerId()` | SCOPED ✓ |
| lib/actions/expense.ts:22 | INSERT (saveExpense) | expenses | `ownerId: await getOwnerId()` | SCOPED ✓ |
| lib/actions/expense.ts:43 | INSERT (saveRepayment) | repayments | `ownerId: await getOwnerId()` | SCOPED ✓ |
| lib/actions/account.ts:25 | INSERT (saveAccount) | credit_accounts | `ownerId: await getOwnerId()` (spread cannot override) | SCOPED ✓ |
| lib/actions/account.ts:48 | UPDATE (updateAccount) | credit_accounts | WHERE `and(eq(id), eq(ownerId, getOwnerId()))` — **IDOR-safe** | SCOPED ✓ |
| lib/actions/settings.ts:12 | SELECT (saveBusinessLabels) | settings | WHERE `eq(ownerId, getOwnerId())` | SCOPED ✓ |
| lib/actions/settings.ts:14 | UPDATE (saveBusinessLabels) | settings | WHERE `eq(ownerId, getOwnerId())` | SCOPED ✓ |
| lib/actions/settings.ts:17 | INSERT (saveBusinessLabels) | settings | `ownerId` set to getOwnerId() | SCOPED ✓ |
| lib/queries.ts:40 | SELECT (getDashboard) | income_events | WHERE `eq(ownerId, getOwnerId())` | SCOPED ✓ |
| lib/queries.ts:51 | SELECT (getDashboard) | expenses | WHERE `eq(ownerId, getOwnerId())` | SCOPED ✓ |
| lib/queries.ts:53 | SELECT (getDashboard) | repayments | WHERE `eq(ownerId, getOwnerId())` | SCOPED ✓ |
| lib/queries.ts:63 | SELECT (getDashboard) | credit_accounts | WHERE `eq(ownerId, getOwnerId())` | SCOPED ✓ |
| lib/queries.ts:85 | SELECT (getAccounts) | credit_accounts | WHERE `eq(ownerId, getOwnerId())` | SCOPED ✓ |
| lib/queries.ts:97 | SELECT (getSettlementBalance) | expenses | WHERE `eq(ownerId, getOwnerId())` | SCOPED ✓ |
| lib/queries.ts:99 | SELECT (getSettlementBalance) | repayments | WHERE `eq(ownerId, getOwnerId())` | SCOPED ✓ |
| lib/queries.ts:140 | SELECT (getActivity) | income_events | WHERE `eq(ownerId, getOwnerId())` | SCOPED ✓ |
| lib/queries.ts:142 | SELECT (getActivity) | expenses | WHERE `eq(ownerId, getOwnerId())` | SCOPED ✓ |
| lib/settings.ts:18 | SELECT (getBusinessLabels) | settings | WHERE `eq(ownerId, getOwnerId())` | SCOPED ✓ |

**LEAKS: 0**

### IDOR note (updateAccount — the highest-risk path)
`updateAccount(input)` destructures `const { id, ...rest } = input` and writes `set(rest)` with `WHERE and(eq(id), eq(ownerId, getOwnerId()))`. A user passing another user's account `id` matches zero rows (the `ownerId` predicate fails), so the update is a no-op — **cannot edit another user's card.** `AccountUpdate` has no `ownerId` field, so `rest` cannot reassign ownership. Safe.

## 4. `getOwnerId()` (lib/owner.ts)

✅ Correct and total.
- `clerkEnabled` → returns `userId ?? "demo"` (`auth()` from Clerk).
- `!clerkEnabled` → returns `"demo"`.
- Return type `Promise<string>`; **never returns `undefined`** (nullish-coalesce to `"demo"` guarantees a string).

## 5. Middleware & User Helpers

- **middleware.ts** ✅ When Clerk enabled, `clerkMiddleware` redirects any non-public request without `userId` to `/welcome`. Public matcher is only `/welcome`, `/sign-in(*)`, `/sign-up(*)` — all data routes are protected. Matcher `/((?!_next|.*\..*).*)` covers app routes while excluding static assets. When Clerk disabled, passes through (intended single-user dev mode).
- **lib/user.ts `getFirstName()`** ✅ Safe — returns `"there"` when auth off, try/catch around `currentUser()`, never throws, no DB access, no cross-tenant data.
- **lib/auth.ts** ✅ `clerkEnabled` gates on presence of the Clerk publishable key.

## 6. Schema Guarantee (lib/db/schema.ts)

✅ Every table carries a `NOT NULL` owner column: `people`, `properties`, `income_events`, `expenses`, `recurring_expenses`, `repayments`, `credit_accounts`, `reminders` all have `ownerId: text("owner_id").notNull()`; `settings` uses `ownerId` as its **primary key** (one settings row per tenant). No table can hold an unscoped/null-owner row.

## 7. New-User Isolation Sanity Check

✅ A brand-new `userId` would see an empty workspace:
- Every read filters `ownerId = getOwnerId()`, so a new owner matches zero existing rows everywhere — dashboard totals 0, accounts `[]`, settlement balance 0, activity `[]`, settings fall back to `DEFAULT_LABELS`.
- No read or write omits the owner predicate, so a new (or any) user can never observe another user's income, expenses, cards, repayments, or settings.

## Notes / Non-Blocking Observations
- `getDashboard`, `getAccounts`, etc. swallow DB errors and degrade to demo/empty data via `catch`. This is intentional graceful degradation, not an isolation issue — the demo fallback data is static and contains no real tenant rows.
- Tables `people`, `properties`, `recurring_expenses`, `reminders` have owner-scoped schema but no live query/mutation paths yet; when wired up they must follow the same `getOwnerId()` pattern. Flagged for future sprints, not a current leak.

**Final: GO.** Data isolation is airtight across all current DB operations.
