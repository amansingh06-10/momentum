"use client";

import { useState } from "react";
import { useApp } from "@/lib/DataContext";
import { EditableField } from "@/components/EditableField";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Flame, Clock, Calendar, CheckCircle2 } from "lucide-react";

export default function HeatmapPage() {
  const { data, updateData, isEditMode } = useApp();
  const [hoveredCell, setHoveredCell] = useState<any>(null);

  // Flatten all logged days
  const allDays = (data.weeks || []).flatMap((w) => w.days) || [];
  const ratedDays = allDays.filter((d) => d.rating !== null && d.rating !== undefined);
  const totalHours = allDays.reduce((acc, d) => acc + (Number(d.hours) || 0), 0);

  // Build a mapped 182-day grid (26 weeks x 7 days)
  const gridCells = Array.from({ length: 182 }).map((_, i) => {
    const dayData = allDays[i % (allDays.length || 1)];
    return {
      id: i,
      rating: dayData ? dayData.rating : null,
      date: dayData ? dayData.date : `Day ${i + 1}`,
      topic: dayData ? dayData.topic : "Practice & revision",
      hours: dayData ? dayData.hours : 0,
    };
  });

  const handleRatingUpdate = (dayDate: string, newRating: number) => {
    const newWeeks = JSON.parse(JSON.stringify(data.weeks || []));
    for (let w = 0; w < newWeeks.length; w++) {
      const dIndex = newWeeks[w].days.findIndex((d: any) => d.date === dayDate);
      if (dIndex !== -1) {
        newWeeks[w].days[dIndex].rating = newRating;
        break;
      }
    }
    updateData({ ...data, weeks: newWeeks });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col gap-8 max-w-7xl mx-auto font-sans"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            Activity Heatmap Matrix
          </h2>
          <div className="font-mono text-xs text-slate-400 mt-1">
            Visual activity telemetry matrix across 26 weeks of persistent study sessions
          </div>
        </div>

        <div className="neo-inset px-4 py-2 font-mono text-xs text-slate-300 flex items-center gap-2">
          <Activity size={15} className="text-amber-400" />
          <span>182-Day Matrix</span>
        </div>
      </div>

      {/* Main Heatmap Card */}
      <div className="neo-card p-6 sm:p-8 overflow-x-auto relative">
        {isEditMode && (
          <div className="absolute top-4 right-4 font-mono text-[10px] text-amber-400 neo-inset px-3 py-1 rounded-full animate-pulse">
            Edit Mode: Click active cells to adjust rating
          </div>
        )}

        <div className="min-w-[780px]">
          {/* 7 rows x 26 columns Matrix */}
          <div className="grid grid-rows-7 grid-flow-col gap-2 relative">
            {gridCells.map((cell) => {
              let bgClass = "bg-[#11131c] border border-white/[0.02]"; // Empty
              if (cell.rating !== null && cell.rating !== undefined) {
                if (cell.rating >= 9) {
                  bgClass = "bg-[#f59e0b] shadow-sm";
                } else if (cell.rating >= 8) {
                  bgClass = "bg-[#d97706]";
                } else if (cell.rating >= 6) {
                  bgClass = "bg-[#92400e]";
                } else {
                  bgClass = "bg-[#451a03]";
                }
              }

              return (
                <div
                  key={cell.id}
                  onMouseEnter={() => setHoveredCell(cell)}
                  onMouseLeave={() => setHoveredCell(null)}
                  className="relative group flex items-center justify-center"
                >
                  <motion.div
                    whileHover={{ scale: 1.35 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-[4px] ${bgClass} cursor-pointer`}
                  />
                  {isEditMode && cell.rating !== null && (
                    <div className="absolute opacity-0 group-hover:opacity-100 z-50 bg-[#181b26] border border-white/10 p-1 rounded left-5 top-0 flex gap-1 items-center shadow-xl">
                      <EditableField
                        type="number"
                        value={cell.rating}
                        onChange={(v) => handleRatingUpdate(cell.date, v)}
                        className="w-10 text-[10px] text-white"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Scale Legend & Hover Inspection Tooltip */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 pt-4 border-t border-white/[0.04] font-mono text-xs text-slate-400">
            <div>
              {hoveredCell && hoveredCell.rating !== null ? (
                <span className="text-white">
                  <strong className="text-amber-400">{hoveredCell.date}</strong>:{" "}
                  {hoveredCell.rating}/10 rating ({hoveredCell.hours}h) —{" "}
                  <span className="text-slate-300">{hoveredCell.topic}</span>
                </span>
              ) : (
                <span>Hover over any block to inspect session telemetry</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span>Less</span>
              <div className="w-3.5 h-3.5 rounded-[3px] bg-[#11131c]" />
              <div className="w-3.5 h-3.5 rounded-[3px] bg-[#451a03]" />
              <div className="w-3.5 h-3.5 rounded-[3px] bg-[#92400e]" />
              <div className="w-3.5 h-3.5 rounded-[3px] bg-[#f59e0b]" />
              <span>More</span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary KPI Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div whileHover={{ y: -4 }} className="neo-card p-6">
          <div className="flex items-center gap-2 font-mono text-xs text-slate-400 uppercase tracking-wider mb-2">
            <Flame size={14} className="text-amber-400" />
            <span>Longest Streak</span>
          </div>
          <div className="text-4xl font-extrabold text-white font-mono">
            24 <span className="text-sm text-slate-500 font-normal">days</span>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="neo-card p-6">
          <div className="flex items-center gap-2 font-mono text-xs text-slate-400 uppercase tracking-wider mb-2">
            <Clock size={14} className="text-amber-400" />
            <span>Total Study Hours</span>
          </div>
          <div className="text-4xl font-extrabold text-white font-mono">
            {totalHours.toFixed(1)} <span className="text-sm text-slate-500 font-normal">hrs</span>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="neo-card p-6">
          <div className="flex items-center gap-2 font-mono text-xs text-slate-400 uppercase tracking-wider mb-2">
            <CheckCircle2 size={14} className="text-amber-400" />
            <span>Tracked Days</span>
          </div>
          <div className="text-4xl font-extrabold text-slate-100 font-mono">
            {ratedDays.length} <span className="text-sm text-slate-500 font-normal">sessions</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
