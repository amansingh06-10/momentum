import type { Metadata } from "next";
import "./globals.css";
import { DataProvider } from "@/lib/DataContext";
import { Navigation } from "@/components/Navigation";
import { AIChatDrawer } from "@/components/AIChatDrawer";
import { GlobalDataEditor } from "@/components/GlobalDataEditor";
import { CommandPalette } from "@/components/CommandPalette";
import { ProblemDetailDrawer } from "@/components/ProblemDetailDrawer";
import { FocusTimer } from "@/components/FocusTimer";
import { AmbientBackground } from "@/components/AmbientBackground";

export const metadata: Metadata = {
  title: "Momentum · Developer Command Center",
  description: "Personal DSA Striver's A2Z, Backend Roadmap, and Academics Tracking Monolith",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen relative text-[#f1f5f9] bg-[#10121a] selection:bg-slate-700 selection:text-white overflow-x-hidden">
        {/* Floating Ambient Motion Canvas */}
        <AmbientBackground />
        
        {/* Subtle dot matrix overlay for depth */}
        <div 
          className="fixed inset-0 pointer-events-none z-[9998] opacity-[0.025]" 
          style={{ backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.8) 1px, transparent 1px)", backgroundSize: "28px 28px" }} 
        />

        <DataProvider>
          <Navigation />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative z-10">
            {children}
          </main>
          <CommandPalette />
          <ProblemDetailDrawer />
          <FocusTimer />
          <AIChatDrawer />
          <GlobalDataEditor />
        </DataProvider>
      </body>
    </html>
  );
}
