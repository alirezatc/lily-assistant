import { getAccounts } from "@/lib/queries";
import { formatCents } from "@/lib/money";
import { daysUntilDue } from "@/lib/reminders/dates";
import AccountForm from "./AccountForm";

export const dynamic = "force-dynamic";

export default async function AccountsPage() {
  const accounts = await getAccounts();
  const now = new Date();

  return (
    <main className="space-y-4 p-4">
      <h1 className="pt-2 text-2xl font-semibold">Cards & credit</h1>
      <p className="text-sm text-gray-500">Track every card and line of credit with its due date.</p>

      {accounts.length === 0 ? (
        <p className="rounded-xl bg-gray-50 p-4 text-sm text-gray-500">No accounts yet. Add your first below.</p>
      ) : (
        <ul className="space-y-2">
          {accounts.map((a) => {
            const inDays = a.dueDay ? daysUntilDue(a.dueDay, now) : null;
            return (
              <li key={a.id} className="rounded-xl border bg-white p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{a.name}{a.last4 ? ` •${a.last4}` : ""}</p>
                    <p className="text-xs text-gray-500">
                      {a.type === "line_of_credit" ? "Line of credit" : "Credit card"}
                      {a.currentBalanceCents != null ? ` · bal ${formatCents(a.currentBalanceCents)}` : ""}
                    </p>
                  </div>
                  {inDays != null && (
                    <span className={`text-sm font-medium ${inDays <= 3 ? "text-red-600" : "text-gray-600"}`}>
                      due in {inDays}d
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <AccountForm />
    </main>
  );
}
