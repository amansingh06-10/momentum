"use client";

import { useApp } from "@/lib/DataContext";
import { EditableField } from "@/components/EditableField";
import { motion } from "framer-motion";
import { GraduationCap, BookOpen, Award, CheckCircle2 } from "lucide-react";

export default function AcademicsPage() {
  const { data, updateData } = useApp();
  const academics = data.academics;

  if (!academics) return null;

  const handleMaxMarksUpdate = (newVal: number) => {
    updateData({
      ...data,
      academics: { ...academics, maxMarks: Number(newVal) },
    });
  };

  const handleExamUpdate = (examIndex: number, markIndex: number, field: string, newVal: any) => {
    const newExams = JSON.parse(JSON.stringify(academics.exams || []));
    if (!newExams[examIndex] || !newExams[examIndex].marks[markIndex]) return;

    if (field === "subject") newExams[examIndex].marks[markIndex].subject = newVal;
    if (field === "obtained") newExams[examIndex].marks[markIndex].obtained = Number(newVal);

    updateData({
      ...data,
      academics: { ...academics, exams: newExams },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col gap-8 max-w-7xl mx-auto font-sans"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            Academics Tracker
          </h2>
          <div className="font-mono text-xs text-slate-400 mt-1">
            B.Tech CSE Semester exam evaluation, mid-terms, and laboratory marks
          </div>
        </div>

        <div className="neo-inset px-4 py-2 font-mono text-xs text-slate-300 flex items-center gap-2">
          <GraduationCap size={15} className="text-amber-400" />
          <span>Max Marks:</span>
          <EditableField
            type="number"
            value={academics.maxMarks}
            onChange={handleMaxMarksUpdate}
            className="w-10 text-center font-bold text-white"
          />
        </div>
      </div>

      {/* Exams List Grid */}
      <div className="grid grid-cols-1 gap-8">
        {(academics.exams || []).map((exam, i) => {
          const marks = exam.marks || [];
          const totalObtained = marks.reduce((sum, m) => sum + (Number(m.obtained) || 0), 0);
          const totalMax = marks.length * (academics.maxMarks || 30);
          const percentage = totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(1) : "0.0";

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="neo-card p-6 sm:p-7 rounded-2xl"
            >
              {/* Exam Header */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 pb-4 border-b border-white/[0.04]">
                <div>
                  <div className="font-mono text-[11px] text-slate-400 uppercase tracking-wider mb-1">
                    {exam.range}
                  </div>
                  <h3 className="font-bold text-xl text-white flex items-center gap-3">
                    {exam.label}
                    <span
                      className={`text-[10px] font-mono px-2.5 py-0.5 rounded-md uppercase ${
                        exam.status === "done"
                          ? "neo-inset text-slate-300 font-semibold"
                          : "neo-btn text-slate-400"
                      }`}
                    >
                      {exam.status}
                    </span>
                  </h3>
                </div>

                {marks.length > 0 && (
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-mono text-2xl sm:text-3xl font-extrabold text-white">
                        {percentage}%
                      </div>
                      <div className="font-mono text-[10px] text-slate-500 uppercase">Average Score</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Subject Scores Grid */}
              {marks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {marks.map((mark, j) => {
                    const subjPct = Math.min(100, Math.round(((mark.obtained || 0) / (academics.maxMarks || 30)) * 100));

                    return (
                      <motion.div
                        key={j}
                        whileHover={{ y: -3, scale: 1.01 }}
                        className="neo-inset p-4 rounded-xl flex flex-col justify-between"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <BookOpen size={14} className="text-slate-400 shrink-0" />
                          <EditableField
                            value={mark.subject}
                            onChange={(val) => handleExamUpdate(i, j, "subject", val)}
                            className="font-mono text-xs font-bold text-white truncate"
                            renderAs="h4"
                          />
                        </div>

                        <div className="flex justify-between items-baseline mb-2">
                          <EditableField
                            type="number"
                            value={mark.obtained}
                            onChange={(val) => handleExamUpdate(i, j, "obtained", val)}
                            className="font-mono text-2xl font-extrabold text-slate-100 w-16"
                            renderAs="span"
                          />
                          <span className="font-mono text-xs text-slate-500">/ {academics.maxMarks}</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-1.5 neo-inset rounded-full overflow-hidden p-[1px]">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${subjPct}%` }}
                            transition={{ duration: 0.9, ease: "easeOut" }}
                            className="h-full bg-slate-300 rounded-full"
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center text-slate-500 font-mono text-xs neo-inset rounded-xl">
                  No subject marks uploaded yet for this evaluation.
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
