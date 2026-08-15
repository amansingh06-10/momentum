"use client";

import { motion } from "framer-motion";

interface LiquidProgressProps {
  percentage: number;
  height?: number;
  className?: string;
}

export function LiquidProgress({ percentage, height = 12, className = "" }: LiquidProgressProps) {
  const clampedPct = Math.min(100, Math.max(0, percentage));

  return (
    <div
      className={`relative w-full overflow-hidden neo-inset rounded-full p-[2px] ${className}`}
      style={{ height: `${height}px` }}
    >
      {/* Liquid Fill Track */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${clampedPct}%` }}
        transition={{ duration: 1.4, ease: "easeOut" }}
        className="relative h-full rounded-full overflow-hidden bg-slate-400"
      >
        {/* Layer 1: Undulating Liquid Wave SVG */}
        <div className="absolute inset-0 w-[200%] h-full liquid-wave opacity-50">
          <svg
            viewBox="0 0 800 50"
            preserveAspectRatio="none"
            className="w-full h-full text-white fill-current"
          >
            <path d="M0,25 C150,50 250,0 400,25 C550,50 650,0 800,25 L800,50 L0,50 Z" />
          </svg>
        </div>

        {/* Layer 2: Counter Wave SVG for fluid turbulence */}
        <div className="absolute inset-0 w-[200%] h-full liquid-wave-slow opacity-60">
          <svg
            viewBox="0 0 800 50"
            preserveAspectRatio="none"
            className="w-full h-full text-amber-300 fill-current"
          >
            <path d="M0,20 C200,0 300,45 500,20 C700,-5 750,45 800,20 L800,50 L0,50 Z" />
          </svg>
        </div>

        {/* Shimmer Light Reflection */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
      </motion.div>
    </div>
  );
}

export function LiquidCircleGauge({
  rating,
  max = 10,
  size = 44,
  className = ""
}: {
  rating: number | null;
  max?: number;
  size?: number;
  className?: string;
}) {
  if (rating === null || rating === undefined) {
    return <span className="text-slate-500 text-xs">🧊</span>;
  }

  const pct = Math.min(100, Math.max(0, (rating / max) * 100));

  return (
    <div
      className={`relative rounded-full neo-inset flex items-center justify-center overflow-hidden ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      {/* Liquid Wave Base Level */}
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: `${pct}%` }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute bottom-0 inset-x-0 bg-amber-500/20 overflow-hidden"
      >
        <div className="absolute top-0 inset-x-0 h-2 w-[200%] liquid-wave opacity-70">
          <svg viewBox="0 0 400 20" preserveAspectRatio="none" className="w-full h-full fill-amber-400">
            <path d="M0,10 C100,20 200,0 400,10 L400,20 L0,20 Z" />
          </svg>
        </div>
      </motion.div>

      {/* SVG Circular Border Ring */}
      <svg className="absolute inset-0 w-full h-full transform -rotate-90 pointer-events-none">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={(size - 8) / 2}
          fill="none"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="2.5"
        />
        <motion.circle
          initial={{ strokeDasharray: `0 ${Math.PI * (size - 8)}` }}
          animate={{
            strokeDasharray: `${(pct / 100) * Math.PI * (size - 8)} ${Math.PI * (size - 8)}`
          }}
          transition={{ duration: 1, ease: "easeOut" }}
          cx={size / 2}
          cy={size / 2}
          r={(size - 8) / 2}
          fill="none"
          stroke={rating >= 8.5 ? "#f59e0b" : "#94a3b8"}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>

      <span
        className={`font-mono text-xs font-bold relative z-10 ${
          rating >= 8.5 ? "text-amber-400" : "text-slate-200"
        }`}
      >
        {rating}
      </span>
    </div>
  );
}
