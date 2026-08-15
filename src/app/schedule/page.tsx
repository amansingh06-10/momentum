"use client";

import { useApp } from "@/lib/DataContext";
import { EditableField } from "@/components/EditableField";
import { motion } from "framer-motion";
import { Book, Bus, Code2, Server, Clock, Calendar, Sparkles } from "lucide-react";

export default function SchedulePage() {
  const { data, updateData } = useApp();

  const handleUpdate = (dayIndex: number, field: string, value: string) => {
    const newSchedule = JSON.parse(JSON.stringify(data.schedule || []));
    if (!newSchedule[dayIndex]) return;
    newSchedule[dayIndex][field] = value;
    updateData({ ...data, schedule: newSchedule });
  };

  const currentDayName = new Date().toLocaleDateString("en-US", { weekday: "long" });

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
            Schedule & Focus Architecture
          </h2>
          <div className="font-mono text-xs text-slate-400 mt-1">
            Weekly college timetable, commute optimization, and dedicated DSA & backend study slots
          </div>
        </div>

        <div className="neo-inset px-4 py-2 font-mono text-xs text-slate-300 flex items-center gap-2">
          <Clock size={15} className="text-amber-400" />
          <span>Today is <strong className="text-white">{currentDayName}</strong></span>
        </div>
      </div>

      {/* 7-Day Timetable Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
        {(data.schedule || []).map((day, i) => {
          const isToday = currentDayName.toLowerCase() === day.day.toLowerCase();

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ y: -4, scale: 1.01 }}
              className={`p-4 sm:p-5 rounded-2xl flex flex-col justify-between transition-all ${
                isToday
                  ? "neo-card border border-amber-500/40 shadow-[10px_10px_24px_rgba(0,0,0,0.6)]"
                  : "neo-card"
              }`}
            >
              <div>
                {/* Day Header */}
                <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-white/[0.04]">
                  <h3
                    className={`font-mono font-bold text-base ${
                      isToday ? "text-amber-400" : "text-white"
                    }`}
                  >
                    {day.day}
                  </h3>
                  {isToday && (
                    <span className="font-mono text-[9px] uppercase px-2 py-0.5 rounded-full neo-inset text-amber-400 font-bold animate-pulse">
                      Today
                    </span>
                  )}
                </div>

                {/* Slots Stack */}
                <div className="flex flex-col gap-3">
                  {/* College Routine */}
                  <div className="neo-inset p-3">
                    <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-400 mb-1 uppercase">
                      <Book size={11} className="text-slate-400" />
                      <span>Routine</span>
                    </div>
                    <EditableField
                      value={day.type}
                      onChange={(v) => handleUpdate(i, "type", v)}
                      className="text-xs font-semibold text-slate-200 block"
                      renderAs="div"
                    />
                    <div className="font-mono text-[11px] text-slate-400 mt-1">
                      <EditableField
                        value={day.hours}
                        onChange={(v) => handleUpdate(i, "hours", v)}
                        className="text-slate-300"
                        renderAs="span"
                      />
                    </div>
                  </div>

                  {/* Commute */}
                  <div className="neo-inset p-3">
                    <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-400 mb-1 uppercase">
                      <Bus size={11} className="text-amber-400" />
                      <span>Commute</span>
                    </div>
                    <EditableField
                      value={day.commute}
                      onChange={(v) => handleUpdate(i, "commute", v)}
                      className="font-mono text-xs font-bold text-slate-200"
                      renderAs="div"
                    />
                  </div>

                  {/* DSA Slot */}
                  <div className="neo-inset p-3 border-l-2 border-slate-300">
                    <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-300 mb-1 uppercase">
                      <Code2 size={11} />
                      <span>DSA Slot</span>
                    </div>
                    <EditableField
                      value={day.dsaSlot}
                      onChange={(v) => handleUpdate(i, "dsaSlot", v)}
                      className="font-mono text-xs font-bold text-white"
                      renderAs="div"
                    />
                  </div>

                  {/* Backend Slot */}
                  <div className="neo-inset p-3 border-l-2 border-amber-400">
                    <div className="flex items-center gap-1.5 font-mono text-[10px] text-amber-400 mb-1 uppercase">
                      <Server size={11} />
                      <span>Backend Slot</span>
                    </div>
                    <EditableField
                      value={day.backendSlot}
                      onChange={(v) => handleUpdate(i, "backendSlot", v)}
                      className="font-mono text-xs font-bold text-white"
                      renderAs="div"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
