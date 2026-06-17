import BottomNav from "@/components/BottomNav";
import DemoBanner from "@/components/DemoBanner";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pb-20">
      <DemoBanner />
      {children}
      <BottomNav />
    </div>
  );
}
