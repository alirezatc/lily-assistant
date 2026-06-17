/**
 * Due-date helpers for credit accounts and recurring expenses.
 * All functions are pure and timezone-naive (operate on Y/M/D).
 */

/** Days in a given month (1-based month). */
export function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

/**
 * The next calendar date a monthly `dueDay` falls on, on or after `from`.
 * Clamps dueDay to the month length (e.g. 31 -> 30 in April, 28/29 in Feb).
 */
export function nextDueDate(dueDay: number, from: Date): Date {
  const y = from.getFullYear();
  const m = from.getMonth() + 1; // 1-based
  const clampedThis = Math.min(dueDay, daysInMonth(y, m));
  const thisMonth = new Date(y, m - 1, clampedThis);
  if (thisMonth >= stripTime(from)) return thisMonth;
  const nm = m === 12 ? 1 : m + 1;
  const ny = m === 12 ? y + 1 : y;
  const clampedNext = Math.min(dueDay, daysInMonth(ny, nm));
  return new Date(ny, nm - 1, clampedNext);
}

function stripTime(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/** Whole days from `from` until the next occurrence of `dueDay` (>= 0). */
export function daysUntilDue(dueDay: number, from: Date): number {
  const due = nextDueDate(dueDay, from);
  const ms = stripTime(due).getTime() - stripTime(from).getTime();
  return Math.round(ms / 86_400_000);
}

/** Advance a date by a cadence. */
export function advance(date: Date, cadence: "monthly" | "quarterly" | "annual"): Date {
  const d = new Date(date);
  if (cadence === "monthly") d.setMonth(d.getMonth() + 1);
  else if (cadence === "quarterly") d.setMonth(d.getMonth() + 3);
  else d.setFullYear(d.getFullYear() + 1);
  return d;
}

/** Should a reminder fire today given a due date and lead time? */
export function isDueWithin(due: Date, from: Date, leadDays: number): boolean {
  const diff = Math.round((stripTime(due).getTime() - stripTime(from).getTime()) / 86_400_000);
  return diff >= 0 && diff <= leadDays;
}
