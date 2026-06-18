import IncomeTabs from "./IncomeTabs";
import { getBusinessLabels } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function IncomePage() {
  const labels = await getBusinessLabels();
  return (
    <main className="space-y-4 p-4">
      <h1 className="pt-2 text-2xl font-bold text-gray-800">Log income 💕</h1>
      <IncomeTabs labels={labels} />
    </main>
  );
}
