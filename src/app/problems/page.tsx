"use client";

import { useState, useMemo } from "react";
import { useApp } from "@/lib/DataContext";
import {
  Search,
  CheckCircle2,
  Circle,
  ArrowRightCircle,
  Sparkles,
  SlidersHorizontal,
  X,
  Code2,
  Brain,
  HelpCircle,
  ChevronRight
} from "lucide-react";
import { NeoSelect } from "@/components/NeoSelect";
import { motion, AnimatePresence } from "framer-motion";

export default function ProblemsPage() {
  const { data, toggleTopicStatus, setActiveProblem } = useApp();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [sectionFilter, setSectionFilter] = useState("all");

  // Flatten all problems from progress state
  const allProblems = useMemo(() => {
    return Object.entries(data.progress || {}).flatMap(([sectionKey, section]) => {
      return (section.topics || []).map((topic) => ({
        ...topic,
        sectionKey,
        sectionLabel: section.label,
      }));
    });
  }, [data.progress]);

  const sectionOptions = useMemo(() => {
    const opts = [{ value: "all", label: "All Sections / Steps" }];
    Object.entries(data.progress || {}).forEach(([key, section]) => {
      opts.push({ value: key, label: section.label });
    });
    return opts;
  }, [data.progress]);

  // Filtered problems
  const filteredProblems = useMemo(() => {
    return allProblems.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sectionLabel.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      const matchesDifficulty =
        difficultyFilter === "all" || (p.difficulty || "medium") === difficultyFilter;
      const matchesSection = sectionFilter === "all" || p.sectionKey === sectionFilter;
      return matchesSearch && matchesStatus && matchesDifficulty && matchesSection;
    });
  }, [allProblems, search, statusFilter, difficultyFilter, sectionFilter]);

  const doneCount = allProblems.filter((p) => p.status === "done").length;
  const partialCount = allProblems.filter((p) => p.status === "partial").length;
  const pendingCount = allProblems.length - doneCount - partialCount;

  const getStatusIcon = (status: string) => {
    if (status === "done") return <CheckCircle2 size={18} className="text-slate-300 shrink-0" />;
    if (status === "partial") return <ArrowRightCircle size={18} className="text-amber-400 shrink-0" />;
    return <Circle size={18} className="text-slate-600 hover:text-slate-400 shrink-0 transition-colors" />;
  };

  const getDifficultyBadge = (diff?: string) => {
    const d = diff || "medium";
    if (d === "easy") {
      return (
        <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded-md bg-[#13151f] text-emerald-300 font-semibold border border-white/[0.04]">
          Easy
        </span>
      );
    }
    if (d === "hard") {
      return (
        <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded-md bg-[#13151f] text-rose-300 font-semibold border border-white/[0.04]">
          Hard
        </span>
      );
    }
    return (
      <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded-md bg-[#13151f] text-amber-300 font-semibold border border-white/[0.04]">
        Medium
      </span>
    );
  };

  const handleOpenProblemDrawer = (problem: any) => {
    setActiveProblem({
      sectionKey: problem.sectionKey,
      sectionLabel: problem.sectionLabel,
      topic: problem,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col gap-6 max-w-7xl mx-auto font-sans"
    >
      {/* Header & Filter Summary */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            Problems Explorer
          </h2>
          <div className="font-mono text-xs text-slate-400 mt-1">
            Search, filter, inspect C++ solutions, and track mastery across all {allProblems.length} Striver A2Z problems
          </div>
        </div>

        {/* Status quick tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1.5 rounded-xl font-mono text-xs flex items-center gap-1.5 transition-all ${
              statusFilter === "all"
                ? "neo-inset text-white font-bold"
                : "neo-btn text-slate-400 hover:text-white"
            }`}
          >
            <span>All</span>
            <span className="font-bold text-slate-300">{allProblems.length}</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setStatusFilter("done")}
            className={`px-3 py-1.5 rounded-xl font-mono text-xs flex items-center gap-1.5 transition-all ${
              statusFilter === "done"
                ? "neo-inset text-slate-200 font-bold"
                : "neo-btn text-slate-400 hover:text-slate-200"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
            <span>Mastered</span>
            <span className="font-bold text-slate-300">{doneCount}</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setStatusFilter("partial")}
            className={`px-3 py-1.5 rounded-xl font-mono text-xs flex items-center gap-1.5 transition-all ${
              statusFilter === "partial"
                ? "neo-inset text-amber-400 font-bold"
                : "neo-btn text-slate-400 hover:text-amber-300"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>Review</span>
            <span className="font-bold text-amber-300">{partialCount}</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setStatusFilter("pending")}
            className={`px-3 py-1.5 rounded-xl font-mono text-xs flex items-center gap-1.5 transition-all ${
              statusFilter === "pending"
                ? "neo-inset text-slate-400 font-bold"
                : "neo-btn text-slate-400 hover:text-slate-300"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
            <span>Pending</span>
            <span className="font-bold text-slate-400">{pendingCount}</span>
          </motion.button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="neo-card p-4 flex flex-col md:flex-row gap-3 items-center">
        {/* Search input (Sunken Well) */}
        <div className="relative flex-1 w-full">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search problems by title, step, or pattern (e.g. Two Sum, Binary Search, Trees)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full neo-inset py-2.5 pl-10 pr-9 font-sans text-xs sm:text-sm text-white placeholder:text-slate-500 outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Section Filter Dropdown */}
        <div className="w-full md:w-64">
          <NeoSelect
            value={sectionFilter}
            onChange={setSectionFilter}
            options={sectionOptions}
            className="w-full text-xs"
          />
        </div>

        {/* Difficulty Filter Dropdown */}
        <div className="w-full md:w-36">
          <NeoSelect
            value={difficultyFilter}
            onChange={setDifficultyFilter}
            options={[
              { value: "all", label: "All Difficulties" },
              { value: "easy", label: "Easy" },
              { value: "medium", label: "Medium" },
              { value: "hard", label: "Hard" },
            ]}
            className="w-full text-xs"
          />
        </div>
      </div>

      {/* Problems Table View */}
      <div className="neo-card overflow-hidden">
        <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 p-4 border-b border-white/[0.04] bg-[#141620] font-mono text-[11px] text-slate-400 uppercase tracking-wider">
          <div className="w-10 text-center">Status</div>
          <div>Problem Name & Step</div>
          <div className="w-24 text-center hidden sm:block">Confidence</div>
          <div className="w-36 text-right">Inspect & Solve</div>
        </div>

        <div className="max-h-[64vh] overflow-y-auto divide-y divide-white/[0.03] scrollbar-thin">
          {filteredProblems.length > 0 ? (
            filteredProblems.map((problem, idx) => (
              <motion.div
                key={`${problem.sectionKey}-${problem.id || problem.name}-${idx}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ x: 2 }}
                transition={{ duration: 0.15 }}
                onClick={() => handleOpenProblemDrawer(problem)}
                className="grid grid-cols-[auto_1fr_auto_auto] gap-4 p-4 items-center hover:bg-[#1c202d] transition-colors group cursor-pointer"
              >
                {/* Status Check Icon */}
                <motion.div
                  whileTap={{ scale: 0.8 }}
                  className="w-10 flex justify-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleTopicStatus(problem.sectionKey, problem.id || problem.name);
                  }}
                >
                  {getStatusIcon(problem.status)}
                </motion.div>

                {/* Problem Name & Section */}
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span
                      className={`text-sm font-medium transition-colors ${
                        problem.status === "done"
                          ? "text-slate-500 line-through"
                          : "text-white group-hover:text-slate-200"
                      }`}
                    >
                      {problem.name}
                    </span>
                    {getDifficultyBadge(problem.difficulty)}
                  </div>
                  <div className="font-mono text-[11px] text-slate-500 mt-0.5">
                    {problem.sectionLabel}
                  </div>
                </div>

                {/* Confidence Score */}
                <div className="w-24 flex justify-center hidden sm:flex">
                  {problem.status === "done" ? (
                    <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-md neo-inset text-slate-200">
                      {problem.confidence}/10
                    </span>
                  ) : problem.status === "partial" ? (
                    <span className="font-mono text-xs px-2 py-0.5 rounded-md neo-inset text-amber-400">
                      Revisit
                    </span>
                  ) : (
                    <span className="font-mono text-xs text-slate-600">—</span>
                  )}
                </div>

                {/* Actions: Open Drawer / Toggle */}
                <div className="w-36 flex justify-end items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenProblemDrawer(problem);
                    }}
                    className="p-1.5 rounded-lg neo-btn text-slate-400 hover:text-white transition-colors flex items-center gap-1 font-mono text-[11px]"
                    title="Inspect problem & generate C++ solution"
                  >
                    <Code2 size={13} />
                    <span className="hidden sm:inline">Inspect</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTopicStatus(problem.sectionKey, problem.id || problem.name);
                    }}
                    className={`font-mono text-[11px] px-2.5 py-1 rounded-lg transition-all ${
                      problem.status === "done"
                        ? "neo-inset text-slate-400 hover:text-white"
                        : "neo-btn text-slate-200 hover:text-white"
                    }`}
                  >
                    {problem.status === "done" ? "Done ✓" : problem.status === "partial" ? "Review" : "Mark"}
                  </motion.button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="p-12 text-center text-slate-500 font-mono text-xs">
              No problems match your current search or filter criteria.
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
