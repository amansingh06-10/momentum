"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/DataContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  BookOpen,
  LayoutDashboard,
  Calendar,
  Activity,
  Server,
  Clock,
  GraduationCap,
  Sparkles,
  Flame,
  CheckCircle2,
  X,
  Code2,
  Terminal,
  Settings,
  Edit3,
  Timer,
  ArrowRight
} from "lucide-react";

export function CommandPalette() {
  const router = useRouter();
  const {
    data,
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    setIsChatOpen,
    setIsDataModalOpen,
    isEditMode,
    setIsEditMode,
    setActiveProblem,
    setIsTimerOpen,
    logStudyHours
  } = useApp();

  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  // Flatten all problems
  const allProblems = useMemo(() => {
    return Object.entries(data.progress || {}).flatMap(([sectionKey, section]) => {
      return (section.topics || []).map((topic) => ({
        type: "problem",
        id: topic.id || topic.name,
        title: topic.name,
        subtitle: section.label,
        status: topic.status,
        difficulty: topic.difficulty || "medium",
        sectionKey,
        sectionLabel: section.label,
        topic,
      }));
    });
  }, [data.progress]);

  // Navigation commands
  const navCommands = [
    { type: "nav", id: "/dashboard", title: "Mission Control Dashboard", subtitle: "Overview metrics & countdown", icon: LayoutDashboard },
    { type: "nav", id: "/progress", title: "DSA Sheet Curriculum", subtitle: "16-Step Striver A2Z roadmap", icon: BookOpen },
    { type: "nav", id: "/problems", title: "Problems Database Explorer", subtitle: "Search and filter all problems", icon: Search },
    { type: "nav", id: "/weekly", title: "Weekly Study Journal", subtitle: "Daily ratings & logged hours", icon: Calendar },
    { type: "nav", id: "/heatmap", title: "Activity Heatmap Matrix", subtitle: "182-day activity telemetry", icon: Activity },
    { type: "nav", id: "/backend", title: "Backend Engineering Track", subtitle: "Node.js, Postgres & MongoDB roadmap", icon: Server },
    { type: "nav", id: "/schedule", title: "Weekly Schedule Timetable", subtitle: "College timetable & study blocks", icon: Clock },
    { type: "nav", id: "/academics", title: "Academics Tracker", subtitle: "Semester mid-terms & practical scores", icon: GraduationCap },
  ];

  // Quick Action commands
  const actionCommands = [
    { type: "action", id: "ai", title: "Launch Momentum AI Copilot", subtitle: "Ask coding questions or sync tracker", icon: Sparkles },
    { type: "action", id: "timer", title: "Open Pomodoro Focus Timer", subtitle: "Start 25m / 50m deep work session", icon: Timer },
    { type: "action", id: "log-today", title: "Quick Log: 2 Hours DSA Study", subtitle: "Add 2 hours to today's study session", icon: Calendar },
    { type: "action", id: "edit-mode", title: isEditMode ? "Exit Edit Mode" : "Enter Edit Mode", subtitle: "Inline table & cell editing", icon: Edit3 },
    { type: "action", id: "backup", title: "Data Backup & JSON Editor", subtitle: "Export or modify raw system state", icon: Settings },
  ];

  // Filter items based on query
  const filteredItems = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) {
      return [...actionCommands, ...navCommands];
    }

    const matchedProblems = allProblems
      .filter((p) => p.title.toLowerCase().includes(q) || p.subtitle.toLowerCase().includes(q))
      .slice(0, 8);

    const matchedNav = navCommands.filter(
      (n) => n.title.toLowerCase().includes(q) || n.subtitle.toLowerCase().includes(q)
    );

    const matchedActions = actionCommands.filter(
      (a) => a.title.toLowerCase().includes(q) || a.subtitle.toLowerCase().includes(q)
    );

    return [...matchedActions, ...matchedNav, ...matchedProblems];
  }, [query, allProblems, isEditMode]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = (item: any) => {
    if (!item) return;
    setIsCommandPaletteOpen(false);

    if (item.type === "nav") {
      router.push(item.id);
    } else if (item.type === "problem") {
      setActiveProblem({
        sectionKey: item.sectionKey,
        sectionLabel: item.sectionLabel,
        topic: item.topic,
      });
    } else if (item.type === "action") {
      if (item.id === "ai") setIsChatOpen(true);
      if (item.id === "timer") setIsTimerOpen(true);
      if (item.id === "edit-mode") setIsEditMode(!isEditMode);
      if (item.id === "backup") setIsDataModalOpen(true);
      if (item.id === "log-today") {
        logStudyHours(2, "DSA Practice", 9);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleSelect(filteredItems[selectedIndex]);
    }
  };

  return (
    <AnimatePresence>
      {isCommandPaletteOpen && (
        <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-20 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCommandPaletteOpen(false)}
            className="fixed inset-0 bg-black/65 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -15 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-2xl bg-[#181b26] border border-white/[0.06] rounded-2xl shadow-[12px_12px_35px_rgba(0,0,0,0.8),-8px_-8px_20px_rgba(255,255,255,0.02)] overflow-hidden z-10 font-sans"
          >
            {/* Input Bar */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.04] bg-[#141620]">
              <Search size={18} className="text-slate-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Type a command, search problems, or jump to page..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent text-sm sm:text-base text-white placeholder:text-slate-500 outline-none font-sans"
              />
              <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded neo-inset text-slate-400">
                ESC
              </span>
            </div>

            {/* Results List */}
            <div className="max-h-[380px] overflow-y-auto p-2 divide-y divide-white/[0.02] scrollbar-thin">
              {filteredItems.length > 0 ? (
                filteredItems.map((item: any, idx) => {
                  const isSelected = idx === selectedIndex;
                  const Icon = item.icon || (item.type === "problem" ? Code2 : ArrowRight);

                  return (
                    <div
                      key={`${item.type}-${item.id}-${idx}`}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-all ${
                        isSelected
                          ? "neo-inset text-white font-medium"
                          : "text-slate-300 hover:bg-white/[0.02]"
                      }`}
                    >
                      <div className="flex items-center gap-3 truncate">
                        <div
                          className={`p-2 rounded-lg shrink-0 ${
                            isSelected
                              ? "bg-[#181b26] text-amber-400"
                              : "neo-inset text-slate-400"
                          }`}
                        >
                          <Icon size={15} />
                        </div>
                        <div className="truncate">
                          <div className="text-xs sm:text-sm font-semibold truncate flex items-center gap-2">
                            {item.title}
                            {item.type === "problem" && (
                              <span
                                className={`text-[9px] font-mono px-1.5 py-0.2 rounded uppercase ${
                                  item.status === "done"
                                    ? "bg-[#11131c] text-slate-300"
                                    : item.status === "partial"
                                    ? "bg-[#11131c] text-amber-400"
                                    : "bg-[#11131c] text-slate-500"
                                }`}
                              >
                                {item.status || "pending"}
                              </span>
                            )}
                          </div>
                          <div className="font-mono text-[10px] text-slate-500 truncate">
                            {item.subtitle}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {isSelected && (
                          <span className="font-mono text-[10px] text-amber-400">
                            Press Enter ↵
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center text-slate-500 font-mono text-xs">
                  No matching commands or problems found for &quot;{query}&quot;.
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-2.5 bg-[#141620] border-t border-white/[0.04] flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>Navigate with ↑ ↓ · Select with Enter ↵</span>
              <span>Momentum Quick Command</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
