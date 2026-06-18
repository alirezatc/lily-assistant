import { getAccounts } from "@/lib/queries";
import { daysUntilDue } from "@/lib/reminders/dates";
import AccountForm from "./AccountForm";
import CardItem, { type Card } from "./CardItem";

export const dynamic = "force-dynamic";

export default async function AccountsPage() {
  const accounts = await getAccounts();
  const now = new Date();
  const cards: Card[] = accounts.map((a) => ({
    id: a.id, name: a.name, type: a.type, last4: a.last4,
    currentBalanceCents: a.currentBalanceCents, creditLimitCents: a.creditLimitCents,
    dueDay: a.dueDay, inDays: a.dueDay ? daysUntilDue(a.dueDay, now) : null,
  }));

  return (
    <main className="space-y-4 p-4">
      <h1 className="pt-2 text-2xl font-bold text-gray-800">Cards & credit 💳</h1>
      <p className="text-sm text-gray-400">Give each card a nickname and never miss a due date.</p>

      {cards.length === 0 ? (
        <p className="rounded-2xl bg-white p-4 text-sm text-gray-400 shadow-sm">No cards yet — add your first below.</p>
      ) : (
        <ul className="space-y-2">{cards.map((c) => <CardItem key={c.id} card={c} />)}</ul>
      )}

      <AccountForm />
    </main>
  );
}
