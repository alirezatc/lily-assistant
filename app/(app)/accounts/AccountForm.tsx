"use client";
import { useState } from "react";
import MoneyField from "@/components/MoneyField";
import NumberField from "@/components/NumberField";
import StatusNote from "@/components/StatusNote";
import PrimaryButton from "@/components/PrimaryButton";
import { useSubmit } from "@/components/useSubmit";
import { centsOrUndef, num } from "@/lib/num";
import { saveAccount } from "@/lib/actions/account";

export default function AccountForm() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<"credit_card" | "line_of_credit">("credit_card");
  const [last4, setLast4] = useState("");
  const [limit, setLimit] = useState("");
  const [balance, setBalance] = useState("");
  const [dueDay, setDueDay] = useState("1");
  const { status, pending, run } = useSubmit();

  if (!open) {
    return (
      <button onClick={() => setOpen(true)}
        className="w-full rounded-2xl border-2 border-dashed border-pink-200 p-4 text-sm font-bold text-brand active:bg-brand-soft">
        + Add a card or line of credit
      </button>
    );
  }

  const pill = (on: boolean) =>
    `rounded-2xl p-3 text-sm font-bold transition ${on ? "bg-brand text-brand-fg shadow-soft" : "bg-white text-gray-500 border border-pink-100"}`;

  return (
    <form
      onSubmit={(e) => { e.preventDefault();
        run(() => saveAccount({
          name: name || "My card", type, last4: last4 || undefined,
          creditLimitCents: centsOrUndef(limit), currentBalanceCents: centsOrUndef(balance),
          dueDay: Math.min(31, Math.max(1, Math.round(num(dueDay)) || 1)),
        }), "Card added ✓"); }}
      className="space-y-3 rounded-2xl glass p-4"
    >
      <label className="block text-sm font-semibold text-gray-700">
        Nickname
        <input required className="mt-1 w-full rounded-2xl border border-pink-100 p-3 text-lg outline-none focus:border-brand"
          placeholder="e.g. My pink Visa 💕" value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <div className="grid grid-cols-2 gap-2">
        <button type="button" onClick={() => setType("credit_card")} className={pill(type === "credit_card")}>Credit card</button>
        <button type="button" onClick={() => setType("line_of_credit")} className={pill(type === "line_of_credit")}>Line of credit</button>
      </div>
      <label className="block text-sm font-semibold text-gray-700">
        Last 4 digits
        <input inputMode="numeric" maxLength={4} className="mt-1 w-full rounded-2xl border border-pink-100 p-3 text-lg outline-none focus:border-brand"
          placeholder="1234" value={last4} onChange={(e) => setLast4(e.target.value.replace(/\D/g, "").slice(0, 4))} />
      </label>
      <div className="grid grid-cols-2 gap-2">
        <MoneyField label="Limit" value={limit} onChange={setLimit} />
        <MoneyField label="Balance" value={balance} onChange={setBalance} />
      </div>
      <NumberField label="Due day of month" value={dueDay} onChange={setDueDay} min={1} max={31} placeholder="1" />
      <StatusNote status={status} />
      <div className="grid grid-cols-2 gap-2">
        <button type="button" onClick={() => setOpen(false)} className="rounded-2xl bg-gray-100 p-3 font-bold text-gray-600">Cancel</button>
        <PrimaryButton pending={pending}>{pending ? "Saving…" : "Add"}</PrimaryButton>
      </div>
    </form>
  );
}
