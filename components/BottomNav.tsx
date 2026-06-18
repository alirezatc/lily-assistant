"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PlusCircle, Receipt, ListOrdered, CreditCard, HeartHandshake } from "lucide-react";

const items = [
  { href: "/", label: "Home", Icon: Home },
  { href: "/income", label: "Income", Icon: PlusCircle },
  { href: "/expenses", label: "Spend", Icon: Receipt },
  { href: "/activity", label: "Activity", Icon: ListOrdered },
  { href: "/accounts", label: "Cards", Icon: CreditCard },
  { href: "/settlements", label: "Owed", Icon: HeartHandshake },
];

export default function BottomNav() {
  const path = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 mx-auto max-w-md glass border-t border-white/40 pb-[env(safe-area-inset-bottom)]">
      <ul className="flex justify-around">
        {items.map(({ href, label, Icon }) => {
          const active = href === "/" ? path === "/" : path.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link href={href}
                className={`flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium transition-colors ${
                  active ? "text-brand" : "text-gray-400"
                }`}>
                <Icon size={22} strokeWidth={active ? 2.5 : 2} className={active ? "fill-brand/10" : ""} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
