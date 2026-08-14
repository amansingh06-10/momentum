"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useApp } from "@/lib/DataContext";
import { LayoutDashboard, BookOpen, Search, Calendar, Server, Clock, GraduationCap, Home, Activity, Edit2, Check } from "lucide-react";

export function Navigation() {
  const pathname = usePathname();
  const { stats, data, isEditMode, setIsEditMode, setIsChatOpen, setIsDataModalOpen } = useApp();
  const { Settings } = require('lucide-react');

  const tabs = [
    { id: "/", label: "Home", icon: Home },
    { id: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "/progress", label: "DSA Sheet", icon: BookOpen },
    { id: "/problems", label: "Problems", icon: Search },
    { id: "/weekly", label: "Logs", icon: Calendar },
    { id: "/heatmap", label: "Heatmap", icon: Activity },
    { id: "/backend", label: "Backend", icon: Server },
    { id: "/schedule", label: "Schedule", icon: Clock },
    { id: "/academics", label: "Academics", icon: GraduationCap },
  ];

  return (
    <header className="sticky top-0 z-50 pt-6 px-8 mb-10 pb-4 backdrop-blur-xl bg-[#0a0a0c]/70 border-b border-white/[0.04]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl neo-inset flex items-center justify-center border border-white/10">
             <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-[#0a0a0c] rounded-full"></div>
             </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Momentum
            </h1>
            <div className="font-mono text-[10px] uppercase tracking-widest text-neo-muted mt-0.5">
              Studio Monolith V2
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          {/* Minimalist Streak Widget */}
          <div className="neo-inset px-5 py-2.5 flex items-center gap-4">
            <div className="flex items-center gap-2">
               <div className={`w-2 h-2 rounded-full ${stats.streak > 0 ? 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]' : 'bg-neo-muted'}`}></div>
               <span className="font-mono text-sm font-bold">{stats.streak} <span className="text-neo-muted font-normal text-xs">Day Streak</span></span>
            </div>
            <div className="w-[1px] h-4 bg-white/10"></div>
            <div className="font-mono text-[10px] text-neo-muted">
               {stats.lastDayFrozen ? "Frozen" : "Active"}
            </div>
          </div>

          <button 
            onClick={() => setIsDataModalOpen(true)}
            className="neo-btn px-3 py-3 font-mono text-neo-muted hover:text-white flex items-center justify-center transition-colors"
            title="Data Settings & Backup"
          >
            <Settings size={14} />
          </button>

          <button 
            onClick={() => setIsEditMode(!isEditMode)}
            className={`neo-btn px-4 py-3 font-mono text-[11px] uppercase tracking-widest flex items-center gap-2 ${isEditMode ? 'bg-neo-cyan text-[#0a0a0c]' : ''}`}
          >
            {isEditMode ? <Check size={14} /> : <Edit2 size={14} />}
            {isEditMode ? 'Exit Edit' : 'Edit Mode'}
          </button>

          <button 
            onClick={() => setIsChatOpen(true)}
            className="neo-btn neo-btn-primary px-6 py-3 font-mono text-[11px] uppercase tracking-widest flex items-center gap-2"
          >
            <span className="font-sans text-base leading-none">+</span> Log Session
          </button>
        </div>
      </div>

      <nav className="flex gap-2 overflow-x-auto max-w-7xl mx-auto hide-scrollbar">
        {tabs.map((t) => {
          const isActive = pathname === t.id;
          const Icon = t.icon;
          return (
            <Link
              key={t.id}
              href={t.id}
              className={`relative flex items-center gap-2 px-4 py-2.5 font-mono text-[11px] uppercase tracking-widest whitespace-nowrap rounded-lg transition-all ${
                isActive
                  ? "text-white"
                  : "text-neo-muted hover:text-white hover:bg-white/[0.02]"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute inset-0 bg-white/10 border border-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] rounded-lg -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Icon size={14} className={isActive ? "text-white relative z-10" : "text-neo-muted opacity-70 relative z-10"} />
              <span className="relative z-10">{t.label}</span>
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
