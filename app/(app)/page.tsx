import { formatCents } from "@/lib/money";

// Placeholder figures until DB wiring lands. Replace with server queries.
const demo = {
  monthByBusiness: [
    { label: "Tobacco", cents: 42000 },
    { label: "Card Nights", cents: 31500 },
    { label: "Dealer", cents: 9000 },
    { label: "Misc", cents: 12000 },
  ],
  momOwes: 8500,
  dueSoon: [
    { name: "Visa •1234", inDays: 2 },
    { name: "Amex •9981", inDays: 5 },
  ],
};

export default function Dashboard() {
  const total = demo.monthByBusiness.reduce((s, b) => s + b.cents, 0);
  return (
    <main className="p-4 space-y-5">
      <header className="pt-2">
        <h1 className="text-2xl font-semibold">Hi Nilou 👋</h1>
        <p className="text-sm text-gray-500">Here's where things stand.</p>
      </header>

      <section className="rounded-2xl bg-brand p-4 text-brand-fg">
        <p className="text-sm/none opacity-90">This month's income</p>
        <p className="mt-1 text-3xl font-bold">{formatCents(total)}</p>
      </section>

      <section className="grid grid-cols-2 gap-3">
        {demo.monthByBusiness.map((b) => (
          <div key={b.label} className="rounded-xl border border-gray-200 bg-white p-3">
            <p className="text-xs text-gray-500">{b.label}</p>
            <p className="text-lg font-semibold">{formatCents(b.cents)}</p>
          </div>
        ))}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-4">
        <p className="text-xs text-gray-500">Mom owes you</p>
        <p className="text-2xl font-bold text-emerald-700">{formatCents(demo.momOwes)}</p>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-4">
        <p className="mb-2 text-sm font-medium">Due this week</p>
        <ul className="space-y-2">
          {demo.dueSoon.map((d) => (
            <li key={d.name} className="flex items-center justify-between text-sm">
              <span>{d.name}</span>
              <span className={d.inDays <= 3 ? "text-red-600 font-medium" : "text-gray-600"}>
                in {d.inDays} day{d.inDays === 1 ? "" : "s"}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
