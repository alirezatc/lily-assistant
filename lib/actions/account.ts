"use server";
import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { getOwnerId } from "@/lib/owner";
import type { SaveResult } from "./types";

export interface AccountInput {
  name: string;
  type: "credit_card" | "line_of_credit";
  last4?: string;
  issuer?: string;
  creditLimitCents?: number;
  currentBalanceCents?: number;
  minPaymentCents?: number;
  statementDay?: number;
  dueDay?: number;
  autopay?: boolean;
  notes?: string;
}

export async function saveAccount(input: AccountInput): Promise<SaveResult> {
  if (!db) return { ok: false, error: "no_db" };
  try {
    await db.insert(schema.creditAccounts).values({ ownerId: await getOwnerId(), ...input });
    revalidatePath("/accounts"); revalidatePath("/");
    return { ok: true };
  } catch {
    return { ok: false, error: "db_error" };
  }
}

export interface AccountUpdate {
  id: number;
  name?: string;
  last4?: string;
  creditLimitCents?: number;
  currentBalanceCents?: number;
  dueDay?: number;
  type?: "credit_card" | "line_of_credit";
}

export async function updateAccount(input: AccountUpdate): Promise<SaveResult> {
  if (!db) return { ok: false, error: "no_db" };
  try {
    const ownerId = await getOwnerId();
    const { id, ...rest } = input;
    await db.update(schema.creditAccounts).set(rest)
      .where(and(eq(schema.creditAccounts.id, id), eq(schema.creditAccounts.ownerId, ownerId)));
    revalidatePath("/accounts"); revalidatePath("/");
    return { ok: true };
  } catch {
    return { ok: false, error: "db_error" };
  }
}
