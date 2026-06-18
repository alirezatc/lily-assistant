import Link from "next/link";
import { formatCents } from "@/lib/money";
import { getDashboard } from "@/lib/queries";
import Greeting from "@/components/Greeting";
import { getFirstName } from "@/lib/user";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const [data, firstName] = await Promise.all([getDashboard(), getFirstName()]);
  const total = data.monthByBusiness.reduce((s, b) => s + b.cents, 0);

  return (
    <main className="space-y-5 p-4">
      <header className="pt-2">
        <Greeting name={firstName} />
        <p className="text-sm text-gray-400">Here&apos;s where things stand.</p>
      </header>

      <section className="rounded-3xl bg-gradient-to-br from-brand to-brand-deep p-5 text-white shadow-soft">
        <p className="text-sm opacity-90">This month&apos;s income</p>
        <p className="mt-1 text-4xl font-extrabold">{formatCents(total)}</p>
      </section>

      <section className="grid grid-cols-2 gap-3">
        {data.monthByBusiness.map((b) => (
          <div key={b.label} className="rounded-2xl border border-pink-100 bg-white p-3 shadow-sm">
            <p className="text-xs font-medium text-gray-400">{b.label}</p>
            <p className="text-lg font-bold text-gray-800">{formatCents(b.cents)}</p>
          </div>
        ))}
      </section>

      <Link href="/settlements" className="block rounded-2xl border border-pink-100 bg-white p-4 shadow-sm">
        <p className="text-xs font-medium text-gray-400">Mom owes you</p>
        <p className="text-2xl font-extrabold text-brand">{formatCents(data.momOwes)}</p>
      </Link>

      <section className="rounded-2xl border border-pink-100 bg-white p-4 shadow-sm">
        <p className="mb-2 text-sm font-bold text-gray-700">Due this week</p>
        {data.dueSoon.length === 0 ? (
          <p className="text-sm text-gray-400">Nothing due in the next 7 days 🎉</p>
        ) : (
          <ul className="space-y-2">
            {data.dueSoon.map((d) => (
              <li key={d.name} className="flex items-center justify-between text-sm">
                <span className="text-gray-700">{d.name}</span>
                <span className={d.inDays <= 3 ? "font-bold text-brand-deep" : "text-gray-500"}>
                  {d.inDays === 0 ? "today" : `in ${d.inDays} day${d.inDays === 1 ? "" : "s"}`}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Link href="/activity" className="block text-center text-sm font-semibold text-brand">
        View all activity →
      </Link>
    </main>
  );
}
