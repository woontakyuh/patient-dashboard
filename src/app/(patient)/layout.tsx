import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <AppHeader />
      <main className="mx-auto w-full max-w-[480px] flex-1 px-4 pb-24 pt-5 md:pb-8">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
