import Link from "next/link";

const items = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/income", label: "Income", icon: "💵" },
  { href: "/expenses", label: "Expenses", icon: "🧾" },
  { href: "/accounts", label: "Cards", icon: "💳" },
  { href: "/settlements", label: "Owed", icon: "🤝" },
];

export default function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 mx-auto max-w-md border-t border-gray-200 bg-white pb-[env(safe-area-inset-bottom)]">
      <ul className="flex justify-around">
        {items.map((it) => (
          <li key={it.href} className="flex-1">
            <Link
              href={it.href}
              className="flex flex-col items-center gap-0.5 py-2 text-xs text-gray-600 active:bg-gray-100"
            >
              <span className="text-lg leading-none">{it.icon}</span>
              {it.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
