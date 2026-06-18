"use client";
import { useState, useTransition } from "react";
import { ShieldOff, ShieldCheck, KeyRound } from "lucide-react";
import { banUserAction, unbanUserAction, resetPasswordAction, type AdminResult } from "@/lib/actions/admin";

export type AdminUser = { id: string; name: string; email: string; banned: boolean; lastSignIn: string | null };

export default function UserRow({ user }: { user: AdminUser }) {
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();

  const run = (fn: () => Promise<AdminResult>) =>
    start(async () => {
      const r = await fn();
      setMsg(r.ok ? { ok: true, text: r.message ?? "Done" } : { ok: false, text: r.error });
    });

  return (
    <li className="glass rounded-2xl p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-bold text-gray-800">
            {user.name} {user.banned && <span className="text-xs font-medium text-red-500">· blocked</span>}
          </p>
          <p className="truncate text-xs text-gray-500">{user.email}</p>
          <p className="text-xs text-gray-400">
            {user.lastSignIn ? `last seen ${user.lastSignIn}` : "never signed in"}
          </p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {user.banned ? (
          <button disabled={pending} onClick={() => run(() => unbanUserAction(user.id))}
            className="flex items-center gap-1 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 disabled:opacity-50">
            <ShieldCheck size={15} /> Unblock
          </button>
        ) : (
          <button disabled={pending} onClick={() => run(() => banUserAction(user.id))}
            className="flex items-center gap-1 rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 disabled:opacity-50">
            <ShieldOff size={15} /> Block
          </button>
        )}
        <button disabled={pending} onClick={() => run(() => resetPasswordAction(user.id))}
          className="flex items-center gap-1 rounded-xl bg-brand-soft px-3 py-2 text-sm font-semibold text-brand-deep disabled:opacity-50">
          <KeyRound size={15} /> Reset password
        </button>
      </div>
      {msg && (
        <p className={`mt-2 break-words rounded-lg px-3 py-2 text-sm ${msg.ok ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-800"}`}>
          {msg.text}
        </p>
      )}
    </li>
  );
}
