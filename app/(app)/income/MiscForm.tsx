"use client";
import { useState } from "react";
import MoneyField from "@/components/MoneyField";
import ResultBanner from "@/components/ResultBanner";
import StatusNote from "@/components/StatusNote";
import PrimaryButton from "@/components/PrimaryButton";
import { useSubmit } from "@/components/useSubmit";
import { cents } from "@/lib/num";
import { miscNet } from "@/lib/money";
import { saveIncome } from "@/lib/actions/income";

export default function MiscForm() {
  const [desc, setDesc] = useState("");
  const [buy, setBuy] = useState("");
  const [sell, setSell] = useState("");
  const { status, pending, run } = useSubmit();
  const net = miscNet(cents(buy), cents(sell));
  return (
    <form
      onSubmit={(e) => { e.preventDefault();
        run(() => saveIncome({ business: "misc", netCents: net, grossCents: cents(sell), notes: desc, detail: { buyC: cents(buy), sellC: cents(sell) } })); }}
      className="space-y-3"
    >
      <label className="block text-sm font-semibold text-gray-700">
        What is it?
        <input className="mt-1 w-full rounded-2xl border border-pink-100 bg-white p-3 text-lg shadow-sm outline-none focus:border-brand"
          value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="e.g. resold phone" />
      </label>
      <MoneyField label="Buy cost" value={buy} onChange={setBuy} />
      <MoneyField label="Sell price" value={sell} onChange={setSell} />
      <ResultBanner label="Net" cents={net} />
      <StatusNote status={status} />
      <PrimaryButton pending={pending}>{pending ? "Saving…" : "Save misc income"}</PrimaryButton>
    </form>
  );
}
