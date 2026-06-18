"use client";
import { useEffect, useState } from "react";

function greet(h: number): { text: string; emoji: string } {
  if (h < 12) return { text: "Good morning", emoji: "🌸" };
  if (h < 17) return { text: "Good afternoon", emoji: "☀️" };
  if (h < 21) return { text: "Good evening", emoji: "🌷" };
  return { text: "Good night", emoji: "🌙" };
}

export default function Greeting({ name }: { name: string }) {
  // Default to a neutral greeting on the server, refine to local time on mount.
  const [g, setG] = useState<{ text: string; emoji: string }>({ text: "Hi", emoji: "👋" });
  useEffect(() => { setG(greet(new Date().getHours())); }, []);
  return (
    <h1 className="text-2xl font-bold text-gray-800">
      {g.text}, {name} {g.emoji}
    </h1>
  );
}
