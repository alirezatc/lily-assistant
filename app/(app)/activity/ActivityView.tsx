"use client";
import { useMemo, useState } from "react";
import { formatCents } from "@/lib/money";
import type { ActivityRow } from "@/lib/queries";

export default function ActivityView({ rows }: { rows: ActivityRow[] }) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const filtered = useMemo(
    () => rows.filter((r) => (!from || r.date >= from) && (!to || r.date <= to)),
    [rows, from, to],
  );
  const made = filtered.filter((r) => r.kind === "made").reduce((s, r) => s + r.cents, 0);
  const spent = filtered.filter((r) => r.kind === "spent").reduce((s, r) => s + r.cents, 0);
  const dateInput = "rounded-xl border border-pink-100 bg-white p-2 text-sm outline-none focus:border-brand";

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-2">
        <label className="flex-1 text-xs font-semibold text-gray-500">From
          <input type="date" className={`mt-1 w-full ${dateInput}`} value={from} onChange={(e) => setFrom(e.target.value)} />
        </label>
        <label className="flex-1 text-xs font-semibold text-gray-500">To
          <input type="date" className={`mt-1 w-full ${dateInput}`} value={to} onChange={(e) => setTo(e.target.value)} />
        </label>
        {(from || to) && (
          <button onClick={() => { setFrom(""); setTo(""); }}
            className="rounded-xl bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-600">Clear</button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-pink-100 bg-white p-3 shadow-sm">
          <p className="text-xs font-medium text-gray-400">Made</p>
          <p className="text-lg font-bold text-emerald-600">{formatCents(made)}</p>
        </div>
        <div className="rounded-2xl border border-pink-100 bg-white p-3 shadow-sm">
          <p className="text-xs font-medium text-gray-400">Spent</p>
          <p className="text-lg font-bold text-brand-deep">{formatCents(spent)}</p>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-2xl bg-white p-4 text-sm text-gray-400 shadow-sm">No activity in this range.</p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-pink-100 text-left text-xs text-gray-400">
                <th className="p-3 font-medium">Date</th>
                <th className="p-3 font-medium">Item</th>
                <th className="p-3 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-pink-50 last:border-0">
                  <td className="p-3 text-gray-500">{r.date.slice(5)}</td>
                  <td className="p-3 capitalize text-gray-700">{r.label}</td>
                  <td className={`p-3 text-right font-bold ${r.kind === "made" ? "text-emerald-600" : "text-brand-deep"}`}>
                    {r.kind === "made" ? "+" : "−"}{formatCents(r.cents)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
