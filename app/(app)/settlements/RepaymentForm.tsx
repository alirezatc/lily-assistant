"use client";
import { useState } from "react";
import MoneyField from "@/components/MoneyField";
import { saveRepayment } from "@/lib/actions/expense";

export default function RepaymentForm() {
  const [amount, setAmount] = useState(0);
  return (
    <form
      action={async () => { await saveRepayment(Math.round(amount * 100)); setAmount(0); }}
      className="space-y-3 rounded-xl border bg-white p-4"
    >
      <MoneyField label="Repayment amount" value={amount} onChange={setAmount} />
      <button className="w-full rounded-xl bg-gray-900 p-3 font-semibold text-white active:opacity-90">
        Record repayment
      </button>
    </form>
  );
}
