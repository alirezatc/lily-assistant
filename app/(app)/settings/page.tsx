import { getBusinessLabels } from "@/lib/settings";
import BusinessLabelsForm from "./BusinessLabelsForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const labels = await getBusinessLabels();
  return (
    <main className="space-y-4 p-4">
      <h1 className="pt-2 text-2xl font-bold text-gray-800">Settings ⚙️</h1>
      <section className="space-y-2">
        <h2 className="text-sm font-bold text-gray-700">Rename your income types</h2>
        <p className="text-xs text-gray-400">These names show on the home screen and the income tabs.</p>
        <BusinessLabelsForm labels={labels} />
      </section>
    </main>
  );
}
