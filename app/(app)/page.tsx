import { formatCents } from "@/lib/money";
import { getDashboard } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const data = await getDashboard();
  const total = data.monthByBusiness.reduce((s, b) => s + b.cents, 0);

  return (
    <main className="space-y-5 p-4">
      <header className="pt-2">
        <h1 className="text-2xl font-semibold">Hi Nilou 👋</h1>
        <p className="text-sm text-gray-500">Here&apos;s where things stand.</p>
      </header>

      <section className="rounded-2xl bg-brand p-4 text-brand-fg">
        <p className="text-sm/none opacity-90">This month&apos;s income</p>
        <p className="mt-1 text-3xl font-bold">{formatCents(total)}</p>
      </section>

      <section className="grid grid-cols-2 gap-3">
        {data.monthByBusiness.map((b) => (
          <div key={b.label} className="rounded-xl border border-gray-200 bg-white p-3">
            <p className="text-xs text-gray-500">{b.label}</p>
            <p className="text-lg font-semibold">{formatCents(b.cents)}</p>
          </div>
        ))}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-4">
        <p className="text-xs text-gray-500">Mom owes you</p>
        <p className="text-2xl font-bold text-emerald-700">{formatCents(data.momOwes)}</p>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-4">
        <p className="mb-2 text-sm font-medium">Due this week</p>
        {data.dueSoon.length === 0 ? (
          <p className="text-sm text-gray-400">Nothing due in the next 7 days.</p>
        ) : (
          <ul className="space-y-2">
            {data.dueSoon.map((d) => (
              <li key={d.name} className="flex items-center justify-between text-sm">
                <span>{d.name}</span>
                <span className={d.inDays <= 3 ? "font-medium text-red-600" : "text-gray-600"}>
                  {d.inDays === 0 ? "today" : `in ${d.inDays} day${d.inDays === 1 ? "" : "s"}`}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
