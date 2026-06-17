"use client";
import { useState } from "react";
import type { SaveResult } from "@/lib/actions/types";

export type Status = { ok: boolean; text: string } | null;

export function useSubmit() {
  const [status, setStatus] = useState<Status>(null);
  const [pending, setPending] = useState(false);

  async function run(fn: () => Promise<SaveResult>, successText = "Saved ✓") {
    setPending(true);
    setStatus(null);
    try {
      const res = await fn();
      if (res.ok) setStatus({ ok: true, text: successText });
      else
        setStatus({
          ok: false,
          text:
            res.error === "no_db"
              ? "Not saved — the database isn't connected yet."
              : "Couldn't save. Please try again.",
        });
    } catch {
      setStatus({ ok: false, text: "Couldn't save. Please try again." });
    } finally {
      setPending(false);
    }
  }

  return { status, pending, run };
}
