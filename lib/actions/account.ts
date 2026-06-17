"use server";
import { revalidatePath } from "next/cache";
import { db, schema } from "@/lib/db";
import { OWNER_ID } from "@/lib/owner";
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
    await db.insert(schema.creditAccounts).values({ ownerId: OWNER_ID, ...input });
    revalidatePath("/accounts");
    revalidatePath("/");
    return { ok: true };
  } catch {
    return { ok: false, error: "db_error" };
  }
}
