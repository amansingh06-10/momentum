"use client";

import { useApp } from "@/lib/DataContext";
import { EditableField } from "@/components/EditableField";

export default function OverviewPage() {
  const { stats, data, updateData } = useApp();

  const handleUpdate = (field: string, value: any) => {
    updateData({ ...data, [field]: value });
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold tracking-tight text-white mb-1">
          System Overview
        </h2>
        <div className="font-mono text-xs text-neo-muted">
          Your active metrics and target countdown.
        </div>
      </div>

      {/* Dynamic Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="neo-flat p-6 flex flex-col justify-between group">
          <div>
             <div className="font-mono text-[10px] tracking-widest text-neo-muted uppercase mb-4 flex items-center justify-between">
               Topics Completed
               <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-neo-cyan transition-colors"></span>
             </div>
             <div className="flex items-baseline gap-2 mb-6">
               <span className="text-5xl font-extrabold tracking-tight text-white leading-none">
                 {stats.doneTopics}
               </span>
               <span className="font-mono text-xs text-neo-muted">
                 / <EditableField type="number" value={data.targetGoal} onChange={(val) => handleUpdate('targetGoal', val)} />
               </span>
             </div>
          </div>
          <div>
             <div className="h-1.5 neo-inset overflow-hidden mb-3 p-[1px]">
               <div 
                 className="h-full bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                 style={{ width: `${stats.overallPct}%` }} 
               />
             </div>
             <div className="flex justify-between font-mono text-[10px] text-neo-muted">
               <span>{stats.overallPct}% Mastery</span>
               <span className="text-white/70">{stats.partialTopics} partial</span>
             </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="neo-flat p-6 flex flex-col justify-between group">
          <div>
             <div className="font-mono text-[10px] tracking-widest text-neo-muted uppercase mb-4 flex items-center justify-between">
               Avg Confidence
               <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-white transition-colors"></span>
             </div>
             <div className="flex items-baseline gap-2 mb-6">
               <span className="text-5xl font-extrabold tracking-tight text-white leading-none">
                 {stats.avgConfidence}
               </span>
               <span className="font-mono text-xs text-neo-muted">/ 10</span>
             </div>
          </div>
          <div className="font-mono text-[10px] text-neo-muted neo-inset p-3 border border-white/5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white/50"></span> High Retention in BS & LL
          </div>
        </div>

        {/* Card 3 */}
        <div className="neo-flat p-6 flex flex-col justify-between group">
          <div>
             <div className="font-mono text-[10px] tracking-widest text-neo-muted uppercase mb-4 flex items-center justify-between">
               Session Rating
               <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-white transition-colors"></span>
             </div>
             <div className="flex items-baseline gap-2 mb-6">
               <span className="text-5xl font-extrabold tracking-tight text-white leading-none">
                 {stats.overallAvgRating}
               </span>
               <span className="font-mono text-xs text-neo-muted">/ 10</span>
             </div>
          </div>
          <div className="font-mono text-[10px] text-neo-muted neo-inset p-3 border border-white/5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white/50"></span> Active across {stats.streak}+ tracked days
          </div>
        </div>

        {/* Card 4 - Target Countdown */}
        <div className="neo-flat p-6 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/[0.02] rounded-full blur-2xl group-hover:bg-neo-cyan/10 transition-colors"></div>
          <div>
             <div className="font-mono text-[10px] tracking-widest text-neo-muted uppercase mb-4 flex items-center gap-2 relative z-10">
               T-MINUS TO 
               <EditableField type="date" value={data.targetDate} onChange={(val) => handleUpdate('targetDate', val)} />
             </div>
             <div className="flex items-baseline gap-2 mb-2 relative z-10">
               <span className="text-5xl font-extrabold tracking-tight text-white leading-none">
                 {stats.daysLeft}
               </span>
               <span className="font-mono text-xs text-neo-muted">days</span>
             </div>
             <div className="flex gap-4 mb-4 relative z-10">
               <div className="flex items-baseline gap-1">
                 <span className="text-lg font-bold text-white">{stats.hoursLeft}</span>
                 <span className="font-mono text-[10px] text-neo-muted">h</span>
               </div>
               <div className="flex items-baseline gap-1">
                 <span className="text-lg font-bold text-white">{stats.minsLeft}</span>
                 <span className="font-mono text-[10px] text-neo-muted">m</span>
               </div>
             </div>
          </div>
          <div className="font-mono text-[10px] text-white/80 neo-inset p-3 border border-white/5 text-center relative z-10">
            Pace needed: {stats.paceNeededPerDay} / day
          </div>
        </div>
      </div>
    </div>
  );
}
