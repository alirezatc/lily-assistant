import { describe, it, expect } from "vitest";
import { nextDueDate, daysUntilDue, advance, isDueWithin, daysInMonth } from "./dates";

const d = (y: number, m: number, day: number) => new Date(y, m - 1, day);

describe("daysInMonth", () => {
  it("Feb 2024 is 29 (leap)", () => expect(daysInMonth(2024, 2)).toBe(29));
  it("Feb 2025 is 28", () => expect(daysInMonth(2025, 2)).toBe(28));
  it("April is 30", () => expect(daysInMonth(2025, 4)).toBe(30));
});

describe("nextDueDate", () => {
  it("due day later this month", () => {
    expect(nextDueDate(20, d(2026, 6, 16))).toEqual(d(2026, 6, 20));
  });
  it("due day already passed -> next month", () => {
    expect(nextDueDate(10, d(2026, 6, 16))).toEqual(d(2026, 7, 10));
  });
  it("today is the due day -> today", () => {
    expect(nextDueDate(16, d(2026, 6, 16))).toEqual(d(2026, 6, 16));
  });
  it("clamps day 31 to month length (June=30)", () => {
    expect(nextDueDate(31, d(2026, 6, 16))).toEqual(d(2026, 6, 30));
  });
  it("year rollover from December", () => {
    expect(nextDueDate(5, d(2026, 12, 20))).toEqual(d(2027, 1, 5));
  });
});

describe("daysUntilDue", () => {
  it("4 days until the 20th from the 16th", () => {
    expect(daysUntilDue(20, d(2026, 6, 16))).toBe(4);
  });
  it("0 days when due today", () => {
    expect(daysUntilDue(16, d(2026, 6, 16))).toBe(0);
  });
});

describe("advance", () => {
  it("monthly", () => expect(advance(d(2026, 1, 15), "monthly")).toEqual(d(2026, 2, 15)));
  it("quarterly", () => expect(advance(d(2026, 1, 15), "quarterly")).toEqual(d(2026, 4, 15)));
  it("annual", () => expect(advance(d(2026, 1, 15), "annual")).toEqual(d(2027, 1, 15)));
});

describe("isDueWithin", () => {
  it("within lead window", () => {
    expect(isDueWithin(d(2026, 6, 19), d(2026, 6, 16), 3)).toBe(true);
  });
  it("outside window", () => {
    expect(isDueWithin(d(2026, 6, 25), d(2026, 6, 16), 3)).toBe(false);
  });
  it("past due is not 'within' (negative diff)", () => {
    expect(isDueWithin(d(2026, 6, 10), d(2026, 6, 16), 3)).toBe(false);
  });
});
