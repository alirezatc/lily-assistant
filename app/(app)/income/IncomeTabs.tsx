"use client";
import { useState } from "react";
import CardNightForm from "./CardNightForm";
import TobaccoForm from "./TobaccoForm";
import DealerForm from "./DealerForm";
import MiscForm from "./MiscForm";

const tabs = [
  { key: "card", label: "Card Night", el: <CardNightForm /> },
  { key: "tobacco", label: "Tobacco", el: <TobaccoForm /> },
  { key: "dealer", label: "Dealer", el: <DealerForm /> },
  { key: "misc", label: "Misc", el: <MiscForm /> },
] as const;

export default function IncomeTabs() {
  const [active, setActive] = useState<(typeof tabs)[number]["key"]>("card");
  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setActive(t.key)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition ${
              active === t.key ? "bg-brand text-brand-fg shadow-soft" : "bg-white text-gray-500 border border-pink-100"
            }`}>{t.label}</button>
        ))}
      </div>
      {tabs.find((t) => t.key === active)?.el}
    </div>
  );
}
