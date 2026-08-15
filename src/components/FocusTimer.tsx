"use client";

import { useState, useEffect } from "react";
import { useApp } from "@/lib/DataContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  X,
  CheckCircle2,
  Flame,
  Plus,
  Sparkles,
  Award
} from "lucide-react";

export function FocusTimer() {
  const { isTimerOpen, setIsTimerOpen, logStudyHours } = useApp();
  const [mode, setMode] = useState<"pomodoro" | "deep" | "stopwatch">("pomodoro");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionTopic, setSessionTopic] = useState("DSA Problem Solving");
  const [loggedNotification, setLoggedNotification] = useState<string | null>(null);

  const initialTimeMap = {
    pomodoro: 25 * 60,
    deep: 50 * 60,
    stopwatch: 0,
  };

  useEffect(() => {
    let timer: any = null;
    if (isRunning) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (mode === "stopwatch") {
            return prev + 1;
          }
          if (prev <= 1) {
            clearInterval(timer);
            setIsRunning(false);
            handleAutoLogSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, mode]);

  const handleModeChange = (newMode: "pomodoro" | "deep" | "stopwatch") => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(initialTimeMap[newMode]);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(initialTimeMap[mode]);
  };

  const handleAutoLogSession = () => {
    const elapsedSeconds =
      mode === "stopwatch" ? timeLeft : initialTimeMap[mode] - timeLeft;
    const hours = Math.max(0.1, Number((elapsedSeconds / 3600).toFixed(1)));
    logStudyHours(hours, sessionTopic, 9);
    setLoggedNotification(`Logged ${hours}h for "${sessionTopic}"!`);
    setTimeout(() => setLoggedNotification(null), 3500);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const totalDuration = initialTimeMap[mode] || 1;
  const progressPct =
    mode === "stopwatch"
      ? Math.min(100, (timeLeft / (60 * 60)) * 100)
      : Math.round(((totalDuration - timeLeft) / totalDuration) * 100);

  return (
    <AnimatePresence>
      {isTimerOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsTimerOpen(false)}
            className="fixed inset-0 bg-black/65 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            transition={{ type: "spring", damping: 25, stiffness: 280 }}
            className="relative w-full max-w-md bg-[#181b26] border border-white/[0.06] rounded-3xl p-6 sm:p-7 shadow-[12px_12px_35px_rgba(0,0,0,0.8),-8px_-8px_20px_rgba(255,255,255,0.02)] z-10 font-sans flex flex-col items-center text-center overflow-hidden"
          >
            {/* Header */}
            <div className="w-full flex justify-between items-center mb-6">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <Timer size={18} className="text-amber-400" />
                <span>Focus Deep Work Timer</span>
              </div>
              <button
                onClick={() => setIsTimerOpen(false)}
                className="p-1.5 rounded-xl neo-btn text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            {/* Mode Selector Tabs */}
            <div className="flex gap-2 p-1 rounded-2xl neo-inset mb-6 w-full font-mono text-xs">
              <button
                onClick={() => handleModeChange("pomodoro")}
                className={`flex-1 py-2 rounded-xl transition-all ${
                  mode === "pomodoro"
                    ? "bg-[#181b26] text-white font-bold shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                25m Pomodoro
              </button>
              <button
                onClick={() => handleModeChange("deep")}
                className={`flex-1 py-2 rounded-xl transition-all ${
                  mode === "deep"
                    ? "bg-[#181b26] text-white font-bold shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                50m Deep Work
              </button>
              <button
                onClick={() => handleModeChange("stopwatch")}
                className={`flex-1 py-2 rounded-xl transition-all ${
                  mode === "stopwatch"
                    ? "bg-[#181b26] text-white font-bold shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Stopwatch
              </button>
            </div>

            {/* Circular Timer Display */}
            <div className="relative w-48 h-48 flex items-center justify-center my-2">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="86"
                  fill="none"
                  stroke="#0f1018"
                  strokeWidth="8"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="86"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={540}
                  strokeDashoffset={540 - (540 * progressPct) / 100}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-mono text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                  {formatTime(timeLeft)}
                </span>
                <span className="font-mono text-[11px] text-slate-400 uppercase tracking-widest mt-1">
                  {isRunning ? "Ticking · Focus" : "Paused"}
                </span>
              </div>
            </div>

            {/* Topic Input */}
            <div className="w-full mt-4 mb-5">
              <input
                type="text"
                value={sessionTopic}
                onChange={(e) => setSessionTopic(e.target.value)}
                placeholder="What are you focusing on (e.g. Dynamic Programming)?"
                className="w-full neo-inset px-4 py-2.5 text-xs text-center text-white placeholder:text-slate-500 outline-none"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 w-full">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className="flex-1 py-3 rounded-2xl neo-btn-primary font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
              >
                {isRunning ? <Pause size={15} /> : <Play size={15} />}
                <span>{isRunning ? "Pause" : "Start Session"}</span>
              </button>

              <button
                onClick={handleReset}
                className="p-3 rounded-2xl neo-btn text-slate-400 hover:text-white transition-colors"
                title="Reset Timer"
              >
                <RotateCcw size={16} />
              </button>

              <button
                onClick={handleAutoLogSession}
                className="px-3.5 py-3 rounded-2xl neo-btn text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-colors"
                title="Log time studied so far"
              >
                <Plus size={14} />
                <span>Log</span>
              </button>
            </div>

            {/* Notification Badge */}
            {loggedNotification && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 px-3 py-1.5 rounded-xl neo-inset text-emerald-300 font-mono text-xs flex items-center gap-2"
              >
                <CheckCircle2 size={14} className="text-emerald-400" />
                <span>{loggedNotification}</span>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
