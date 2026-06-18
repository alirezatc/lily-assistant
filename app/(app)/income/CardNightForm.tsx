"use client";
import { useState } from "react";
import NumberField from "@/components/NumberField";
import ResultBanner from "@/components/ResultBanner";
import StatusNote from "@/components/StatusNote";
import PrimaryButton from "@/components/PrimaryButton";
import { useSubmit } from "@/components/useSubmit";
import { num, cents } from "@/lib/num";
import { nightRakeAveraged } from "@/lib/money";
import { saveIncome } from "@/lib/actions/income";

export default function CardNightForm() {
  const [rounds, setRounds] = useState("10");
  const [avgPot, setAvgPot] = useState("200");
  const { status, pending, run } = useSubmit();
  const rake = nightRakeAveraged(Math.round(num(rounds)), cents(avgPot));
  return (
    <form
      onSubmit={(e) => { e.preventDefault();
        run(() => saveIncome({ business: "card_night", netCents: rake, grossCents: rake, detail: { rounds: num(rounds), avgPotC: cents(avgPot), mode: "averaged" } })); }}
      className="space-y-3"
    >
      <NumberField label="Rounds" value={rounds} onChange={setRounds} placeholder="10" />
      <NumberField label="Average pot" value={avgPot} onChange={setAvgPot} suffix="$" placeholder="200" />
      <p className="text-xs text-gray-400">Rake per round = max(10% of pot, $15)</p>
      <ResultBanner label="Night rake" cents={rake} />
      <StatusNote status={status} />
      <PrimaryButton pending={pending}>{pending ? "Saving…" : "Save card-night income"}</PrimaryButton>
    </form>
  );
}
