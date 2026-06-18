import BottomNav from "@/components/BottomNav";
import DemoBanner from "@/components/DemoBanner";
import AccountButton from "@/components/AccountButton";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pb-24">
      <DemoBanner />
      <div className="flex items-center justify-between px-4 pt-3">
        <span className="bg-gradient-to-r from-brand to-brand-deep bg-clip-text text-lg font-extrabold text-transparent">
          Nilou ✨
        </span>
        <AccountButton />
      </div>
      {children}
      <BottomNav />
    </div>
  );
}
