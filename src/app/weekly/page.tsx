"use client";

import { useApp } from "@/lib/DataContext";
import { EditableField } from "@/components/EditableField";
import { LiquidCircleGauge } from "@/components/LiquidProgress";
import { motion } from "framer-motion";
import { Calendar, Flame, Clock, Sparkles, Plus, TrendingUp } from "lucide-react";

export default function WeeklyPage() {
  const { data, updateData, isEditMode, setIsChatOpen } = useApp();

  const handleUpdate = (weekIdx: number, dayIdx: number, field: string, value: any) => {
    const newWeeks = JSON.parse(JSON.stringify(data.weeks || []));
    if (!newWeeks[weekIdx] || !newWeeks[weekIdx].days[dayIdx]) return;

    newWeeks[weekIdx].days[dayIdx][field] = value;

    // Recalculate average
    const weekDays = newWeeks[weekIdx].days.filter(
      (d: any) => d.rating !== null && d.rating !== undefined && !isNaN(Number(d.rating))
    );
    if (weekDays.length > 0) {
      const sum = weekDays.reduce((a: number, d: any) => a + Number(d.rating || 0), 0);
      newWeeks[weekIdx].average = Number((sum / weekDays.length).toFixed(1));
    }

    updateData({ ...data, weeks: newWeeks });
  };

  const getMoodEmoji = (mood?: number) => {
    switch (mood) {
      case 5:
        return "🔥";
      case 4:
        return "⚡";
      case 3:
        return "👍";
      case 2:
        return "😐";
      case 1:
        return "😴";
      default:
        return "⚡";
    }
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
            Weekly Study Journal
          </h2>
          <div className="font-mono text-xs text-slate-400 mt-1">
            Historical day-by-day study sessions, performance ratings (1–10), and study hours
          </div>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setIsChatOpen(true)}
            className="px-4 py-2.5 rounded-xl neo-btn-primary font-mono text-xs font-semibold flex items-center gap-2 transition-all"
          >
            <Plus size={14} className="stroke-[2.5]" />
            <span>Log Study with AI</span>
          </motion.button>
        </div>
      </div>

      {/* Weeks list */}
      <div className="flex flex-col gap-10">
        {(data.weeks || []).map((week, wIdx) => {
          const days = week.days || [];
          const totalHours = days.reduce((sum, d) => sum + (Number(d.hours) || 0), 0);

          return (
            <motion.div
              key={wIdx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: wIdx * 0.08 }}
              className="flex flex-col gap-4"
            >
              {/* Week Title Bar */}
              <div className="flex items-end justify-between border-b border-white/[0.04] pb-3">
                <div className="flex items-baseline gap-3">
                  <h3 className="font-bold text-white text-xl">{week.label}</h3>
                  <span className="font-mono text-xs text-slate-400">({week.range})</span>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-end">
                    <span className="font-mono text-[10px] text-slate-500 uppercase">Total Hours</span>
                    <span className="font-mono text-sm font-bold text-slate-200">{totalHours}h</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-mono text-[10px] text-slate-500 uppercase">Avg Rating</span>
                    <span
                      className={`font-mono text-xl font-extrabold ${
                        (week.average || 0) >= 8.5 ? "text-amber-400" : "text-slate-200"
                      }`}
                    >
                      {(week.average || 0).toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Days Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {days.map((day, dIdx) => (
                  <motion.div
                    key={dIdx}
                    whileHover={{ y: -4, scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 350, damping: 22 }}
                    className="neo-card p-5 flex flex-col justify-between group transition-all"
                  >
                    <div>
                      {/* Day Header */}
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-white text-sm">{day.date}</span>
                          <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#11131c] text-slate-400">
                            {day.day}
                          </span>
                        </div>

                        {/* Liquid Wave Rating Gauge */}
                        <LiquidCircleGauge rating={day.rating} size={42} />
                      </div>

                      {/* Topic Description */}
                      <EditableField
                        value={day.topic}
                        onChange={(v) => handleUpdate(wIdx, dIdx, "topic", v)}
                        className="text-xs text-slate-300 leading-relaxed w-full min-h-[50px] font-sans"
                        renderAs="p"
                      />
                    </div>

                    {/* Footer stats: Mood & Hours */}
                    <div className="mt-4 flex justify-between items-center pt-3 border-t border-white/[0.03] font-mono text-[11px] text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <span>Mood:</span>
                        <span className="text-xs">{getMoodEmoji(day.mood)}</span>
                        <EditableField
                          type="number"
                          value={day.mood || 4}
                          onChange={(v) => handleUpdate(wIdx, dIdx, "mood", v)}
                          className="w-6 text-center text-slate-300"
                        />
                        <span>/5</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} className="text-slate-500" />
                        <EditableField
                          type="number"
                          value={day.hours || 0}
                          onChange={(v) => handleUpdate(wIdx, dIdx, "hours", v)}
                          className="w-8 text-center text-slate-200 font-bold"
                        />
                        <span>hrs</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
