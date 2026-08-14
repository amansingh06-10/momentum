"use client";

import Link from "next/link";
import { ArrowRight, Code2, Database, Brain } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] gap-16 px-4">
      {/* Hero Section */}
      <div className="text-center max-w-4xl flex flex-col items-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-8">
           <span className="w-2 h-2 rounded-full bg-neo-cyan shadow-[0_0_8px_var(--color-neo-cyan)] animate-pulse" />
           <span className="font-mono text-[10px] uppercase tracking-widest text-neo-muted">System Online v2.0</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
          Master Your Craft. <br />
          <span className="text-gradient">Track Your Momentum.</span>
        </h1>
        
        <p className="text-neo-muted text-base md:text-lg font-mono mb-12 max-w-2xl leading-relaxed opacity-80">
          A high-craft glassmorphic workspace for CSE students. Log DSA progress, monitor your backend roadmap, and organize your college schedule with an integrated AI.
        </p>
        
        <div className="flex items-center gap-6">
           <Link href="/dashboard" className="neo-btn neo-btn-primary px-8 py-4 font-mono text-sm uppercase tracking-widest flex items-center gap-3 group">
             Enter Workspace
             <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
           </Link>
           <a href="https://github.com/Aman06-10" target="_blank" rel="noreferrer" className="font-mono text-xs uppercase tracking-widest text-neo-muted hover:text-white transition-colors border-b border-white/20 pb-1">
             View Github
           </a>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-8">
        <div className="neo-flat p-8 flex flex-col items-start group">
          <div className="w-12 h-12 rounded-xl neo-inset flex items-center justify-center mb-6 text-white/50 group-hover:text-white transition-colors border border-white/5">
            <Code2 size={20} />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">DSA Mastery</h3>
          <p className="font-mono text-xs text-neo-muted leading-relaxed">
            Track your progress through Striver's A2Z sheet. Monitor confidence levels and completion rates seamlessly.
          </p>
        </div>

        <div className="neo-flat p-8 flex flex-col items-start group">
          <div className="w-12 h-12 rounded-xl neo-inset flex items-center justify-center mb-6 text-white/50 group-hover:text-white transition-colors border border-white/5">
            <Database size={20} />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Backend Roadmap</h3>
          <p className="font-mono text-xs text-neo-muted leading-relaxed">
            Visualize your journey from Node.js basics to full-stack MongoDB and PostgreSQL deployments.
          </p>
        </div>

        <div className="neo-flat p-8 flex flex-col items-start group">
          <div className="w-12 h-12 rounded-xl neo-inset flex items-center justify-center mb-6 text-white/50 group-hover:text-white transition-colors border border-white/5">
            <Brain size={20} />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">AI Auto-Logging</h3>
          <p className="font-mono text-xs text-neo-muted leading-relaxed">
            Log your daily sessions using natural language. Let the AI calculate ratings and mutate your state.
          </p>
        </div>
      </div>
    </div>
  );
}
