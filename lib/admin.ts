import { currentUser } from "@clerk/nextjs/server";
import { clerkEnabled } from "./auth";

/** True only for users whose Clerk publicMetadata.role === "admin". */
export async function isAdmin(): Promise<boolean> {
  if (!clerkEnabled) return false;
  try {
    const u = await currentUser();
    return (u?.publicMetadata as { role?: string } | undefined)?.role === "admin";
  } catch {
    return false;
  }
}
