import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { OWNER_ID } from "@/lib/owner";
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

function demoDashboard() {
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

export async function getDashboard(now = new Date()) {
  if (!db) return demoDashboard();
  try {
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
    const incomes = (await db.select().from(schema.incomeEvents)
      .where(eq(schema.incomeEvents.ownerId, OWNER_ID))) as (typeof schema.incomeEvents.$inferSelect)[];
    const totals: Record<string, number> = {};
    for (const i of incomes) {
      if (i.occurredOn >= monthStart) totals[i.business] = (totals[i.business] ?? 0) + i.netCents;
    }
    const monthByBusiness: BusinessTotal[] = Object.keys(BUSINESS_LABELS).map((b) => ({
      label: BUSINESS_LABELS[b], cents: totals[b] ?? 0,
    }));

    const exps = (await db.select().from(schema.expenses)
      .where(eq(schema.expenses.ownerId, OWNER_ID))) as (typeof schema.expenses.$inferSelect)[];
    const reps = (await db.select().from(schema.repayments)
      .where(eq(schema.repayments.ownerId, OWNER_ID))) as (typeof schema.repayments.$inferSelect)[];
    const records: ExpenseRecord[] = exps.map((e) => ({
      amountCents: e.amountCents,
      responsibility: e.responsibility as ExpenseRecord["responsibility"],
      paidBy: e.paidBy as ExpenseRecord["paidBy"],
      householdMomShare: e.householdMomShareBp ? e.householdMomShareBp / 10000 : undefined,
    }));
    const momOwes = momOwesNilou(records, reps.map((r) => ({ amountCents: r.amountCents })));

    const accounts = (await db.select().from(schema.creditAccounts)
      .where(eq(schema.creditAccounts.ownerId, OWNER_ID))) as (typeof schema.creditAccounts.$inferSelect)[];
    const dueSoon: DueItem[] = accounts
      .filter((a) => a.dueDay)
      .map((a) => ({
        name: a.last4 ? `${a.name} •${a.last4}` : a.name,
        inDays: daysUntilDue(a.dueDay as number, now),
      }))
      .filter((d) => d.inDays <= 7)
      .sort((x, y) => x.inDays - y.inDays);

    return { live: true, monthByBusiness, momOwes, dueSoon };
  } catch {
    // DB configured but unreachable/failing — degrade to demo instead of 500.
    return demoDashboard();
  }
}

export async function getAccounts() {
  if (!db) return [];
  try {
    const rows = (await db.select().from(schema.creditAccounts)
      .where(eq(schema.creditAccounts.ownerId, OWNER_ID))) as (typeof schema.creditAccounts.$inferSelect)[];
    return rows.sort((a, b) => (a.dueDay ?? 99) - (b.dueDay ?? 99));
  } catch {
    return [];
  }
}

export async function getSettlementBalance() {
  if (!db) return { configured: false, balance: 0 };
  try {
    const exps = (await db.select().from(schema.expenses)
      .where(eq(schema.expenses.ownerId, OWNER_ID))) as (typeof schema.expenses.$inferSelect)[];
    const reps = (await db.select().from(schema.repayments)
      .where(eq(schema.repayments.ownerId, OWNER_ID))) as (typeof schema.repayments.$inferSelect)[];
    const records: ExpenseRecord[] = exps.map((e) => ({
      amountCents: e.amountCents,
      responsibility: e.responsibility as ExpenseRecord["responsibility"],
      paidBy: e.paidBy as ExpenseRecord["paidBy"],
      householdMomShare: e.householdMomShareBp ? e.householdMomShareBp / 10000 : undefined,
    }));
    const balance = momOwesNilou(records, reps.map((r) => ({ amountCents: r.amountCents })));
    return { configured: true, balance };
  } catch {
    return { configured: false, balance: 0 };
  }
}

export type ActivityRow = {
  id: string;
  date: string;
  kind: "made" | "spent";
  label: string;
  cents: number;
};

const BIZ: Record<string, string> = {
  tobacco: "Tobacco", card_night: "Card Night", dealer: "Dealer", misc: "Misc",
};

export async function getActivity(): Promise<{ live: boolean; rows: ActivityRow[] }> {
  if (!db) {
    return {
      live: false,
      rows: [
        { id: "d1", date: "2026-06-16", kind: "made", label: "Card Night", cents: 20000 },
        { id: "d2", date: "2026-06-15", kind: "spent", label: "utilities", cents: 8500 },
        { id: "d3", date: "2026-06-14", kind: "made", label: "Tobacco", cents: 3000 },
      ],
    };
  }
  try {
    const inc = (await db.select().from(schema.incomeEvents)
      .where(eq(schema.incomeEvents.ownerId, OWNER_ID))) as (typeof schema.incomeEvents.$inferSelect)[];
    const exp = (await db.select().from(schema.expenses)
      .where(eq(schema.expenses.ownerId, OWNER_ID))) as (typeof schema.expenses.$inferSelect)[];
    const rows: ActivityRow[] = [
      ...inc.map((i) => ({ id: `i${i.id}`, date: i.occurredOn, kind: "made" as const, label: BIZ[i.business] ?? i.business, cents: i.netCents })),
      ...exp.map((e) => ({ id: `e${e.id}`, date: e.occurredOn, kind: "spent" as const, label: e.category.replace("_", " "), cents: e.amountCents })),
    ].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
    return { live: true, rows };
  } catch {
    return { live: false, rows: [] };
  }
}
