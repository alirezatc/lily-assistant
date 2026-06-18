"use client";
import { useState } from "react";
import MoneyField from "@/components/MoneyField";
import StatusNote from "@/components/StatusNote";
import PrimaryButton from "@/components/PrimaryButton";
import { useSubmit } from "@/components/useSubmit";
import { cents } from "@/lib/num";
import { saveRepayment } from "@/lib/actions/expense";

export default function RepaymentForm() {
  const [amount, setAmount] = useState("");
  const { status, pending, run } = useSubmit();
  return (
    <form onSubmit={(e) => { e.preventDefault(); run(() => saveRepayment(cents(amount)), "Repayment recorded ✓"); }}
      className="space-y-3 rounded-2xl border border-pink-100 bg-white p-4 shadow-sm">
      <MoneyField label="Repayment amount" value={amount} onChange={setAmount} />
      <StatusNote status={status} />
      <PrimaryButton pending={pending}>{pending ? "Saving…" : "Record repayment"}</PrimaryButton>
    </form>
  );
}
