import { redirect } from "next/navigation";
import { clerkClient } from "@clerk/nextjs/server";
import { isAdmin } from "@/lib/admin";
import UserRow, { type AdminUser } from "./UserRow";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdmin())) redirect("/");

  const cc = await clerkClient();
  const { data, totalCount } = await cc.users.getUserList({ limit: 100, orderBy: "-created_at" });
  const users: AdminUser[] = data.map((u) => ({
    id: u.id,
    name: [u.firstName, u.lastName].filter(Boolean).join(" ") || "—",
    email:
      u.emailAddresses.find((e) => e.id === u.primaryEmailAddressId)?.emailAddress ??
      u.emailAddresses[0]?.emailAddress ?? "—",
    banned: u.banned,
    lastSignIn: u.lastSignInAt ? new Date(u.lastSignInAt).toLocaleDateString() : null,
  }));

  return (
    <main className="space-y-4 p-4">
      <h1 className="pt-2 text-2xl font-bold text-gray-800">Admin 🛡️</h1>
      <p className="text-sm text-gray-500">{totalCount} {totalCount === 1 ? "user" : "users"}. Block, unblock, or reset a password.</p>
      <ul className="space-y-2">
        {users.map((u) => <UserRow key={u.id} user={u} />)}
      </ul>
    </main>
  );
}
