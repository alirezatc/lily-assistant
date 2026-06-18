"use server";
import { revalidatePath } from "next/cache";
import { db, schema } from "@/lib/db";
import { getOwnerId } from "@/lib/owner";
import type { Responsibility } from "@/lib/money";
import type { SaveResult } from "./types";

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

export async function saveExpense(input: ExpenseInput): Promise<SaveResult> {
  if (!db) return { ok: false, error: "no_db" };
  try {
    await db.insert(schema.expenses).values({
      ownerId: await getOwnerId(),
      occurredOn: input.occurredOn ?? new Date().toISOString().slice(0, 10),
      amountCents: input.amountCents,
      category: input.category,
      responsibility: input.responsibility,
      paidBy: input.paidBy,
      householdMomShareBp: input.householdMomShareBp,
      propertyId: input.propertyId,
      notes: input.notes,
    });
    revalidatePath("/"); revalidatePath("/expenses"); revalidatePath("/settlements"); revalidatePath("/activity");
    return { ok: true };
  } catch {
    return { ok: false, error: "db_error" };
  }
}

export async function saveRepayment(amountCents: number, occurredOn?: string, notes?: string): Promise<SaveResult> {
  if (!db) return { ok: false, error: "no_db" };
  try {
    await db.insert(schema.repayments).values({
      ownerId: await getOwnerId(),
      fromPerson: "mom",
      amountCents,
      occurredOn: occurredOn ?? new Date().toISOString().slice(0, 10),
      notes,
    });
    revalidatePath("/settlements"); revalidatePath("/");
    return { ok: true };
  } catch {
    return { ok: false, error: "db_error" };
  }
}
