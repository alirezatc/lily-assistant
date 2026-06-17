import { formatCents } from "@/lib/money";
import { getSettlementBalance } from "@/lib/queries";
import RepaymentForm from "./RepaymentForm";

export const dynamic = "force-dynamic";

export default async function SettlementsPage() {
  const { configured, balance } = await getSettlementBalance();
  return (
    <main className="space-y-5 p-4">
      <h1 className="pt-2 text-2xl font-semibold">Settlements</h1>
      <section className="rounded-2xl bg-brand p-5 text-brand-fg">
        <p className="text-sm opacity-90">Mom owes you</p>
        <p className="mt-1 text-4xl font-bold">{formatCents(balance)}</p>
        {!configured && (
          <p className="mt-2 text-xs opacity-90">Connect the database to see live numbers.</p>
        )}
      </section>
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-gray-700">Mom paid you back</h2>
        <RepaymentForm />
      </section>
    </main>
  );
}
