import { describe, it, expect } from "vitest";
import {
  tobaccoNet,
  tobaccoSalePrice,
  rakeRound,
  nightRake,
  nightRakeAveraged,
  dealerCut,
  miscNet,
  momOwesNilou,
  formatCents,
} from "./index";

describe("tobaccoNet", () => {
  it("canonical: 1 pack @ $100 cost, 30% margin -> $30 net", () => {
    expect(tobaccoNet(1, 10000, 0.3)).toBe(3000);
  });
  it("multiple packs scale linearly", () => {
    expect(tobaccoNet(5, 10000, 0.3)).toBe(15000);
  });
  it("zero margin -> zero net", () => {
    expect(tobaccoNet(3, 10000, 0)).toBe(0);
  });
  it("sale price = cost * (1+margin)", () => {
    expect(tobaccoSalePrice(10000, 0.3)).toBe(13000);
  });
});

describe("rakeRound max(10% pot, $15)", () => {
  it("floor applies when 10% < $15 (pot $100 -> $15)", () => {
    expect(rakeRound(10000)).toBe(1500);
  });
  it("boundary: pot $150 -> 10% == $15", () => {
    expect(rakeRound(15000)).toBe(1500);
  });
  it("percentage applies when 10% > $15 (pot $500 -> $50)", () => {
    expect(rakeRound(50000)).toBe(5000);
  });
  it("zero/empty pot still rakes the floor", () => {
    expect(rakeRound(0)).toBe(1500);
  });
  it("large pot ($10,000 -> $1,000)", () => {
    expect(rakeRound(1000000)).toBe(100000);
  });
});

describe("nightRake", () => {
  it("sums per-round rakes", () => {
    // pots: $100 (->15), $200 (->20), $500 (->50) = $85
    expect(nightRake([10000, 20000, 50000])).toBe(8500);
  });
  it("averaged quick mode: 10 rounds @ $200 avg -> 10*$20 = $200", () => {
    expect(nightRakeAveraged(10, 20000)).toBe(20000);
  });
});

describe("dealerCut", () => {
  it("default 50/50 of fee+tips", () => {
    expect(dealerCut(10000, 4000, 0.5)).toBe(7000);
  });
  it("fee only", () => {
    expect(dealerCut(10000, 0)).toBe(5000);
  });
  it("custom split", () => {
    expect(dealerCut(10000, 0, 0.6)).toBe(6000);
  });
});

describe("miscNet", () => {
  it("sell - buy", () => {
    expect(miscNet(5000, 8000)).toBe(3000);
  });
  it("loss is negative", () => {
    expect(miscNet(8000, 5000)).toBe(-3000);
  });
});

describe("momOwesNilou", () => {
  it("mom expense fronted by nilou counts fully", () => {
    expect(
      momOwesNilou([{ amountCents: 5000, responsibility: "mom", paidBy: "nilou" }]),
    ).toBe(5000);
  });
  it("household expense fronted by nilou counts mom's 50% share", () => {
    expect(
      momOwesNilou([{ amountCents: 10000, responsibility: "household", paidBy: "nilou" }]),
    ).toBe(5000);
  });
  it("nilou-own expense contributes nothing", () => {
    expect(
      momOwesNilou([{ amountCents: 9999, responsibility: "nilou", paidBy: "nilou" }]),
    ).toBe(0);
  });
  it("mom-paid expense contributes nothing to what mom owes", () => {
    expect(
      momOwesNilou([{ amountCents: 5000, responsibility: "mom", paidBy: "mom" }]),
    ).toBe(0);
  });
  it("repayments reduce the balance", () => {
    expect(
      momOwesNilou(
        [{ amountCents: 5000, responsibility: "mom", paidBy: "nilou" }],
        [{ amountCents: 2000 }],
      ),
    ).toBe(3000);
  });
  it("mixed ledger sums correctly", () => {
    const owed = momOwesNilou(
      [
        { amountCents: 5000, responsibility: "mom", paidBy: "nilou" },      // +5000
        { amountCents: 10000, responsibility: "household", paidBy: "nilou" }, // +5000
        { amountCents: 3000, responsibility: "nilou", paidBy: "nilou" },     // +0
        { amountCents: 4000, responsibility: "mom", paidBy: "mom" },         // +0
      ],
      [{ amountCents: 1500 }], // -1500
    );
    expect(owed).toBe(8500);
  });
});

describe("formatCents", () => {
  it("formats positive", () => expect(formatCents(12345)).toBe("$123.45"));
  it("pads cents", () => expect(formatCents(10005)).toBe("$100.05"));
  it("formats negative", () => expect(formatCents(-3000)).toBe("-$30.00"));
});
