"use client";
import { useState } from "react";
import MoneyField from "@/components/MoneyField";
import StatusNote from "@/components/StatusNote";
import PrimaryButton from "@/components/PrimaryButton";
import { useSubmit } from "@/components/useSubmit";
import { cents } from "@/lib/num";
import { momOwesNilou, formatCents, type Responsibility } from "@/lib/money";
import { saveExpense } from "@/lib/actions/expense";

const categories = ["property_tax", "utilities", "car_lease", "phone", "internet", "inventory", "other"];

export default function ExpenseForm() {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("utilities");
  const [responsibility, setResponsibility] = useState<Responsibility>("household");
  const [paidBy, setPaidBy] = useState<"nilou" | "mom">("nilou");
  const { status, pending, run } = useSubmit();
  const amountC = cents(amount);
  const addsToMom = momOwesNilou([{ amountCents: amountC, responsibility, paidBy }]);
  const pill = (on: boolean) =>
    `rounded-2xl p-3 text-sm font-bold capitalize transition ${on ? "bg-brand text-brand-fg shadow-soft" : "bg-white text-gray-500 border border-pink-100"}`;

  return (
    <form onSubmit={(e) => { e.preventDefault(); run(() => saveExpense({ amountCents: amountC, category, responsibility, paidBy })); }}
      className="space-y-4">
      <MoneyField label="Amount" value={amount} onChange={setAmount} />
      <label className="block text-sm font-semibold text-gray-700">
        Category
        <select className="mt-1 w-full rounded-2xl border border-pink-100 bg-white p-3 text-lg shadow-sm outline-none focus:border-brand"
          value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((c) => (<option key={c} value={c}>{c.replace("_", " ")}</option>))}
        </select>
      </label>
      <fieldset>
        <legend className="text-sm font-semibold text-gray-700">Whose cost?</legend>
        <div className="mt-1 grid grid-cols-3 gap-2">
          {(["nilou", "household", "mom"] as Responsibility[]).map((r) => (
            <button key={r} type="button" onClick={() => setResponsibility(r)} className={pill(responsibility === r)}>{r}</button>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="text-sm font-semibold text-gray-700">Who paid?</legend>
        <div className="mt-1 grid grid-cols-2 gap-2">
          {(["nilou", "mom"] as const).map((p) => (
            <button key={p} type="button" onClick={() => setPaidBy(p)} className={pill(paidBy === p)}>{p}</button>
          ))}
        </div>
      </fieldset>
      <div className="rounded-2xl bg-gradient-to-r from-brand to-brand-deep px-4 py-3 text-white shadow-soft">
        <p className="text-sm opacity-90">Adds to &quot;Mom owes you&quot;</p>
        <p className="text-2xl font-bold">{formatCents(addsToMom)}</p>
        {responsibility === "household" && (<p className="mt-1 text-xs opacity-80">Household default split: Mom 50%.</p>)}
      </div>
      <StatusNote status={status} />
      <PrimaryButton pending={pending}>{pending ? "Saving…" : "Save expense"}</PrimaryButton>
    </form>
  );
}
