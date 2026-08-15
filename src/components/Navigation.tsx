"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useApp } from "@/lib/DataContext";
import { AnimatedLogo } from "./AnimatedLogo";
import {
  LayoutDashboard,
  BookOpen,
  Search,
  Calendar,
  Server,
  Clock,
  GraduationCap,
  Home,
  Activity,
  Edit3,
  Check,
  Settings,
  Sparkles,
  Flame,
  Zap,
  Plus,
  Timer
} from "lucide-react";

export function Navigation() {
  const pathname = usePathname();
  const {
    stats,
    isEditMode,
    setIsEditMode,
    setIsChatOpen,
    setIsDataModalOpen,
    setIsCommandPaletteOpen,
    setIsTimerOpen
  } = useApp();

  const tabs = [
    { id: "/", label: "Home", icon: Home },
    { id: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "/progress", label: "DSA Sheet", icon: BookOpen },
    { id: "/problems", label: "Problems", icon: Search },
    { id: "/weekly", label: "Weekly Logs", icon: Calendar },
    { id: "/heatmap", label: "Heatmap", icon: Activity },
    { id: "/backend", label: "Backend", icon: Server },
    { id: "/schedule", label: "Schedule", icon: Clock },
    { id: "/academics", label: "Academics", icon: GraduationCap },
  ];

  return (
    <header className="sticky top-0 z-50 pt-3.5 sm:pt-4 px-4 sm:px-6 lg:px-8 mb-4 sm:mb-6 pb-3 bg-[#10121a]/90 backdrop-blur-xl border-b border-white/[0.04]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3 sm:mb-4 max-w-7xl mx-auto">
        {/* Brand with Multi-Axis Animated Logo */}
        <Link href="/" className="flex items-center gap-3.5 group">
          <AnimatedLogo />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white group-hover:text-slate-200 transition-colors">
                Momentum
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md neo-inset text-slate-400 font-medium">
                v2.0
              </span>
            </div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
              Developer Command Center
            </div>
          </div>
        </Link>

        {/* Action Controls & Telemetry */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
          {/* Quick Command Palette Button (Cmd+K) */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setIsCommandPaletteOpen(true)}
            className="px-3 py-1.5 rounded-xl neo-btn text-xs font-mono flex items-center gap-2"
          >
            <Search size={13} className="text-slate-400" />
            <span className="hidden sm:inline">Search</span>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded neo-inset text-slate-400">
              ⌘K
            </span>
          </motion.button>

          {/* Pomodoro Focus Timer Pill with Rotating Icon */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setIsTimerOpen(true)}
            className="px-3 py-1.5 rounded-xl neo-btn text-xs font-mono flex items-center gap-1.5 text-slate-300 hover:text-white"
            title="Open Pomodoro Focus Timer"
          >
            <Timer size={13} className="text-amber-400 animate-spin" style={{ animationDuration: '10s' }} />
            <span className="hidden sm:inline">Focus</span>
          </motion.button>

          {/* Live Streak & Mastery Widget with Flame Breathing Pulse */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="px-3.5 py-1.5 flex items-center gap-3 neo-inset rounded-xl"
          >
            <div className="flex items-center gap-1.5 text-amber-400">
              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, -4, 4, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Flame size={13} />
              </motion.div>
              <span className="font-mono text-xs font-bold text-slate-200">
                {stats.streak} <span className="text-slate-500 font-normal text-[10px]">streak</span>
              </span>
            </div>
            <div className="w-[1px] h-3 bg-white/10" />
            <div className="flex items-center gap-1 font-mono text-[10px] text-slate-300">
              <Zap size={11} className="text-amber-400" />
              <span>{stats.doneTopics} solved ({stats.overallPct}%)</span>
            </div>
          </motion.div>

          {/* Raw JSON Data Settings */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsDataModalOpen(true)}
            className="p-2 text-slate-400 hover:text-white rounded-xl neo-btn"
            title="State Editor & JSON Backup"
          >
            <Settings size={14} />
          </motion.button>

          {/* Edit Mode Toggle */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setIsEditMode(!isEditMode)}
            className={`px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider flex items-center gap-1.5 rounded-xl transition-all ${
              isEditMode
                ? "neo-inset text-amber-400 font-bold"
                : "neo-btn text-slate-300 hover:text-white"
            }`}
          >
            {isEditMode ? <Check size={12} className="text-amber-400" /> : <Edit3 size={12} />}
            <span>{isEditMode ? "Editing" : "Edit"}</span>
          </motion.button>

          {/* Log Session / Quick AI */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setIsChatOpen(true)}
            className="px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider font-semibold rounded-xl neo-btn-primary flex items-center gap-1.5"
          >
            <Plus size={13} className="stroke-[2.5]" />
            <span>Log Study</span>
          </motion.button>
        </div>
      </div>

      {/* Navigation Tabs Bar with Gliding Indicator & Fading Edges */}
      <div className="relative max-w-7xl mx-auto overflow-hidden">
        <nav className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-0.5 scrollbar-none">
          {tabs.map((t) => {
            const isActive = pathname === t.id;
            const Icon = t.icon;
            return (
              <Link
                key={t.id}
                href={t.id}
                className={`relative flex items-center gap-1.5 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider whitespace-nowrap rounded-xl transition-all ${
                  isActive
                    ? "text-white font-bold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav-indicator"
                    className="absolute inset-0 neo-inset rounded-xl -z-10"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                {!isActive && (
                  <div className="absolute inset-0 neo-btn rounded-xl -z-20 opacity-80" />
                )}
                <Icon
                  size={13}
                  className={`relative z-10 transition-colors ${
                    isActive ? "text-amber-400" : "text-slate-400 opacity-80"
                  }`}
                />
                <span className="relative z-10">{t.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
