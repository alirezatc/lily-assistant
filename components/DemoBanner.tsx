import { db } from "@/lib/db";
export default function DemoBanner() {
  if (db) return null;
  return (
    <div className="bg-brand-soft px-4 py-2 text-center text-xs font-medium text-brand-deep">
      Demo mode — database not connected, so saving is off and figures are samples.
    </div>
  );
}
