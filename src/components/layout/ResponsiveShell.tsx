import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { Sidebar } from "@/components/layout/Sidebar";

export function ResponsiveShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-grid-bg min-h-screen bg-background text-on-background">
      <Sidebar />
      <div className="flex min-h-screen flex-col lg:ml-[250px]">
        <Header />
        <main className="mx-auto w-full max-w-[1440px] flex-1 px-md pb-[88px] pt-lg max-lg:px-[18px] max-lg:pt-[26px] lg:px-xl lg:pb-xl">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
