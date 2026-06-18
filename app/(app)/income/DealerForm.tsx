"use client";
import { useState } from "react";
import MoneyField from "@/components/MoneyField";
import NumberField from "@/components/NumberField";
import ResultBanner from "@/components/ResultBanner";
import StatusNote from "@/components/StatusNote";
import PrimaryButton from "@/components/PrimaryButton";
import { useSubmit } from "@/components/useSubmit";
import { num, cents } from "@/lib/num";
import { dealerCut } from "@/lib/money";
import { saveIncome } from "@/lib/actions/income";

export default function DealerForm() {
  const [fee, setFee] = useState("100");
  const [tips, setTips] = useState("40");
  const [splitPct, setSplitPct] = useState("50");
  const { status, pending, run } = useSubmit();
  const cut = dealerCut(cents(fee), cents(tips), num(splitPct) / 100);
  return (
    <form
      onSubmit={(e) => { e.preventDefault();
        run(() => saveIncome({ business: "dealer", netCents: cut, grossCents: cents(fee) + cents(tips), detail: { feeC: cents(fee), tipsC: cents(tips), splitBp: num(splitPct) * 100 } })); }}
      className="space-y-3"
    >
      <MoneyField label="Dealer fee" value={fee} onChange={setFee} />
      <MoneyField label="Tips" value={tips} onChange={setTips} />
      <NumberField label="My split" value={splitPct} onChange={setSplitPct} suffix="%" placeholder="50" />
      <ResultBanner label="My cut" cents={cut} />
      <StatusNote status={status} />
      <PrimaryButton pending={pending}>{pending ? "Saving…" : "Save dealer income"}</PrimaryButton>
    </form>
  );
}
