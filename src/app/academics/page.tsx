"use client";

import { useApp } from "@/lib/DataContext";
import { EditableField } from "@/components/EditableField";
import { GraduationCap, BookOpen } from "lucide-react";

export default function AcademicsPage() {
  const { data, updateData } = useApp();
  const academics = data.academics;

  if (!academics) return null;

  const handleMaxMarksUpdate = (newVal: number) => {
    updateData({
      ...data,
      academics: { ...academics, maxMarks: newVal }
    });
  };

  const handleExamUpdate = (examIndex: number, markIndex: number, field: string, newVal: any) => {
    const newExams = [...academics.exams];
    if (field === 'subject') newExams[examIndex].marks[markIndex].subject = newVal;
    if (field === 'obtained') newExams[examIndex].marks[markIndex].obtained = newVal;
    
    updateData({
      ...data,
      academics: { ...academics, exams: newExams }
    });
  };

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold font-mono tracking-tight text-white">
          <span className="text-neo-accent mr-2">/</span> Academics Tracker
        </h2>
        <div className="neo-inset px-4 py-2 font-mono text-xs text-neo-muted flex items-center gap-2">
          <GraduationCap size={16} /> Max Marks: 
          <EditableField type="number" value={academics.maxMarks} onChange={handleMaxMarksUpdate} className="w-12 text-center" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {academics.exams.map((exam, i) => {
          const totalObtained = exam.marks.reduce((sum, m) => sum + m.obtained, 0);
          const totalMax = exam.marks.length * academics.maxMarks;
          const percentage = totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(1) : 0;
          
          return (
            <div key={i} className="neo-flat p-6 border-l-4 border-neo-accent">
              <div className="flex justify-between items-end mb-6 pb-4 border-b border-white/5">
                <div>
                  <div className="font-mono text-[10px] text-neo-muted uppercase mb-1">{exam.range}</div>
                  <h3 className="font-bold text-xl text-white flex items-center gap-2">
                    {exam.label}
                    <span className={`text-[10px] px-2 py-0.5 rounded uppercase ${exam.status === 'done' ? 'bg-white/10 text-white' : 'bg-black/20 border border-white/5 text-neo-muted'}`}>
                      {exam.status}
                    </span>
                  </h3>
                </div>
                {exam.marks.length > 0 && (
                  <div className="text-right">
                    <div className="font-mono text-2xl font-bold text-white">{percentage}%</div>
                    <div className="font-mono text-xs text-neo-muted">Overall Average</div>
                  </div>
                )}
              </div>

              {exam.marks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {exam.marks.map((mark, j) => {
                    const subjPct = (mark.obtained / academics.maxMarks) * 100;
                    return (
                      <div key={j} className="neo-inset p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <BookOpen size={14} className="text-neo-muted shrink-0" />
                          <EditableField 
                            value={mark.subject} 
                            onChange={(val) => handleExamUpdate(i, j, 'subject', val)}
                            className="font-mono text-sm font-bold text-white truncate"
                            renderAs="h4"
                          />
                        </div>
                        <div className="flex justify-between items-baseline mb-2">
                          <EditableField 
                            type="number"
                            value={mark.obtained} 
                            onChange={(val) => handleExamUpdate(i, j, 'obtained', val)}
                            className="font-mono text-2xl font-bold text-neo-accent w-16"
                            renderAs="span"
                          />
                          <span className="font-mono text-xs text-neo-muted">/ {academics.maxMarks}</span>
                        </div>
                        <div className="h-1 bg-black/50 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-neo-accent" 
                            style={{ width: `${subjPct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center text-neo-muted font-mono text-sm neo-inset">
                  No marks uploaded yet.
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
