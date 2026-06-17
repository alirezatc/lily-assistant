"use server";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { db, schema } from "@/lib/db";

export interface IncomeInput {
  business: "tobacco" | "card_night" | "dealer" | "misc";
  netCents: number;
  grossCents?: number;
  occurredOn?: string; // ISO date; defaults today
  sessionId?: number;
  detail?: unknown;
  notes?: string;
}

export async function saveIncome(input: IncomeInput) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");
  if (!db) throw new Error("Database not configured (set DATABASE_URL)");
  const occurredOn = input.occurredOn ?? new Date().toISOString().slice(0, 10);
  await db.insert(schema.incomeEvents).values({
    ownerId: userId,
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
