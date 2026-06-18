import { getActivity } from "@/lib/queries";
import ActivityView from "./ActivityView";

export const dynamic = "force-dynamic";

export default async function ActivityPage() {
  const { rows } = await getActivity();
  return (
    <main className="space-y-4 p-4">
      <h1 className="pt-2 text-2xl font-bold text-gray-800">Activity 📒</h1>
      <ActivityView rows={rows} />
    </main>
  );
}
