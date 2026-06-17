/**
 * Pure money functions — the single source of truth for the app's math.
 * Mirrors docs/DOMAIN_MODEL.md §9.
 *
 * CONVENTION: all monetary amounts are INTEGER CENTS (e.g. $100.00 -> 10000).
 * Percentages are decimals (30% -> 0.30). Never pass floating dollars in.
 * Results are integer cents, rounded half-up at the final step only.
 */

/** Round a fractional cent amount to a whole cent (half-up). */
export function roundCents(value: number): number {
  return Math.round(value);
}

/** Tobacco resale net profit. net = packs * costPerPack * marginPct */
export function tobaccoNet(
  packs: number,
  costPerPackCents: number,
  marginPct: number,
): number {
  return roundCents(packs * costPerPackCents * marginPct);
}

/** Tobacco sale price per pack = cost * (1 + margin). */
export function tobaccoSalePrice(costPerPackCents: number, marginPct: number): number {
  return roundCents(costPerPackCents * (1 + marginPct));
}

export const RAKE_PCT = 0.1;
export const RAKE_FLOOR_CENTS = 1500; // $15.00

/** Rake for one round: max(10% of pot, $15). Pot in cents. */
export function rakeRound(potCents: number): number {
  if (potCents <= 0) return RAKE_FLOOR_CENTS; // a played round still rakes the floor
  return Math.max(roundCents(potCents * RAKE_PCT), RAKE_FLOOR_CENTS);
}

/** Total rake across a night from a list of per-round pots (cents). */
export function nightRake(potsCents: number[]): number {
  return potsCents.reduce((sum, pot) => sum + rakeRound(pot), 0);
}

/** Quick-mode night rake from rounds count + average pot. */
export function nightRakeAveraged(roundsCount: number, avgPotCents: number): number {
  return roundsCount * rakeRound(avgPotCents);
}

/** Dealer cut Nilou keeps = (fee + tips) * split. */
export function dealerCut(
  feeCents: number,
  tipsCents: number,
  split = 0.5,
): number {
  return roundCents((feeCents + tipsCents) * split);
}

/** Misc trade net = sell - buy. */
export function miscNet(buyCents: number, sellCents: number): number {
  return sellCents - buyCents;
}

// ----- Settlement: "Mom owes Nilou" -----

export type Responsibility = "nilou" | "household" | "mom";

export interface ExpenseRecord {
  amountCents: number;
  responsibility: Responsibility;
  paidBy: "nilou" | "mom";
  /** Household split share that is Mom's, as a decimal. Default 0.5. */
  householdMomShare?: number;
}

export interface RepaymentRecord {
  amountCents: number; // Mom -> Nilou
}

/**
 * Net cents Mom owes Nilou.
 * - Mom-responsibility expenses Nilou fronted: full amount.
 * - Household expenses Nilou fronted: Mom's split share.
 * - Minus repayments Mom made to Nilou.
 */
export function momOwesNilou(
  expenses: ExpenseRecord[],
  repayments: RepaymentRecord[] = [],
  defaultHouseholdMomShare = 0.5,
): number {
  let owed = 0;
  for (const e of expenses) {
    if (e.paidBy !== "nilou") continue;
    if (e.responsibility === "mom") {
      owed += e.amountCents;
    } else if (e.responsibility === "household") {
      const share = e.householdMomShare ?? defaultHouseholdMomShare;
      owed += roundCents(e.amountCents * share);
    }
  }
  for (const r of repayments) owed -= r.amountCents;
  return owed;
}

/** Format integer cents as a display string, e.g. 12345 -> "$123.45". */
export function formatCents(cents: number): string {
  const sign = cents < 0 ? "-" : "";
  const abs = Math.abs(cents);
  return `${sign}$${Math.floor(abs / 100)}.${String(abs % 100).padStart(2, "0")}`;
}
