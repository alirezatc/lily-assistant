"use server";
import { revalidatePath } from "next/cache";
import { db, schema } from "@/lib/db";
import { OWNER_ID } from "@/lib/owner";

export interface IncomeInput {
  business: "tobacco" | "card_night" | "dealer" | "misc";
  netCents: number;
  grossCents?: number;
  occurredOn?: string;
  sessionId?: number;
  detail?: unknown;
  notes?: string;
}

export async function saveIncome(input: IncomeInput) {
  if (!db) throw new Error("Database not configured (set DATABASE_URL)");
  const occurredOn = input.occurredOn ?? new Date().toISOString().slice(0, 10);
  await db.insert(schema.incomeEvents).values({
    ownerId: OWNER_ID,
    business: input.business,
    occurredOn,
    grossCents: input.grossCents ?? 0,
    netCents: input.netCents,
    sessionId: input.sessionId,
    detail: input.detail as any,
    notes: input.notes,
  });
  revalidatePath("/");
  revalidatePath("/income");
}
