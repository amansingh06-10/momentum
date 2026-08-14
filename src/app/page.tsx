"use client";

import Link from "next/link";
import { ArrowRight, Code2, Database, Brain } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] gap-16 px-4">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-4xl flex flex-col items-center relative z-10"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-8 hover:border-neo-cyan/40 transition-colors">
           <span className="w-2 h-2 rounded-full bg-neo-cyan shadow-[0_0_8px_var(--color-neo-cyan)] animate-pulse" />
           <span className="font-mono text-[10px] uppercase tracking-widest text-neo-muted">System Online v2.0</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
          Master Your Craft. <br />
          <span className="text-gradient-cyan">Track Your Momentum.</span>
        </h1>
        
        <p className="text-neo-muted text-base md:text-lg font-mono mb-12 max-w-2xl leading-relaxed opacity-80">
          A high-craft glassmorphic workspace for CSE students. Log DSA progress, monitor your backend roadmap, and organize your college schedule with an integrated AI.
        </p>
        
        <div className="flex items-center gap-6">
           <Link href="/dashboard" className="neo-btn neo-btn-primary px-8 py-4 font-mono text-sm uppercase tracking-widest flex items-center gap-3 group shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] transition-all">
             Enter Workspace
             <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
           </Link>
           <a href="https://github.com/Aman06-10" target="_blank" rel="noreferrer" className="font-mono text-xs uppercase tracking-widest text-neo-muted hover:text-white transition-colors border-b border-white/20 pb-1">
             View Github
           </a>
        </div>
      </motion.div>

      {/* Feature Grid */}
      <motion.div 
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
          }
        }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-8"
      >
        <motion.div 
          variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
          whileHover={{ y: -6, scale: 1.02 }}
          className="neo-flat p-8 flex flex-col items-start group border border-white/5 hover:border-neo-cyan/30 transition-all duration-300 shadow-lg"
        >
          <div className="w-12 h-12 rounded-xl neo-inset flex items-center justify-center mb-6 text-white/50 group-hover:text-neo-cyan transition-colors border border-white/5 group-hover:border-neo-cyan/20">
            <Code2 size={20} />
          </div>
          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-neo-cyan transition-colors">DSA Mastery</h3>
          <p className="font-mono text-xs text-neo-muted leading-relaxed">
            Track your progress through Striver's A2Z sheet. Monitor confidence levels and completion rates seamlessly.
          </p>
        </motion.div>

        <motion.div 
          variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
          whileHover={{ y: -6, scale: 1.02 }}
          className="neo-flat p-8 flex flex-col items-start group border border-white/5 hover:border-neo-mint/30 transition-all duration-300 shadow-lg"
        >
          <div className="w-12 h-12 rounded-xl neo-inset flex items-center justify-center mb-6 text-white/50 group-hover:text-neo-mint transition-colors border border-white/5 group-hover:border-neo-mint/20">
            <Database size={20} />
          </div>
          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-neo-mint transition-colors">Backend Roadmap</h3>
          <p className="font-mono text-xs text-neo-muted leading-relaxed">
            Visualize your journey from Node.js basics to full-stack MongoDB and PostgreSQL deployments.
          </p>
        </motion.div>

        <motion.div 
          variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
          whileHover={{ y: -6, scale: 1.02 }}
          className="neo-flat p-8 flex flex-col items-start group border border-white/5 hover:border-neo-magenta/30 transition-all duration-300 shadow-lg"
        >
          <div className="w-12 h-12 rounded-xl neo-inset flex items-center justify-center mb-6 text-white/50 group-hover:text-neo-magenta transition-colors border border-white/5 group-hover:border-neo-magenta/20">
            <Brain size={20} />
          </div>
          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-neo-magenta transition-colors">AI Auto-Logging</h3>
          <p className="font-mono text-xs text-neo-muted leading-relaxed">
            Log your daily sessions using natural language. Let the AI calculate ratings and mutate your state.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
