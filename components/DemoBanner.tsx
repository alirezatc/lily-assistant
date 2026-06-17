import { db } from "@/lib/db";
export default function DemoBanner() {
  if (db) return null;
  return (
    <div className="bg-amber-100 px-4 py-2 text-center text-xs text-amber-900">
      Demo mode — database not connected, so saving is off and figures are samples.
    </div>
  );
}
