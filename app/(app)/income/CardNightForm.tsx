"use client";
import { useState } from "react";
import ResultBanner from "@/components/ResultBanner";
import { nightRakeAveraged } from "@/lib/money";
import { saveIncome } from "@/lib/actions/income";

export default function CardNightForm() {
  const [rounds, setRounds] = useState(10);
  const [avgPot, setAvgPot] = useState(200); // dollars
  const avgPotC = Math.round(avgPot * 100);
  const rake = nightRakeAveraged(rounds, avgPotC);

  return (
    <form
      action={async () => {
        await saveIncome({
          business: "card_night",
          netCents: rake,
          grossCents: rake,
          detail: { rounds, avgPotC, mode: "averaged" },
        });
      }}
      className="space-y-3"
    >
      <label className="block text-sm font-medium text-gray-700">
        Rounds
        <input
          type="number" inputMode="numeric"
          className="mt-1 w-full rounded-lg border bg-white p-3 text-lg"
          value={rounds} onChange={(e) => setRounds(Number(e.target.value))}
        />
      </label>
      <label className="block text-sm font-medium text-gray-700">
        Average pot ($)
        <input
          type="number" inputMode="decimal"
          className="mt-1 w-full rounded-lg border bg-white p-3 text-lg"
          value={avgPot} onChange={(e) => setAvgPot(Number(e.target.value))}
        />
      </label>
      <p className="text-xs text-gray-500">Rake per round = max(10% of pot, $15)</p>
      <ResultBanner label="Night rake" cents={rake} />
      <button className="w-full rounded-xl bg-brand p-3 font-semibold text-brand-fg active:opacity-90">
        Save card-night income
      </button>
    </form>
  );
}
