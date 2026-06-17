"use client";
import { useState } from "react";
import MoneyField from "@/components/MoneyField";
import { momOwesNilou, formatCents, type Responsibility } from "@/lib/money";
import { saveExpense } from "@/lib/actions/expense";

const categories = [
  "property_tax", "utilities", "car_lease", "phone", "internet", "inventory", "other",
];

export default function ExpenseForm() {
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState("utilities");
  const [responsibility, setResponsibility] = useState<Responsibility>("household");
  const [paidBy, setPaidBy] = useState<"nilou" | "mom">("nilou");
  const amountC = Math.round(amount * 100);

  // live: how much THIS expense adds to "Mom owes you"
  const addsToMom = momOwesNilou([{ amountCents: amountC, responsibility, paidBy }]);

  return (
    <form
      action={async () => {
        await saveExpense({ amountCents: amountC, category, responsibility, paidBy });
      }}
      className="space-y-4"
    >
      <MoneyField label="Amount" value={amount} onChange={setAmount} />

      <label className="block text-sm font-medium text-gray-700">
        Category
        <select
          className="mt-1 w-full rounded-lg border bg-white p-3 text-lg"
          value={category} onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((c) => (
            <option key={c} value={c}>{c.replace("_", " ")}</option>
          ))}
        </select>
      </label>

      <fieldset>
        <legend className="text-sm font-medium text-gray-700">Whose cost?</legend>
        <div className="mt-1 grid grid-cols-3 gap-2">
          {(["nilou", "household", "mom"] as Responsibility[]).map((r) => (
            <button
              key={r} type="button" onClick={() => setResponsibility(r)}
              className={`rounded-lg p-3 text-sm font-medium capitalize ${
                responsibility === r ? "bg-brand text-brand-fg" : "bg-gray-100 text-gray-600"
              }`}
            >{r}</button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-medium text-gray-700">Who paid?</legend>
        <div className="mt-1 grid grid-cols-2 gap-2">
          {(["nilou", "mom"] as const).map((p) => (
            <button
              key={p} type="button" onClick={() => setPaidBy(p)}
              className={`rounded-lg p-3 text-sm font-medium capitalize ${
                paidBy === p ? "bg-brand text-brand-fg" : "bg-gray-100 text-gray-600"
              }`}
            >{p}</button>
          ))}
        </div>
      </fieldset>

      <div className="rounded-xl bg-gray-900 px-4 py-3 text-white">
        <p className="text-sm opacity-80">Adds to "Mom owes you"</p>
        <p className="text-2xl font-bold text-emerald-400">{formatCents(addsToMom)}</p>
        {responsibility === "household" && (
          <p className="mt-1 text-xs opacity-70">Household default split: Mom 50%.</p>
        )}
      </div>

      <button className="w-full rounded-xl bg-brand p-3 font-semibold text-brand-fg active:opacity-90">
        Save expense
      </button>
    </form>
  );
}
