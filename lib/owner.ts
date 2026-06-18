import { auth } from "@clerk/nextjs/server";
import { clerkEnabled } from "./auth";

/**
 * The data owner for the current request = the signed-in user's id.
 * Every query and insert scopes to this, so each user only ever sees their own
 * data (multi-tenant). When auth is disabled (local dev without Clerk keys),
 * everything falls back to a single shared "demo" owner.
 */
export async function getOwnerId(): Promise<string> {
  if (!clerkEnabled) return "demo";
  const { userId } = await auth();
  return userId ?? "demo";
}
