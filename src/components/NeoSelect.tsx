"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface NeoSelectProps {
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  className?: string;
}

export function NeoSelect({ value, options, onChange, className = "" }: NeoSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-black/20 neo-inset text-xs font-mono text-neo-muted border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-neo-cyan transition-colors"
      >
        <span className="truncate">{selectedOption?.label}</span>
        <ChevronDown size={14} className={`ml-2 transition-transform duration-300 ${isOpen ? "rotate-180 text-neo-cyan" : "text-neo-muted"}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 left-0 w-full min-w-[140px] z-[999] neo-flat border border-white/10 p-1 flex flex-col gap-1 shadow-[0_10px_40px_rgba(0,0,0,0.8)]"
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`text-left px-3 py-2 rounded-md font-mono text-xs transition-colors ${
                  value === option.value
                    ? "bg-neo-cyan/10 text-neo-cyan"
                    : "text-neo-muted hover:bg-white/5 hover:text-white"
                }`}
              >
                {option.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
