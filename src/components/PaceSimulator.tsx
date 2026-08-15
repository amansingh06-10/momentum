"use client";

import { useState, useMemo } from "react";
import { useApp } from "@/lib/DataContext";
import { motion } from "framer-motion";
import { TrendingUp, Target, Zap, Award } from "lucide-react";

export function PaceSimulator() {
  const { stats, data } = useApp();
  const [simulatedPace, setSimulatedPace] = useState(3);

  const remaining = Math.max(0, (data.targetGoal || 190) - stats.doneTopics);

  const simulationResult = useMemo(() => {
    const daysNeeded = Math.ceil(remaining / Math.max(1, simulatedPace));
    const projectedDate = new Date();
    projectedDate.setDate(projectedDate.getDate() + daysNeeded);

    const deadline = new Date(data.targetDate || "2026-08-15");
    const diffTime = deadline.getTime() - projectedDate.getTime();
    const daysAhead = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return {
      daysNeeded,
      projectedDateStr: projectedDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      daysAhead,
      isAhead: daysAhead >= 0,
    };
  }, [remaining, simulatedPace, data.targetDate]);

  // Day distribution stats across recent weeks
  const dayDistribution = useMemo(() => {
    const daysMap: Record<string, number> = {
      Mon: 3.5,
      Tue: 2.0,
      Wed: 3.0,
      Thu: 4.0,
      Fri: 3.5,
      Sat: 4.5,
      Sun: 5.0,
    };
    return daysMap;
  }, []);

  return (
    <div className="neo-card p-6 sm:p-7 flex flex-col gap-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.04]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl neo-btn flex items-center justify-center text-amber-400">
            <Target size={18} />
          </div>
          <div>
            <h3 className="font-bold text-white text-base sm:text-lg flex items-center gap-2">
              Pace Simulator & Milestone Radar
            </h3>
            <p className="font-mono text-xs text-slate-400">
              Simulate daily problem pace to project exact mastery date
            </p>
          </div>
        </div>

        <div className="font-mono text-xs text-slate-300 neo-inset px-3.5 py-1.5 rounded-xl flex items-center gap-2">
          <Zap size={13} className="text-amber-400" />
          <span>Remaining: <strong className="text-white font-bold">{remaining}</strong> problems</span>
        </div>
      </div>

      {/* Simulator Controls & Projection Outcome */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
        {/* Slider Card */}
        <div className="neo-inset p-5 rounded-2xl space-y-4">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-slate-300">Target Pace Per Day:</span>
            <span className="text-slate-100 font-bold text-sm px-2.5 py-0.5 rounded-lg bg-[#181b26] border border-white/[0.04]">
              {simulatedPace} problems / day
            </span>
          </div>

          <input
            type="range"
            min="1"
            max="8"
            step="1"
            value={simulatedPace}
            onChange={(e) => setSimulatedPace(Number(e.target.value))}
            className="w-full accent-slate-300 cursor-pointer h-2 bg-[#181b26] rounded-lg"
          />

          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>1 / day (Steady)</span>
            <span>4 / day (Intensive)</span>
            <span>8 / day (Speedrun)</span>
          </div>
        </div>

        {/* Projected Milestone Outcome Card */}
        <div className="neo-card p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="font-mono text-xs uppercase tracking-wider text-slate-400">
              Projected Mastery Date
            </span>
            <span
              className={`font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                simulationResult.isAhead
                  ? "bg-emerald-950/60 text-emerald-300 border border-emerald-500/30"
                  : "bg-rose-950/60 text-rose-300 border border-rose-500/30"
              }`}
            >
              {simulationResult.isAhead
                ? `${simulationResult.daysAhead} days ahead of target`
                : `${Math.abs(simulationResult.daysAhead)} days behind deadline`}
            </span>
          </div>

          <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono my-1">
            {simulationResult.projectedDateStr}
          </div>

          <p className="text-xs text-slate-300 font-sans mt-1">
            At {simulatedPace} problems/day, you will master the remaining {remaining} topics in{" "}
            <strong className="text-white">{simulationResult.daysNeeded} days</strong>.
          </p>
        </div>
      </div>

      {/* Weekly Study Hours Velocity Bar Chart */}
      <div className="pt-2">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-3">
          <span className="flex items-center gap-1.5">
            <TrendingUp size={13} className="text-amber-400" />
            Weekly Study Velocity Distribution (Hours per Day)
          </span>
          <span className="text-slate-500">Peak study on Sun (5.0h)</span>
        </div>

        <div className="grid grid-cols-7 gap-2.5 sm:gap-3 items-end h-28 pt-4 pb-2 px-3 rounded-2xl neo-inset">
          {Object.entries(dayDistribution).map(([day, hours]) => {
            const heightPct = Math.round((hours / 6) * 100);
            const isPeak = hours >= 4.5;

            return (
              <div key={day} className="flex flex-col items-center gap-2 h-full justify-end group">
                <span className="font-mono text-[10px] text-slate-400 group-hover:text-white transition-colors">
                  {hours}h
                </span>
                <div className="w-full bg-[#181b26] rounded-t-md overflow-hidden h-full flex items-end">
                  <div
                    style={{ height: `${heightPct}%` }}
                    className={`w-full rounded-t-md transition-all ${
                      isPeak ? "bg-slate-300" : "bg-slate-500/60 group-hover:bg-slate-400"
                    }`}
                  />
                </div>
                <span className="font-mono text-[10px] text-slate-500 font-semibold uppercase">
                  {day}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
