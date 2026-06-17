"use client";
import { useState } from "react";
import MoneyField from "@/components/MoneyField";
import ResultBanner from "@/components/ResultBanner";
import { miscNet } from "@/lib/money";
import { saveIncome } from "@/lib/actions/income";

export default function MiscForm() {
  const [desc, setDesc] = useState("");
  const [buy, setBuy] = useState(0);
  const [sell, setSell] = useState(0);
  const buyC = Math.round(buy * 100);
  const sellC = Math.round(sell * 100);
  const net = miscNet(buyC, sellC);

  return (
    <form
      action={async () => {
        await saveIncome({
          business: "misc",
          netCents: net,
          grossCents: sellC,
          notes: desc,
          detail: { buyC, sellC },
        });
      }}
      className="space-y-3"
    >
      <label className="block text-sm font-medium text-gray-700">
        What is it?
        <input
          className="mt-1 w-full rounded-lg border bg-white p-3 text-lg"
          value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="e.g. resold phone"
        />
      </label>
      <MoneyField label="Buy cost" value={buy} onChange={setBuy} />
      <MoneyField label="Sell price" value={sell} onChange={setSell} />
      <ResultBanner label="Net" cents={net} />
      <button className="w-full rounded-xl bg-brand p-3 font-semibold text-brand-fg active:opacity-90">
        Save misc income
      </button>
    </form>
  );
}
