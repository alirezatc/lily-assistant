import { formatCents } from "@/lib/money";
export default function ResultBanner({ label, cents }: { label: string; cents: number }) {
  const negative = cents < 0;
  return (
    <div className="flex items-baseline justify-between rounded-xl bg-gray-900 px-4 py-3 text-white">
      <span className="text-sm opacity-80">{label}</span>
      <span className={`text-2xl font-bold ${negative ? "text-red-400" : "text-emerald-400"}`}>
        {formatCents(cents)}
      </span>
    </div>
  );
}
