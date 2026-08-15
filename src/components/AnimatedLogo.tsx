"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export function AnimatedLogo() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: "spring", stiffness: 350, damping: 20 }}
      className="relative w-10 h-10 rounded-xl neo-card flex items-center justify-center cursor-pointer overflow-hidden group"
    >
      {/* Background Soft Pulse */}
      <motion.div
        animate={{
          opacity: [0.3, 0.7, 0.3],
          scale: [0.95, 1.05, 0.95],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 bg-amber-500/10 rounded-xl"
      />

      {/* Orbital Rotating SVG Ring */}
      <motion.svg
        animate={{ rotate: 360 }}
        transition={{
          duration: isHovered ? 6 : 18,
          repeat: Infinity,
          ease: "linear",
        }}
        className="w-7 h-7 text-slate-400 group-hover:text-amber-400 transition-colors pointer-events-none"
        viewBox="0 0 100 100"
      >
        <circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          strokeDasharray="60 30"
          strokeLinecap="round"
          opacity="0.75"
        />
        <circle
          cx="50"
          cy="8"
          r="6"
          fill="currentColor"
        />
      </motion.svg>

      {/* Morphing Inner Geometric Core */}
      <motion.div
        animate={{
          borderRadius: isHovered ? ["50%", "25%", "35%", "50%"] : ["50%", "40%", "50%"],
          rotate: isHovered ? [0, 90, 180, 270, 360] : [0, -180, -360],
          scale: isHovered ? [1, 1.25, 1.1] : [1, 0.9, 1],
        }}
        transition={{
          duration: isHovered ? 2 : 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute w-3.5 h-3.5 bg-slate-200 group-hover:bg-amber-400 transition-colors shadow-[0_0_10px_rgba(245,158,11,0.3)] flex items-center justify-center"
      >
        <div className="w-1 h-1 bg-[#10121a] rounded-full" />
      </motion.div>
    </motion.div>
  );
}
