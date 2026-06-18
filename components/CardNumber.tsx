"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function CardNumber({ last4 }: { last4?: string | null }) {
  const [show, setShow] = useState(false);
  const tail = last4 ? last4.padStart(4, "•") : "••••";
  const shown = show && last4 ? tail : "••••";
  return (
    <span className="inline-flex items-center gap-2 font-mono tracking-widest text-gray-600">
      •••• •••• •••• {shown}
      <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide" : "Reveal"}
        className="text-gray-400 active:text-brand">
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </span>
  );
}
