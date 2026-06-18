import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { getOwnerId } from "@/lib/owner";

export type BusinessKey = "tobacco" | "card_night" | "dealer" | "misc";

export const DEFAULT_LABELS: Record<BusinessKey, string> = {
  tobacco: "Tobacco",
  card_night: "Card Night",
  dealer: "Dealer",
  misc: "Misc",
};

export async function getBusinessLabels(): Promise<Record<BusinessKey, string>> {
  if (!db) return { ...DEFAULT_LABELS };
  try {
    const ownerId = await getOwnerId();
    const rows = (await db.select().from(schema.settings)
      .where(eq(schema.settings.ownerId, ownerId))) as (typeof schema.settings.$inferSelect)[];
    const override = (rows[0]?.businessLabels ?? {}) as Partial<Record<BusinessKey, string>>;
    const merged = { ...DEFAULT_LABELS };
    for (const k of Object.keys(DEFAULT_LABELS) as BusinessKey[]) {
      if (override[k] && String(override[k]).trim()) merged[k] = String(override[k]).trim();
    }
    return merged;
  } catch {
    return { ...DEFAULT_LABELS };
  }
}
