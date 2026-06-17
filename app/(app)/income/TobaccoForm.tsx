"use client";
import { useState } from "react";
import MoneyField from "@/components/MoneyField";
import ResultBanner from "@/components/ResultBanner";
import { tobaccoNet, tobaccoSalePrice, formatCents } from "@/lib/money";
import { saveIncome } from "@/lib/actions/income";

export default function TobaccoForm() {
  const [packs, setPacks] = useState(1);
  const [cost, setCost] = useState(100);      // $/pack
  const [marginPct, setMarginPct] = useState(30); // %
  const costCents = Math.round(cost * 100);
  const margin = marginPct / 100;
  const net = tobaccoNet(packs, costCents, margin);
  const sale = tobaccoSalePrice(costCents, margin);

  return (
    <form
      action={async () => {
        await saveIncome({
          business: "tobacco",
          netCents: net,
          grossCents: packs * sale,
          detail: { packs, costCents, marginBp: Math.round(margin * 10000) },
        });
      }}
      className="space-y-3"
    >
      <label className="block text-sm font-medium text-gray-700">
        Packs
        <input
          type="number" inputMode="numeric"
          className="mt-1 w-full rounded-lg border bg-white p-3 text-lg"
          value={packs} onChange={(e) => setPacks(Number(e.target.value))}
        />
      </label>
      <MoneyField label="Cost per pack" value={cost} onChange={setCost} />
      <label className="block text-sm font-medium text-gray-700">
        Margin %
        <input
          type="number" inputMode="decimal"
          className="mt-1 w-full rounded-lg border bg-white p-3 text-lg"
          value={marginPct} onChange={(e) => setMarginPct(Number(e.target.value))}
        />
      </label>
      <p className="text-sm text-gray-500">Sells at {formatCents(sale)}/pack</p>
      <ResultBanner label="Net profit" cents={net} />
      <button className="w-full rounded-xl bg-brand p-3 font-semibold text-brand-fg active:opacity-90">
        Save tobacco income
      </button>
    </form>
  );
}
