"use server";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { db, schema } from "@/lib/db";
import type { Responsibility } from "@/lib/money";

export interface ExpenseInput {
  amountCents: number;
  category: string;
  responsibility: Responsibility;
  paidBy: "nilou" | "mom";
  householdMomShareBp?: number;
  propertyId?: number;
  occurredOn?: string;
  notes?: string;
}

export async function saveExpense(input: ExpenseInput) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");
  if (!db) throw new Error("Database not configured (set DATABASE_URL)");
  await db.insert(schema.expenses).values({
    ownerId: userId,
    occurredOn: input.occurredOn ?? new Date().toISOString().slice(0, 10),
    amountCents: input.amountCents,
    category: input.category,
    responsibility: input.responsibility,
    paidBy: input.paidBy,
    householdMomShareBp: input.householdMomShareBp,
    propertyId: input.propertyId,
    notes: input.notes,
  });
  revalidatePath("/");
  revalidatePath("/expenses");
  revalidatePath("/settlements");
}

export async function saveRepayment(amountCents: number, occurredOn?: string, notes?: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");
  if (!db) throw new Error("Database not configured (set DATABASE_URL)");
  await db.insert(schema.repayments).values({
    ownerId: userId,
    fromPerson: "mom",
    amountCents,
    occurredOn: occurredOn ?? new Date().toISOString().slice(0, 10),
    notes,
  });
  revalidatePath("/settlements");
  revalidatePath("/");
}
