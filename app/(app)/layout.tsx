import Link from "next/link";
import { Settings, Heart, Shield } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import DemoBanner from "@/components/DemoBanner";
import AccountButton from "@/components/AccountButton";
import { isAdmin } from "@/lib/admin";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const admin = await isAdmin();
  return (
    <div className="pb-24">
      <DemoBanner />
      <div className="flex items-center justify-between px-4 pt-3">
        <span className="flex items-center gap-1.5">
          <span className="bg-gradient-to-r from-brand to-brand-deep bg-clip-text text-lg font-extrabold text-transparent">
            Nilou ✨
          </span>
          <Heart size={16} className="fill-brand text-brand" />
        </span>
        <div className="flex items-center gap-3">
          {admin && (
            <Link href="/admin" aria-label="Admin" className="text-gray-400 active:text-brand">
              <Shield size={22} />
            </Link>
          )}
          <Link href="/settings" aria-label="Settings" className="text-gray-400 active:text-brand">
            <Settings size={22} />
          </Link>
          <AccountButton />
        </div>
      </div>
      {children}
      <BottomNav />
    </div>
  );
}
