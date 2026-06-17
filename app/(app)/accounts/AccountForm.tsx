"use client";
import { useState } from "react";
import StatusNote from "@/components/StatusNote";
import { useSubmit } from "@/components/useSubmit";
import { saveAccount } from "@/lib/actions/account";

export default function AccountForm() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<"credit_card" | "line_of_credit">("credit_card");
  const [last4, setLast4] = useState("");
  const [limit, setLimit] = useState(0);
  const [balance, setBalance] = useState(0);
  const [dueDay, setDueDay] = useState(1);
  const { status, pending, run } = useSubmit();

  if (!open) {
    return (
      <button onClick={() => setOpen(true)}
        className="w-full rounded-xl border border-dashed border-gray-300 p-4 text-sm font-medium text-gray-600 active:bg-gray-100">
        + Add a card or line of credit
      </button>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        run(
          () => saveAccount({
            name, type, last4: last4 || undefined,
            creditLimitCents: Math.round(limit * 100),
            currentBalanceCents: Math.round(balance * 100),
            dueDay,
          }),
          "Account added ✓",
        );
      }}
      className="space-y-3 rounded-xl border bg-white p-4"
    >
      <label className="block text-sm font-medium text-gray-700">
        Name
        <input required className="mt-1 w-full rounded-lg border p-3 text-lg" placeholder="e.g. Visa Rewards"
          value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <div className="grid grid-cols-2 gap-2">
        <button type="button" onClick={() => setType("credit_card")}
          className={`rounded-lg p-3 text-sm font-medium ${type === "credit_card" ? "bg-brand text-brand-fg" : "bg-gray-100 text-gray-600"}`}>Credit card</button>
        <button type="button" onClick={() => setType("line_of_credit")}
          className={`rounded-lg p-3 text-sm font-medium ${type === "line_of_credit" ? "bg-brand text-brand-fg" : "bg-gray-100 text-gray-600"}`}>Line of credit</button>
      </div>
      <label className="block text-sm font-medium text-gray-700">
        Last 4 digits
        <input inputMode="numeric" maxLength={4} className="mt-1 w-full rounded-lg border p-3 text-lg" placeholder="1234"
          value={last4} onChange={(e) => setLast4(e.target.value.replace(/\D/g, "").slice(0, 4))} />
      </label>
      <div className="grid grid-cols-2 gap-2">
        <label className="block text-sm font-medium text-gray-700">
          Limit ($)
          <input type="number" inputMode="decimal" className="mt-1 w-full rounded-lg border p-3 text-lg"
            value={limit} onChange={(e) => setLimit(Number(e.target.value))} />
        </label>
        <label className="block text-sm font-medium text-gray-700">
          Balance ($)
          <input type="number" inputMode="decimal" className="mt-1 w-full rounded-lg border p-3 text-lg"
            value={balance} onChange={(e) => setBalance(Number(e.target.value))} />
        </label>
      </div>
      <label className="block text-sm font-medium text-gray-700">
        Due day of month (1–31)
        <input type="number" inputMode="numeric" min={1} max={31} className="mt-1 w-full rounded-lg border p-3 text-lg"
          value={dueDay} onChange={(e) => setDueDay(Math.min(31, Math.max(1, Number(e.target.value))))} />
      </label>
      <StatusNote status={status} />
      <div className="grid grid-cols-2 gap-2">
        <button type="button" onClick={() => setOpen(false)}
          className="rounded-xl bg-gray-100 p-3 font-semibold text-gray-700">Cancel</button>
        <button disabled={pending}
          className="rounded-xl bg-brand p-3 font-semibold text-brand-fg disabled:opacity-50">
          {pending ? "Saving…" : "Add"}
        </button>
      </div>
    </form>
  );
}
