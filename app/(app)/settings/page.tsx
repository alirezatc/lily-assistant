import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getBusinessLabels } from "@/lib/settings";
import BusinessLabelsForm from "./BusinessLabelsForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const labels = await getBusinessLabels();
  return (
    <main className="space-y-4 p-4">
      <div className="flex items-center justify-between pt-1">
        <Link href="/" className="flex items-center gap-1 text-sm font-semibold text-brand">
          <ChevronLeft size={18} /> Back
        </Link>
        <Link href="/" className="rounded-full bg-brand px-4 py-1.5 text-sm font-bold text-brand-fg shadow-soft">
          Done
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-gray-800">Settings ⚙️</h1>
      <section className="space-y-2">
        <h2 className="text-sm font-bold text-gray-700">Rename your income types</h2>
        <p className="text-xs text-gray-400">These names show on the home screen and the income tabs.</p>
        <BusinessLabelsForm labels={labels} />
      </section>
    </main>
  );
}
