"use client";

import { motion } from "framer-motion";

export function AmbientBackground() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
      {/* Dark frosted overlay */}
      <div className="absolute inset-0 bg-[#10121a]/92 backdrop-blur-[28px] z-10" />

      {/* Floating Orb 1: Slate Platinum */}
      <motion.div
        animate={{
          x: [0, 50, -30, 20, 0],
          y: [0, -40, 30, -20, 0],
          scale: [1, 1.18, 0.92, 1.1, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-32 -left-32 w-[550px] h-[550px] bg-slate-600/10 rounded-full blur-[150px] z-10"
      />

      {/* Floating Orb 2: Warm Amber */}
      <motion.div
        animate={{
          x: [0, -60, 40, -30, 0],
          y: [0, 50, -40, 30, 0],
          scale: [1, 0.9, 1.15, 0.95, 1],
        }}
        transition={{
          duration: 26,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/2 -right-32 w-[600px] h-[600px] bg-amber-500/8 rounded-full blur-[180px] z-10"
      />

      {/* Floating Orb 3: Deep Indigo */}
      <motion.div
        animate={{
          x: [0, 40, -50, 30, 0],
          y: [0, -30, 50, -40, 0],
          scale: [1, 1.12, 0.88, 1.05, 1],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -bottom-40 left-1/3 w-[550px] h-[550px] bg-indigo-900/12 rounded-full blur-[160px] z-10"
      />

      {/* Workspace Texture */}
      <img
        src="/bg.jpg"
        alt="Atmospheric Depth"
        className="w-full h-full object-cover object-center opacity-25 mix-blend-luminosity"
      />
    </div>
  );
}
