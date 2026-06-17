"use client";
import { useState } from "react";
import MoneyField from "@/components/MoneyField";
import StatusNote from "@/components/StatusNote";
import { useSubmit } from "@/components/useSubmit";
import { saveRepayment } from "@/lib/actions/expense";

export default function RepaymentForm() {
  const [amount, setAmount] = useState(0);
  const { status, pending, run } = useSubmit();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        run(() => saveRepayment(Math.round(amount * 100)), "Repayment recorded ✓");
      }}
      className="space-y-3 rounded-xl border bg-white p-4"
    >
      <MoneyField label="Repayment amount" value={amount} onChange={setAmount} />
      <StatusNote status={status} />
      <button disabled={pending} className="w-full rounded-xl bg-gray-900 p-3 font-semibold text-white active:opacity-90 disabled:opacity-50">
        {pending ? "Saving…" : "Record repayment"}
      </button>
    </form>
  );
}
