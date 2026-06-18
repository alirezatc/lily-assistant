"use client";
import { useState } from "react";
import MoneyField from "@/components/MoneyField";
import NumberField from "@/components/NumberField";
import ResultBanner from "@/components/ResultBanner";
import StatusNote from "@/components/StatusNote";
import PrimaryButton from "@/components/PrimaryButton";
import { useSubmit } from "@/components/useSubmit";
import { num, cents } from "@/lib/num";
import { tobaccoNet, tobaccoSalePrice, formatCents } from "@/lib/money";
import { saveIncome } from "@/lib/actions/income";

export default function TobaccoForm() {
  const [packs, setPacks] = useState("1");
  const [cost, setCost] = useState("100");
  const [marginPct, setMarginPct] = useState("30");
  const { status, pending, run } = useSubmit();
  const costCents = cents(cost);
  const margin = num(marginPct) / 100;
  const net = tobaccoNet(num(packs), costCents, margin);
  const sale = tobaccoSalePrice(costCents, margin);
  return (
    <form
      onSubmit={(e) => { e.preventDefault();
        run(() => saveIncome({ business: "tobacco", netCents: net, grossCents: Math.round(num(packs) * sale), detail: { packs: num(packs), costCents, marginBp: Math.round(margin * 10000) } })); }}
      className="space-y-3"
    >
      <NumberField label="Packs" value={packs} onChange={setPacks} placeholder="1" />
      <MoneyField label="Cost per pack" value={cost} onChange={setCost} />
      <NumberField label="Margin" value={marginPct} onChange={setMarginPct} suffix="%" placeholder="30" />
      <p className="text-sm text-gray-400">Sells at {formatCents(sale)}/pack</p>
      <ResultBanner label="Net profit" cents={net} />
      <StatusNote status={status} />
      <PrimaryButton pending={pending}>{pending ? "Saving…" : "Save tobacco income"}</PrimaryButton>
    </form>
  );
}
