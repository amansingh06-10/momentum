import type { Metadata } from "next";
import "./globals.css";
import { DataProvider } from "@/lib/DataContext";
import { Navigation } from "@/components/Navigation";
import { AIChatDrawer } from "@/components/AIChatDrawer";
import { GlobalDataEditor } from "@/components/GlobalDataEditor";

export const metadata: Metadata = {
  title: "Momentum - CSE Tracker",
  description: "Striver's A2Z & Backend Tracker Monolith",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen relative text-neo-text">
        {/* Background Image Layer */}
        <div className="fixed inset-0 z-[-1] overflow-hidden">
          <div className="absolute inset-0 bg-[#0a0a0c]/80 backdrop-blur-[8px] z-10" />
          <img 
            src="/bg.jpg" 
            alt="Workspace Background" 
            className="w-full h-full object-cover object-center opacity-60 mix-blend-luminosity"
          />
        </div>
        
        <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03]" 
             style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 255, 255, 1) 2px, rgba(255, 255, 255, 1) 4px)" }} />
        
        <DataProvider>
          <Navigation />
          <main className="max-w-7xl mx-auto px-8 py-10">
            {children}
          </main>
          <AIChatDrawer />
          <GlobalDataEditor />
        </DataProvider>
      </body>
    </html>
  );
}
