import { eq, gte } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { OWNER_ID, } from "@/lib/owner";
import { daysUntilDue } from "@/lib/reminders/dates";
import { momOwesNilou, type ExpenseRecord } from "@/lib/money";

export type BusinessTotal = { label: string; cents: number };
export type DueItem = { name: string; inDays: number };

const BUSINESS_LABELS: Record<string, string> = {
  tobacco: "Tobacco",
  card_night: "Card Nights",
  dealer: "Dealer",
  misc: "Misc",
};

export async function getDashboard(now = new Date()) {
  if (!db) {
    return {
      live: false,
      monthByBusiness: [
        { label: "Tobacco", cents: 42000 },
        { label: "Card Nights", cents: 31500 },
        { label: "Dealer", cents: 9000 },
        { label: "Misc", cents: 12000 },
      ] as BusinessTotal[],
      momOwes: 8500,
      dueSoon: [
        { name: "Visa •1234", inDays: 2 },
        { name: "Amex •9981", inDays: 5 },
      ] as DueItem[],
    };
  }

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
  const incomes = await db.select().from(schema.incomeEvents)
    .where(eq(schema.incomeEvents.ownerId, OWNER_ID));
  const totals: Record<string, number> = {};
  for (const i of incomes as (typeof schema.incomeEvents.$inferSelect)[]) {
    if (i.occurredOn >= monthStart) totals[i.business] = (totals[i.business] ?? 0) + i.netCents;
  }
  const monthByBusiness: BusinessTotal[] = Object.keys(BUSINESS_LABELS).map((b) => ({
    label: BUSINESS_LABELS[b], cents: totals[b] ?? 0,
  }));

  const exps = await db.select().from(schema.expenses).where(eq(schema.expenses.ownerId, OWNER_ID));
  const reps = await db.select().from(schema.repayments).where(eq(schema.repayments.ownerId, OWNER_ID));
  const records: ExpenseRecord[] = (exps as (typeof schema.expenses.$inferSelect)[]).map((e) => ({
    amountCents: e.amountCents,
    responsibility: e.responsibility as ExpenseRecord["responsibility"],
    paidBy: e.paidBy as ExpenseRecord["paidBy"],
    householdMomShare: e.householdMomShareBp ? e.householdMomShareBp / 10000 : undefined,
  }));
  const momOwes = momOwesNilou(records, (reps as (typeof schema.repayments.$inferSelect)[]).map((r) => ({ amountCents: r.amountCents })));

  const accounts = await db.select().from(schema.creditAccounts).where(eq(schema.creditAccounts.ownerId, OWNER_ID));
  const dueSoon: DueItem[] = (accounts as (typeof schema.creditAccounts.$inferSelect)[])
    .filter((a) => a.dueDay)
    .map((a) => ({
      name: a.last4 ? `${a.name} •${a.last4}` : a.name,
      inDays: daysUntilDue(a.dueDay as number, now),
    }))
    .filter((d) => d.inDays <= 7)
    .sort((x, y) => x.inDays - y.inDays);

  return { live: true, monthByBusiness, momOwes, dueSoon };
}

export async function getAccounts() {
  if (!db) return [];
  const rows = await db.select().from(schema.creditAccounts).where(eq(schema.creditAccounts.ownerId, OWNER_ID));
  return (rows as (typeof schema.creditAccounts.$inferSelect)[]).sort((a, b) => (a.dueDay ?? 99) - (b.dueDay ?? 99));
}
