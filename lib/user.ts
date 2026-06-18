import { currentUser } from "@clerk/nextjs/server";
import { clerkEnabled } from "./auth";

/** The signed-in user's first name for greetings. Safe when auth is off. */
export async function getFirstName(): Promise<string> {
  if (!clerkEnabled) return "there";
  try {
    const u = await currentUser();
    return u?.firstName?.trim() || "there";
  } catch {
    return "there";
  }
}
