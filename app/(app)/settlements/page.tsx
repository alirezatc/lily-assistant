import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { OWNER_ID } from "@/lib/owner";
import { momOwesNilou, formatCents, type ExpenseRecord } from "@/lib/money";
import RepaymentForm from "./RepaymentForm";

export const dynamic = "force-dynamic";

export default async function SettlementsPage() {
  let balance = 0;
  let configured = false;

  if (db) {
    configured = true;
    const exps = await db.select().from(schema.expenses).where(eq(schema.expenses.ownerId, OWNER_ID));
    const reps = await db.select().from(schema.repayments).where(eq(schema.repayments.ownerId, OWNER_ID));
    const records: ExpenseRecord[] = exps.map((e: typeof schema.expenses.$inferSelect) => ({
      amountCents: e.amountCents,
      responsibility: e.responsibility as ExpenseRecord["responsibility"],
      paidBy: e.paidBy as ExpenseRecord["paidBy"],
      householdMomShare: e.householdMomShareBp ? e.householdMomShareBp / 10000 : undefined,
    }));
    balance = momOwesNilou(
      records,
      reps.map((r: typeof schema.repayments.$inferSelect) => ({ amountCents: r.amountCents })),
    );
  }

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
