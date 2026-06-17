"use client";
import { useState } from "react";
import MoneyField from "@/components/MoneyField";
import ResultBanner from "@/components/ResultBanner";
import StatusNote from "@/components/StatusNote";
import { useSubmit } from "@/components/useSubmit";
import { dealerCut } from "@/lib/money";
import { saveIncome } from "@/lib/actions/income";

export default function DealerForm() {
  const [fee, setFee] = useState(100);
  const [tips, setTips] = useState(40);
  const [splitPct, setSplitPct] = useState(50);
  const { status, pending, run } = useSubmit();
  const feeC = Math.round(fee * 100);
  const tipsC = Math.round(tips * 100);
  const cut = dealerCut(feeC, tipsC, splitPct / 100);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        run(() => saveIncome({ business: "dealer", netCents: cut, grossCents: feeC + tipsC, detail: { feeC, tipsC, splitBp: splitPct * 100 } }));
      }}
      className="space-y-3"
    >
      <MoneyField label="Dealer fee" value={fee} onChange={setFee} />
      <MoneyField label="Tips" value={tips} onChange={setTips} />
      <label className="block text-sm font-medium text-gray-700">
        My split %
        <input type="number" inputMode="decimal" className="mt-1 w-full rounded-lg border bg-white p-3 text-lg"
          value={splitPct} onChange={(e) => setSplitPct(Number(e.target.value))} />
      </label>
      <ResultBanner label="My cut" cents={cut} />
      <StatusNote status={status} />
      <button disabled={pending} className="w-full rounded-xl bg-brand p-3 font-semibold text-brand-fg active:opacity-90 disabled:opacity-50">
        {pending ? "Saving…" : "Save dealer income"}
      </button>
    </form>
  );
}
