"use server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db, schema } from "@/lib/db";
import { getOwnerId } from "@/lib/owner";
import type { SaveResult } from "./types";

export async function saveBusinessLabels(labels: Record<string, string>): Promise<SaveResult> {
  if (!db) return { ok: false, error: "no_db" };
  try {
    const ownerId = await getOwnerId();
    const existing = await db.select().from(schema.settings).where(eq(schema.settings.ownerId, ownerId));
    if (existing.length) {
      await db.update(schema.settings).set({ businessLabels: labels, updatedAt: new Date() })
        .where(eq(schema.settings.ownerId, ownerId));
    } else {
      await db.insert(schema.settings).values({ ownerId, businessLabels: labels });
    }
    revalidatePath("/"); revalidatePath("/income"); revalidatePath("/activity"); revalidatePath("/settings");
    return { ok: true };
  } catch {
    return { ok: false, error: "db_error" };
  }
}
