"use client";
import type { Status } from "./useSubmit";
export default function StatusNote({ status }: { status: Status }) {
  if (!status) return null;
  return (
    <p
      role="status"
      className={`rounded-lg px-3 py-2 text-sm ${
        status.ok ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-800"
      }`}
    >
      {status.text}
    </p>
  );
}
