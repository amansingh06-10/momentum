"use client";

import { useApp } from "@/lib/DataContext";
import { EditableField } from "@/components/EditableField";
import { PaceSimulator } from "@/components/PaceSimulator";
import { LiquidProgress } from "@/components/LiquidProgress";
import { motion, Variants } from "framer-motion";
import {
  Sparkles,
  TrendingUp,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  Flame,
  Zap,
  Target,
  BookOpen,
  Server,
  Activity,
  Plus,
  Timer
} from "lucide-react";
import Link from "next/link";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 24 },
  },
};

export default function OverviewPage() {
  const { stats, data, updateData, setIsChatOpen, setIsTimerOpen } = useApp();

  const handleUpdate = (field: string, value: any) => {
    updateData({ ...data, [field]: value });
  };

  const recentDays = (data.weeks || []).flatMap((w) => w.days).slice(0, 5);

  // Marquee ticker items
  const tickerTopics = [
    "Binary Search on 1D/2D Arrays",
    "Dynamic Programming on Trees",
    "Sliding Window Maximum",
    "PostgreSQL Foreign Keys & Joins",
    "Node.js Cluster & Streams",
    "Kadane's Algorithm $O(N)$",
    "Graph BFS/DFS Traversal",
    "MongoDB Aggregation Pipelines"
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-8 max-w-7xl mx-auto font-sans"
    >
      {/* Telemetry Hero Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full neo-inset text-slate-300 font-mono text-[11px] mb-3">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            Active Session · Aman (CSE 3rd Sem)
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <span className="animated-gradient-text">Mission Control</span>
          </h2>
          <p className="font-mono text-xs sm:text-sm text-slate-400 mt-1">
            Tactile performance telemetry, Striver A2Z tracking, and target countdown
          </p>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setIsTimerOpen(true)}
            className="px-3.5 py-2 rounded-xl neo-btn text-xs font-mono text-slate-300 hover:text-white flex items-center gap-2 transition-all"
          >
            <Timer size={14} className="text-amber-400" />
            <span>Focus Timer</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setIsChatOpen(true)}
            className="px-3.5 py-2 rounded-xl neo-btn text-xs font-mono text-slate-300 hover:text-white flex items-center gap-2 transition-all"
          >
            <Sparkles size={14} className="text-amber-400" />
            <span>AI Copilot</span>
          </motion.button>
          <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }}>
            <Link
              href="/problems"
              className="px-4 py-2 rounded-xl neo-btn-primary font-mono text-xs font-semibold flex items-center gap-2 transition-all inline-flex"
            >
              <span>Solve DSA</span>
              <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Marquee Topic Velocity Ticker */}
      <motion.div
        variants={itemVariants}
        className="neo-inset py-2.5 px-4 overflow-hidden relative rounded-xl"
      >
        <div className="animate-marquee gap-8 items-center text-xs font-mono text-slate-400">
          {tickerTopics.concat(tickerTopics).map((topic, i) => (
            <div key={i} className="flex items-center gap-2 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span className="text-slate-300">{topic}</span>
              <span className="text-slate-600">·</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Main KPI Matrix Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Card 1: Topics Mastery with Liquid Wave Fill */}
        <motion.div
          whileHover={{ y: -4, scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="neo-card p-6 flex flex-col justify-between cursor-default"
        >
          <div>
            <div className="font-mono text-[11px] tracking-wider text-slate-400 uppercase mb-4 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-200 font-semibold">
                <CheckCircle2 size={14} className="text-amber-400" />
                Topics Mastered
              </span>
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            </div>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-5xl font-extrabold tracking-tight text-white leading-none">
                {stats.doneTopics}
              </span>
              <span className="font-mono text-xs text-slate-400">
                /{" "}
                <EditableField
                  type="number"
                  value={data.targetGoal}
                  onChange={(val) => handleUpdate("targetGoal", val)}
                  className="font-bold text-slate-200"
                />{" "}
                Goal
              </span>
            </div>
          </div>
          <div>
            {/* Liquid Wave Progress Track */}
            <div className="mb-2.5">
              <LiquidProgress percentage={stats.overallPct} height={10} />
            </div>
            <div className="flex justify-between font-mono text-[11px] text-slate-400">
              <span className="text-slate-200 font-semibold">{stats.overallPct}% Overall</span>
              <span>{stats.partialTopics} in review</span>
            </div>
          </div>
        </motion.div>

        {/* Card 2: Confidence Retention */}
        <motion.div
          whileHover={{ y: -4, scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="neo-card p-6 flex flex-col justify-between cursor-default"
        >
          <div>
            <div className="font-mono text-[11px] tracking-wider text-slate-400 uppercase mb-4 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-200 font-semibold">
                <Award size={14} className="text-amber-400" />
                Confidence Index
              </span>
              <span className="w-2 h-2 rounded-full bg-slate-600" />
            </div>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-5xl font-extrabold tracking-tight text-white leading-none">
                {stats.avgConfidence}
              </span>
              <span className="font-mono text-xs text-slate-400">/ 10.0</span>
            </div>
          </div>
          <div className="font-mono text-[11px] text-slate-300 neo-inset p-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
            <span>High retention in Binary Search & LL</span>
          </div>
        </motion.div>

        {/* Card 3: Session Rating */}
        <motion.div
          whileHover={{ y: -4, scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="neo-card p-6 flex flex-col justify-between cursor-default"
        >
          <div>
            <div className="font-mono text-[11px] tracking-wider text-slate-400 uppercase mb-4 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-200 font-semibold">
                <Flame size={14} className="text-amber-400" />
                Daily Rating Avg
              </span>
              <span className="w-2 h-2 rounded-full bg-slate-600" />
            </div>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-5xl font-extrabold tracking-tight text-white leading-none">
                {stats.overallAvgRating}
              </span>
              <span className="font-mono text-xs text-slate-400">/ 10.0</span>
            </div>
          </div>
          <div className="font-mono text-[11px] text-slate-300 neo-inset p-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
            <span>Active across {stats.streak}+ tracked sessions</span>
          </div>
        </motion.div>

        {/* Card 4: Target Countdown */}
        <motion.div
          whileHover={{ y: -4, scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="neo-card p-6 flex flex-col justify-between cursor-default"
        >
          <div>
            <div className="font-mono text-[11px] tracking-wider text-slate-400 uppercase mb-3 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-200 font-semibold">
                <Clock size={14} className="text-amber-400" />
                Target Countdown
              </span>
              <EditableField
                type="date"
                value={data.targetDate}
                onChange={(val) => handleUpdate("targetDate", val)}
                className="font-mono text-[10px] text-slate-400"
              />
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-5xl font-extrabold tracking-tight text-white leading-none">
                {stats.daysLeft}
              </span>
              <span className="font-mono text-xs text-slate-400">days left</span>
            </div>
            <div className="flex gap-3 mb-3">
              <div className="flex items-baseline gap-1 font-mono">
                <span className="text-base font-bold text-white">{stats.hoursLeft}</span>
                <span className="text-[10px] text-slate-500">h</span>
              </div>
              <div className="flex items-baseline gap-1 font-mono">
                <span className="text-base font-bold text-white">{stats.minsLeft}</span>
                <span className="text-[10px] text-slate-500">m</span>
              </div>
              <div className="flex items-baseline gap-1 font-mono">
                <motion.span
                  key={stats.secsLeft}
                  initial={{ opacity: 0.4, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-base font-bold text-amber-400 inline-block"
                >
                  {stats.secsLeft}
                </motion.span>
                <span className="text-[10px] text-slate-500">s</span>
              </div>
            </div>
          </div>
          <div className="font-mono text-[11px] text-slate-300 neo-inset p-2.5 text-center">
            Pace needed: <strong className="text-white font-bold">{stats.paceNeededPerDay}</strong> probs/day
          </div>
        </motion.div>
      </motion.div>

      {/* Interactive Pace Simulator Widget */}
      <motion.div variants={itemVariants}>
        <PaceSimulator />
      </motion.div>

      {/* Bottom Section: Recent Study Logs & Quick Launchpad */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Study Feed */}
        <div className="lg:col-span-2 neo-card p-6">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/[0.04]">
            <h3 className="font-mono text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
              <Calendar size={15} className="text-amber-400" />
              Recent Study Sessions
            </h3>
            <Link href="/weekly" className="font-mono text-[11px] text-slate-400 hover:text-white flex items-center gap-1">
              View All <ArrowRight size={12} />
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            {recentDays.map((day, idx) => (
              <motion.div
                key={idx}
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="p-3.5 rounded-xl neo-inset flex items-center justify-between transition-colors gap-4"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-white w-14 shrink-0">{day.date}</span>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#181b26] text-slate-400 shrink-0">
                    {day.day}
                  </span>
                  <span className="text-xs text-slate-300 font-sans truncate max-w-xs sm:max-w-md">
                    {day.topic}
                  </span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-mono text-xs text-slate-400">{day.hours}h</span>
                  {day.rating !== null && day.rating !== undefined ? (
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#181b26] text-amber-400">
                      {day.rating}/10
                    </span>
                  ) : (
                    <span className="text-xs">🧊</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Command Launchpad */}
        <div className="neo-card p-6 flex flex-col justify-between">
          <div>
            <div className="font-mono text-sm font-bold text-white mb-4 pb-3 border-b border-white/[0.04] flex items-center gap-2 uppercase tracking-wider">
              <Target size={15} className="text-amber-400" />
              Quick Launchpad
            </div>
            <div className="flex flex-col gap-2.5">
              <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/progress"
                  className="p-3 rounded-xl neo-btn flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5 text-xs font-mono text-slate-300 group-hover:text-white">
                    <BookOpen size={14} className="text-amber-400" />
                    <span>Striver DSA Sheet</span>
                  </div>
                  <ArrowRight size={13} className="text-slate-500 group-hover:translate-x-1 group-hover:text-white transition-transform" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/backend"
                  className="p-3 rounded-xl neo-btn flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5 text-xs font-mono text-slate-300 group-hover:text-white">
                    <Server size={14} className="text-amber-400" />
                    <span>Backend Roadmap</span>
                  </div>
                  <ArrowRight size={13} className="text-slate-500 group-hover:translate-x-1 group-hover:text-white transition-transform" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/heatmap"
                  className="p-3 rounded-xl neo-btn flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5 text-xs font-mono text-slate-300 group-hover:text-white">
                    <Activity size={14} className="text-amber-400" />
                    <span>Activity Heatmap</span>
                  </div>
                  <ArrowRight size={13} className="text-slate-500 group-hover:translate-x-1 group-hover:text-white transition-transform" />
                </Link>
              </motion.div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/[0.04] font-mono text-[11px] text-slate-400 flex items-center justify-between">
            <span>Freezes allowed:</span>
            <span className="text-white font-bold">{data.freezesUsedThisMonth || 0} / {data.freezesAllowed || 2} used</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
