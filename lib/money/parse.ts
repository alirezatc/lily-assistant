/** Parse a dollar string/number into integer cents. "12.5" -> 1250. */
export function dollarsToCents(v: string | number): number {
  const n = typeof v === "number" ? v : parseFloat(v || "0");
  if (!isFinite(n)) return 0;
  return Math.round(n * 100);
}
