"use client";

import { useState } from "react";
import { useApp } from "@/lib/DataContext";
import {
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Circle,
  ArrowRightCircle,
  ChevronsUpDown,
  BookOpen,
  Sparkles,
  Zap,
  Check,
  Code2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProgressPage() {
  const { data, toggleTopicStatus, setActiveProblem, setIsChatOpen } = useApp();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(
    Object.keys(data.progress || {}).reduce((acc, key) => ({ ...acc, [key]: true }), {})
  );

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleAll = () => {
    const allExpanded = Object.values(expandedSections).every(Boolean);
    const updated: Record<string, boolean> = {};
    Object.keys(data.progress || {}).forEach((key) => {
      updated[key] = !allExpanded;
    });
    setExpandedSections(updated);
  };

  const getStatusIcon = (status: string) => {
    if (status === "done") return <CheckCircle2 size={17} className="text-slate-300 shrink-0" />;
    if (status === "partial") return <ArrowRightCircle size={17} className="text-amber-400 shrink-0" />;
    return <Circle size={17} className="text-slate-600 hover:text-slate-400 shrink-0 transition-colors" />;
  };

  const handleOpenProblem = (sectionKey: string, sectionLabel: string, topic: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveProblem({
      sectionKey,
      sectionLabel,
      topic,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col gap-6 max-w-6xl mx-auto font-sans"
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            DSA Sheet Curriculum
          </h2>
          <div className="font-mono text-xs text-slate-400 mt-1">
            Step-by-step topic mastery for Striver&apos;s A2Z DSA Sheet · Click any topic to inspect notes and C++ solutions
          </div>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={toggleAll}
            className="px-3.5 py-2 rounded-xl neo-btn text-xs font-mono text-slate-300 hover:text-white flex items-center gap-2 transition-colors"
          >
            <ChevronsUpDown size={14} />
            <span>Toggle All Steps</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setIsChatOpen(true)}
            className="px-3.5 py-2 rounded-xl neo-btn text-xs font-mono text-amber-400 hover:text-white flex items-center gap-2 transition-colors"
          >
            <Sparkles size={14} />
            <span>AI Copilot</span>
          </motion.button>
        </div>
      </div>

      {/* Accordion Steps List */}
      <div className="flex flex-col gap-4">
        {Object.entries(data.progress || {}).map(([key, section], sIdx) => {
          const topics = section.topics || [];
          const doneCount = topics.filter((t) => t.status === "done").length;
          const totalCount = section.total || topics.length || 1;
          const pct = Math.round((doneCount / totalCount) * 100);
          const isExpanded = !!expandedSections[key];

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sIdx * 0.03 }}
              className="neo-card rounded-2xl overflow-hidden transition-all"
            >
              {/* Accordion Step Header */}
              <button
                onClick={() => toggleSection(key)}
                className="w-full flex items-center justify-between p-4 sm:p-5 bg-transparent hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-3.5 text-left">
                  <div className="text-slate-400 p-1.5 rounded-lg neo-inset">
                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base sm:text-lg flex items-center gap-2">
                      {section.label}
                    </h3>
                    <span className="font-mono text-[11px] text-slate-400">
                      {doneCount} of {totalCount} completed ({pct}%)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-24 sm:w-36 h-2 neo-inset rounded-full overflow-hidden p-[1px] hidden xs:block">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className={`h-full rounded-full ${
                        pct === 100 ? "bg-emerald-400" : "bg-slate-300"
                      }`}
                    />
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-200 w-10 text-right">
                    {pct}%
                  </span>
                </div>
              </button>

              {/* Accordion Content Grid */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 sm:p-5 pt-2 grid grid-cols-1 md:grid-cols-2 gap-3 border-t border-white/[0.03]">
                      {topics.map((topic) => (
                        <motion.div
                          key={topic.id || topic.name}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => toggleTopicStatus(key, topic.id || topic.name)}
                          className={`flex items-center justify-between p-3.5 rounded-xl transition-all cursor-pointer group ${
                            topic.status === "done"
                              ? "neo-inset text-slate-400"
                              : topic.status === "partial"
                              ? "neo-inset text-amber-400"
                              : "neo-btn text-slate-200"
                          }`}
                        >
                          <div className="flex items-center gap-3 truncate">
                            <div className="p-0.5">{getStatusIcon(topic.status)}</div>
                            <span
                              className={`text-xs sm:text-sm font-medium transition-colors truncate ${
                                topic.status === "done"
                                  ? "line-through text-slate-500"
                                  : "text-slate-200 group-hover:text-white"
                              }`}
                            >
                              {topic.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {topic.status === "done" ? (
                              <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-[#181b26] text-slate-300">
                                {topic.confidence}/10
                              </span>
                            ) : topic.status === "partial" ? (
                              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#181b26] text-amber-400">
                                Review
                              </span>
                            ) : null}

                            <motion.button
                              whileHover={{ scale: 1.15 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => handleOpenProblem(key, section.label, topic, e)}
                              className="p-1 rounded-lg neo-btn text-slate-400 hover:text-white transition-colors"
                              title="Inspect C++ solution & notes"
                            >
                              <Code2 size={13} />
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
