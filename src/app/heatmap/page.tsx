"use client";

import { useApp } from "@/lib/DataContext";
import { EditableField } from "@/components/EditableField";
import { Activity } from "lucide-react";

export default function HeatmapPage() {
  const { data, updateData, isEditMode } = useApp();

  // Find day in weeks array and update it
  const handleUpdate = (dayDate: string, newRating: number) => {
    const newWeeks = [...data.weeks];
    for (let w = 0; w < newWeeks.length; w++) {
      const dIndex = newWeeks[w].days.findIndex(d => d.date === dayDate);
      if (dIndex !== -1) {
        newWeeks[w].days[dIndex].rating = newRating;
        break;
      }
    }
    updateData({ ...data, weeks: newWeeks });
  };

  // Flatten all days
  const allDays = data.weeks?.flatMap(w => w.days) || [];
  
  // Dummy generate 182 days (26 weeks) to simulate GitHub grid
  const gridCells = Array.from({ length: 182 }).map((_, i) => {
    // Just scatter the actual days into the grid for visual effect
    const dayData = allDays[i % allDays.length];
    return {
      id: i,
      rating: dayData ? dayData.rating : null,
      date: dayData ? dayData.date : "Past Day"
    };
  });

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold font-mono tracking-tight text-white">
          <span className="text-neo-accent mr-2">/</span> Activity Heatmap
        </h2>
        <div className="neo-inset px-4 py-2 font-mono text-xs text-neo-muted flex items-center gap-2">
          <Activity size={16} /> 182 Day History
        </div>
      </div>

      <div className="neo-flat p-8 overflow-x-auto relative">
        {isEditMode && (
          <div className="absolute top-4 right-4 font-mono text-[10px] text-neo-accent animate-pulse">
            Click any active cell to edit its rating (0-10)
          </div>
        )}
        <div className="min-w-[800px]">
          <div className="grid grid-rows-7 grid-flow-col gap-2">
            {gridCells.map((cell) => {
              let bgClass = "bg-black/40 border border-white/5"; // Empty
              if (cell.rating !== null) {
                if (cell.rating >= 9) bgClass = "bg-[#39d353] shadow-[0_0_12px_rgba(57,211,83,0.4)] border border-[#39d353]";
                else if (cell.rating >= 7) bgClass = "bg-[#26a641] border border-[#26a641]";
                else bgClass = "bg-[#0e4429] border border-[#0e4429]";
              }

              return (
                <div key={cell.id} className="relative group flex items-center justify-center">
                  <div 
                    className={`w-4 h-4 rounded-sm ${bgClass} transition-all hover:scale-125 cursor-pointer`}
                    title={cell.rating !== null ? `${cell.date}: ${cell.rating}/10` : "No Activity"}
                  />
                  {isEditMode && cell.rating !== null && (
                    <div className="absolute opacity-0 group-hover:opacity-100 z-50 bg-black border border-neo-cyan p-1 rounded left-5 top-0 flex gap-1 items-center shadow-2xl">
                      <EditableField 
                        type="number" 
                        value={cell.rating} 
                        onChange={(v) => handleUpdate(cell.date, v)} 
                        className="w-12 text-[10px]"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="flex justify-end items-center gap-2 mt-6 font-mono text-xs text-neo-muted">
            <span>Less</span>
            <div className="w-3 h-3 rounded-sm bg-black/40 border border-white/5" />
            <div className="w-3 h-3 rounded-sm bg-[#0e4429] border border-[#0e4429]" />
            <div className="w-3 h-3 rounded-sm bg-[#26a641] border border-[#26a641]" />
            <div className="w-3 h-3 rounded-sm bg-[#39d353] shadow-[0_0_8px_rgba(57,211,83,0.4)] border border-[#39d353]" />
            <span>More</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
         <div className="neo-inset p-6">
            <h3 className="font-mono text-sm font-bold text-white mb-2">Longest Streak</h3>
            <div className="text-4xl font-extrabold text-neo-cyan font-mono">24 <span className="text-sm text-neo-muted font-normal">days</span></div>
         </div>
         <div className="neo-inset p-6">
            <h3 className="font-mono text-sm font-bold text-white mb-2">Total Hours Logged</h3>
            <div className="text-4xl font-extrabold text-white font-mono">142.5 <span className="text-sm text-neo-muted font-normal">hrs</span></div>
         </div>
      </div>
    </div>
  );
}
