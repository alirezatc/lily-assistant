import { getActivity } from "@/lib/queries";
import { formatCents } from "@/lib/money";

export const dynamic = "force-dynamic";

export default async function ActivityPage() {
  const { rows } = await getActivity();
  const made = rows.filter((r) => r.kind === "made").reduce((s, r) => s + r.cents, 0);
  const spent = rows.filter((r) => r.kind === "spent").reduce((s, r) => s + r.cents, 0);

  return (
    <main className="space-y-4 p-4">
      <h1 className="pt-2 text-2xl font-bold text-gray-800">Activity 📒</h1>

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

      {/* Date-range filtering coming next — see BACKLOG.md */}
      {rows.length === 0 ? (
        <p className="rounded-2xl bg-white p-4 text-sm text-gray-400 shadow-sm">No activity yet.</p>
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
              {rows.map((r) => (
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
    </main>
  );
}
