"use client";

import { useState } from "react";
import { useApp } from "@/lib/DataContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CheckCircle2,
  Circle,
  ArrowRightCircle,
  Sparkles,
  Code2,
  Terminal,
  Copy,
  Check,
  Save,
  BookOpen,
  Award,
  ExternalLink,
  Flame,
  Brain
} from "lucide-react";

export function ProblemDetailDrawer() {
  const { activeProblem, setActiveProblem, toggleTopicStatus, updateTopicDetails, data } = useApp();
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [notes, setNotes] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  if (!activeProblem) return null;

  const { sectionKey, sectionLabel, topic } = activeProblem;

  const handleStatusToggle = () => {
    toggleTopicStatus(sectionKey, topic.id || topic.name);
  };

  const handleConfidenceChange = (val: number) => {
    updateTopicDetails(sectionKey, topic.id || topic.name, { confidence: val });
  };

  const handleSaveNotes = () => {
    updateTopicDetails(sectionKey, topic.id || topic.name, { notes });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleGenerateSolution = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Provide the optimal C++ solution, clean code, time & space complexity analysis, and 3 bullet points of core intuition for the DSA problem "${topic.name}" from Striver's A2Z Sheet (${sectionLabel}).`,
          currentData: data,
        }),
      });
      const resData = await response.json();
      if (resData.message) {
        updateTopicDetails(sectionKey, topic.id || topic.name, { solution: resData.message });
      }
    } catch (e) {
      console.error("Failed to generate solution:", e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getDifficultyBadge = (diff?: string) => {
    const d = diff || "medium";
    if (d === "easy") {
      return (
        <span className="font-mono text-[11px] uppercase px-2.5 py-0.5 rounded-md bg-[#0f1018] text-emerald-300 font-semibold border border-white/[0.04]">
          Easy
        </span>
      );
    }
    if (d === "hard") {
      return (
        <span className="font-mono text-[11px] uppercase px-2.5 py-0.5 rounded-md bg-[#0f1018] text-rose-300 font-semibold border border-white/[0.04]">
          Hard
        </span>
      );
    }
    return (
      <span className="font-mono text-[11px] uppercase px-2.5 py-0.5 rounded-md bg-[#0f1018] text-amber-300 font-semibold border border-white/[0.04]">
        Medium
      </span>
    );
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setActiveProblem(null)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Slide-over Drawer */}
        <motion.div
          initial={{ x: "100%", opacity: 0.8 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0.8 }}
          transition={{ type: "spring", damping: 28, stiffness: 260 }}
          className="relative w-full sm:w-[580px] md:w-[640px] bg-[#141621] border-l border-white/[0.05] shadow-[-20px_0_50px_rgba(0,0,0,0.8)] z-10 flex flex-col font-sans h-full"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-white/[0.04] flex justify-between items-start bg-[#181b26]">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-[11px] text-slate-400 font-semibold uppercase">
                  {sectionLabel}
                </span>
                {getDifficultyBadge(topic.difficulty)}
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                {topic.name}
              </h2>
            </div>

            <button
              onClick={() => setActiveProblem(null)}
              className="p-2 rounded-xl neo-btn text-slate-400 hover:text-white transition-colors"
            >
              <X size={17} />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 scrollbar-thin">
            {/* Status & Confidence Controls Card */}
            <div className="neo-card p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Mastery Status
                </div>
                <button
                  onClick={handleStatusToggle}
                  className={`px-3 py-1.5 rounded-xl font-mono text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    topic.status === "done"
                      ? "neo-inset text-slate-200 font-bold"
                      : topic.status === "partial"
                      ? "neo-inset text-amber-400 font-bold"
                      : "neo-btn text-slate-400 hover:text-white"
                  }`}
                >
                  {topic.status === "done" ? "Mastered ✓" : topic.status === "partial" ? "Needs Review" : "Pending"}
                </button>
              </div>

              {/* Confidence Slider */}
              <div className="space-y-2 pt-2 border-t border-white/[0.04]">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-400">Retention & Confidence</span>
                  <span className="text-slate-200 font-bold">{topic.confidence || 0} / 10</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={topic.confidence || 0}
                  onChange={(e) => handleConfidenceChange(Number(e.target.value))}
                  className="w-full accent-slate-300 cursor-pointer h-2 bg-[#0f1018] rounded-lg"
                />
              </div>
            </div>

            {/* AI Optimal C++ Solution Generator */}
            <div className="neo-card p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <Terminal size={16} className="text-amber-400" />
                  <span>Optimal C++ Solution & Complexity</span>
                </div>

                <button
                  onClick={handleGenerateSolution}
                  disabled={isGenerating}
                  className="px-3 py-1.5 rounded-xl neo-btn-primary font-mono text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50 transition-all"
                >
                  <Sparkles size={12} className={isGenerating ? "animate-spin text-amber-400" : "text-amber-400"} />
                  <span>{isGenerating ? "Generating..." : topic.solution ? "Regenerate" : "Generate Solution"}</span>
                </button>
              </div>

              {topic.solution ? (
                <div className="relative mt-3 p-4 rounded-xl neo-inset text-slate-200 text-xs sm:text-[13px] leading-relaxed overflow-x-auto font-mono">
                  <button
                    onClick={() => handleCopy(topic.solution || "")}
                    className="absolute top-3 right-3 p-1.5 rounded-lg neo-btn text-slate-400 hover:text-white transition-colors"
                    title="Copy code"
                  >
                    {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  </button>
                  <div className="whitespace-pre-wrap font-mono text-xs">{topic.solution}</div>
                </div>
              ) : (
                <div className="p-6 text-center text-slate-500 font-mono text-xs neo-inset">
                  Click &quot;Generate Solution&quot; to inspect the optimal C++ implementation with time and space complexity.
                </div>
              )}
            </div>

            {/* Personal Notes & Approach */}
            <div className="neo-card p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <BookOpen size={16} className="text-amber-400" />
                  <span>Personal Notes & Intuition</span>
                </div>
                <button
                  onClick={handleSaveNotes}
                  className="px-3 py-1.5 rounded-xl neo-btn font-mono text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  {isSaved ? <Check size={12} className="text-emerald-400" /> : <Save size={12} />}
                  <span>{isSaved ? "Saved" : "Save Notes"}</span>
                </button>
              </div>
              <textarea
                placeholder="Write your personal edge-cases, recurrence relations, or mental models for this problem..."
                value={notes || topic.notes || ""}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full neo-inset p-3.5 text-xs text-white placeholder:text-slate-500 outline-none resize-none min-h-[100px] font-sans"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
