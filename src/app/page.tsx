"use client";

import Link from "next/link";
import { ArrowRight, Code2, Database, Brain, Sparkles, Flame, CheckCircle2, TrendingUp, Layers, Terminal } from "lucide-react";
import { motion } from "framer-motion";
import { useApp } from "@/lib/DataContext";

export default function LandingPage() {
  const { stats, setIsChatOpen } = useApp();

  return (
    <div className="flex flex-col items-center justify-center min-h-[78vh] gap-16 px-4 font-sans">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-4xl flex flex-col items-center relative z-10"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full neo-inset mb-8 cursor-default"
        >
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="font-mono text-[11px] uppercase tracking-widest text-slate-300 font-semibold">
            System Online · Momentum v2.0
          </span>
        </motion.div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
          Master Your Craft. <br />
          <span className="animated-gradient-text">
            Track Your Momentum.
          </span>
        </h1>

        <p className="text-slate-400 text-sm sm:text-base md:text-lg font-sans mb-10 max-w-2xl leading-relaxed">
          The personal developer command center. Master Striver&apos;s A2Z DSA sheet, architect production Node.js backends, track academic exams, and synchronize your schedule with an integrated AI copilot.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }}>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-4 font-mono text-xs sm:text-sm uppercase tracking-widest font-bold rounded-2xl neo-btn-primary flex items-center justify-center gap-3 group transition-all"
            >
              <span>Enter Dashboard</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setIsChatOpen(true)}
            className="w-full sm:w-auto px-6 py-4 font-mono text-xs uppercase tracking-widest text-slate-300 hover:text-white rounded-2xl neo-btn transition-all flex items-center justify-center gap-2"
          >
            <Sparkles size={15} className="text-amber-400" />
            <span>Launch AI Copilot</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Feature Pillars Grid */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { staggerChildren: 0.12 },
          },
        }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl"
      >
        <motion.div
          variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
          whileHover={{ y: -6, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="neo-card p-7 flex flex-col items-start group transition-all"
        >
          <div className="w-12 h-12 rounded-xl neo-btn flex items-center justify-center mb-5 text-amber-400 group-hover:scale-105 transition-transform">
            <Code2 size={22} />
          </div>
          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-slate-200 transition-colors">
            DSA Sheet Mastery
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            Track and master all 190+ topics in Striver&apos;s A2Z sheet. Monitor confidence ratings, solve intervals, and review algorithms.
          </p>
        </motion.div>

        <motion.div
          variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
          whileHover={{ y: -6, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="neo-card p-7 flex flex-col items-start group transition-all"
        >
          <div className="w-12 h-12 rounded-xl neo-btn flex items-center justify-center mb-5 text-amber-400 group-hover:scale-105 transition-transform">
            <Database size={22} />
          </div>
          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-slate-200 transition-colors">
            Backend Roadmap
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            Follow a structured roadmap from Node.js runtime fundamentals to PostgreSQL schemas, MongoDB Atlas, JWT authentication, and production REST APIs.
          </p>
        </motion.div>

        <motion.div
          variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
          whileHover={{ y: -6, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="neo-card p-7 flex flex-col items-start group transition-all"
        >
          <div className="w-12 h-12 rounded-xl neo-btn flex items-center justify-center mb-5 text-amber-400 group-hover:scale-105 transition-transform">
            <Brain size={22} />
          </div>
          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-slate-200 transition-colors">
            Natural AI Sync
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            Have natural technical conversations, get algorithmic explanations in C++, and let the AI update your entire tracker in real time.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
