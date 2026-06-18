"use client";
import { useState } from "react";
import StatusNote from "@/components/StatusNote";
import PrimaryButton from "@/components/PrimaryButton";
import { useSubmit } from "@/components/useSubmit";
import { saveBusinessLabels } from "@/lib/actions/settings";

const fields: { key: "tobacco" | "card_night" | "dealer" | "misc"; hint: string }[] = [
  { key: "tobacco", hint: "e.g. Tobacco, Resale, Boutique…" },
  { key: "card_night", hint: "e.g. Card Night, Poker…" },
  { key: "dealer", hint: "e.g. Dealer…" },
  { key: "misc", hint: "e.g. Misc, Side gigs…" },
];

export default function BusinessLabelsForm({ labels }: { labels: Record<string, string> }) {
  const [vals, setVals] = useState<Record<string, string>>(labels);
  const { status, pending, run } = useSubmit();
  return (
    <form onSubmit={(e) => { e.preventDefault(); run(() => saveBusinessLabels(vals), "Names saved ✓"); }}
      className="space-y-3 rounded-2xl glass p-4">
      {fields.map((f) => (
        <label key={f.key} className="block text-sm font-semibold text-gray-700">
          {f.key.replace("_", " ")}
          <input className="mt-1 w-full rounded-2xl border border-pink-100 p-3 text-lg outline-none focus:border-brand"
            placeholder={f.hint} value={vals[f.key] ?? ""}
            onChange={(e) => setVals((v) => ({ ...v, [f.key]: e.target.value }))} />
        </label>
      ))}
      <StatusNote status={status} />
      <PrimaryButton pending={pending}>{pending ? "Saving…" : "Save names"}</PrimaryButton>
    </form>
  );
}
