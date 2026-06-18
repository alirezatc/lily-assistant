import Link from "next/link";
import { Settings, Heart } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import DemoBanner from "@/components/DemoBanner";
import AccountButton from "@/components/AccountButton";

export default function AppLayout({ children }: { children: React.ReactNode }) {
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
