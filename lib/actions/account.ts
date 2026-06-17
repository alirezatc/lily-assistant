"use server";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { db, schema } from "@/lib/db";

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

export async function saveAccount(input: AccountInput) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");
  if (!db) throw new Error("Database not configured (set DATABASE_URL)");
  await db.insert(schema.creditAccounts).values({ ownerId: userId, ...input });
  revalidatePath("/accounts");
  revalidatePath("/");
}
