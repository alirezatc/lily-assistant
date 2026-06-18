import { formatCents } from "@/lib/money";
export default function ResultBanner({ label, cents }: { label: string; cents: number }) {
  const negative = cents < 0;
  return (
    <div className="flex items-baseline justify-between rounded-2xl bg-gradient-to-r from-brand to-brand-deep px-4 py-3 text-white shadow-soft">
      <span className="text-sm font-medium opacity-90">{label}</span>
      <span className={`text-2xl font-bold ${negative ? "text-yellow-200" : "text-white"}`}>
        {formatCents(cents)}
      </span>
    </div>
  );
}
