"use server";
import { clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/admin";

export type AdminResult = { ok: true; message?: string } | { ok: false; error: string };

export async function banUserAction(userId: string): Promise<AdminResult> {
  if (!(await isAdmin())) return { ok: false, error: "Not authorized" };
  try {
    const cc = await clerkClient();
    await cc.users.banUser(userId);
    revalidatePath("/admin");
    return { ok: true, message: "Blocked" };
  } catch {
    return { ok: false, error: "Couldn't block user" };
  }
}

export async function unbanUserAction(userId: string): Promise<AdminResult> {
  if (!(await isAdmin())) return { ok: false, error: "Not authorized" };
  try {
    const cc = await clerkClient();
    await cc.users.unbanUser(userId);
    revalidatePath("/admin");
    return { ok: true, message: "Unblocked" };
  } catch {
    return { ok: false, error: "Couldn't unblock user" };
  }
}

export async function resetPasswordAction(userId: string): Promise<AdminResult> {
  if (!(await isAdmin())) return { ok: false, error: "Not authorized" };
  try {
    const temp =
      "Nilou-" +
      Math.random().toString(36).slice(2, 8) +
      Math.random().toString(36).slice(2, 4).toUpperCase();
    const cc = await clerkClient();
    await cc.users.updateUser(userId, { password: temp, skipPasswordChecks: true });
    return { ok: true, message: `Temp password: ${temp} (ask them to change it)` };
  } catch {
    return { ok: false, error: "Couldn't reset (they may use Google sign-in only)" };
  }
}
