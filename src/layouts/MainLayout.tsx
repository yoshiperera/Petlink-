import type { ReactNode } from "react";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { SetupNotice } from "@/components/common/SetupNotice";

export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <SetupNotice />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
