"use client";
import { useState } from "react";
import { Pencil } from "lucide-react";
import CardNumber from "@/components/CardNumber";
import MoneyField from "@/components/MoneyField";
import NumberField from "@/components/NumberField";
import StatusNote from "@/components/StatusNote";
import PrimaryButton from "@/components/PrimaryButton";
import { useSubmit } from "@/components/useSubmit";
import { centsOrUndef, num } from "@/lib/num";
import { formatCents } from "@/lib/money";
import { updateAccount } from "@/lib/actions/account";

export type Card = {
  id: number; name: string; type: string; last4: string | null;
  currentBalanceCents: number | null; creditLimitCents: number | null;
  dueDay: number | null; inDays: number | null;
};

export default function CardItem({ card }: { card: Card }) {
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState(card.name);
  const [balance, setBalance] = useState(card.currentBalanceCents != null ? (card.currentBalanceCents / 100).toString() : "");
  const [dueDay, setDueDay] = useState(card.dueDay ? String(card.dueDay) : "1");
  const { status, pending, run } = useSubmit();

  return (
    <li className="rounded-2xl border border-pink-100 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="font-bold text-gray-800">{card.name}</p>
          <CardNumber last4={card.last4} />
          <p className="text-xs text-gray-400">
            {card.type === "line_of_credit" ? "Line of credit" : "Credit card"}
            {card.currentBalanceCents != null ? ` · bal ${formatCents(card.currentBalanceCents)}` : ""}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          {card.inDays != null && (
            <span className={`text-sm font-bold ${card.inDays <= 3 ? "text-brand-deep" : "text-gray-500"}`}>due in {card.inDays}d</span>
          )}
          <button onClick={() => setEdit((e) => !e)} aria-label="Edit" className="text-gray-400 active:text-brand"><Pencil size={16} /></button>
        </div>
      </div>

      {edit && (
        <form
          onSubmit={(e) => { e.preventDefault();
            run(() => updateAccount({ id: card.id, name, currentBalanceCents: centsOrUndef(balance), dueDay: Math.min(31, Math.max(1, Math.round(num(dueDay)) || 1)) }), "Saved ✓"); }}
          className="mt-3 space-y-3 border-t border-pink-50 pt-3"
        >
          <label className="block text-sm font-semibold text-gray-700">
            Nickname
            <input className="mt-1 w-full rounded-2xl border border-pink-100 p-3 text-lg outline-none focus:border-brand"
              value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <MoneyField label="Balance" value={balance} onChange={setBalance} />
          <NumberField label="Due day of month" value={dueDay} onChange={setDueDay} min={1} max={31} />
          <StatusNote status={status} />
          <PrimaryButton pending={pending}>{pending ? "Saving…" : "Save changes"}</PrimaryButton>
        </form>
      )}
    </li>
  );
}
