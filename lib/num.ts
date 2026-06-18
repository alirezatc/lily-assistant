/** Parse a user-typed numeric string to a number (empty -> 0). */
export const num = (s: string): number => {
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : 0;
};
/** Dollars string -> integer cents. */
export const cents = (s: string): number => Math.round(num(s) * 100);

/** Dollars string -> integer cents, or undefined when blank (for nullable fields). */
export const centsOrUndef = (s: string): number | undefined =>
  s.trim() === "" ? undefined : cents(s);
