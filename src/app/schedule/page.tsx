"use client";

import { useApp } from "@/lib/DataContext";
import { EditableField } from "@/components/EditableField";
import { Book, Bus, Code, Server } from "lucide-react";

export default function SchedulePage() {
  const { data, updateData } = useApp();

  const handleUpdate = (dayIndex: number, field: string, value: string) => {
    const newSchedule = [...data.schedule];
    (newSchedule[dayIndex] as any)[field] = value;
    updateData({ ...data, schedule: newSchedule });
  };

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold font-mono tracking-tight text-white">
          <span className="text-neo-accent mr-2">/</span> Schedule & Focus
        </h2>
        <div className="font-mono text-[10px] text-neo-muted neo-inset px-3 py-1.5 flex items-center gap-2 border border-white/5">
          <span className="w-2 h-2 bg-neo-cyan rounded-full animate-pulse shadow-[0_0_8px_var(--color-neo-cyan)]"></span> LIVE SYNC
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
        {data.schedule?.map((day, i) => {
          const isToday = new Date().toLocaleDateString('en-US', { weekday: 'long' }) === day.day;
          
          return (
            <div 
              key={i} 
              className={`p-4 transition-all rounded-2xl ${isToday ? 'neo-inset border border-neo-cyan/50 shadow-[inset_0_0_20px_rgba(0,229,255,0.1)]' : 'neo-flat'}`}
            >
              <h3 className={`font-mono font-bold text-center mb-4 pb-2 border-b border-white/10 ${isToday ? 'text-neo-cyan' : 'text-white'}`}>
                {day.day.substring(0,3)}
              </h3>

              <div className="flex flex-col gap-3">
                <div className="bg-black/40 rounded-xl p-3 border border-white/5 shadow-inner">
                  <div className="flex items-center gap-1.5 font-mono text-[9px] text-neo-muted mb-1 uppercase">
                    <Book size={10} /> 
                    <EditableField value={day.type} onChange={(v) => handleUpdate(i, 'type', v)} />
                  </div>
                  <EditableField 
                    value={day.hours} 
                    onChange={(v) => handleUpdate(i, 'hours', v)} 
                    className="font-mono text-[10px] text-white font-bold"
                    renderAs="div"
                  />
                </div>

                <div className="bg-black/40 rounded-xl p-3 border border-white/5 shadow-inner">
                  <div className="flex items-center gap-1.5 font-mono text-[9px] text-neo-muted mb-1 uppercase">
                    <Bus size={10} /> Commute
                  </div>
                  <EditableField 
                    value={day.commute} 
                    onChange={(v) => handleUpdate(i, 'commute', v)} 
                    className="font-mono text-[10px] text-white font-bold"
                    renderAs="div"
                  />
                </div>

                <div className="bg-white/[0.03] rounded-xl p-3 shadow-md border-l-2 border-neo-cyan">
                  <div className="flex items-center gap-1.5 font-mono text-[9px] text-neo-cyan mb-1 uppercase">
                    <Code size={10} /> DSA Slot
                  </div>
                  <EditableField 
                    value={day.dsaSlot} 
                    onChange={(v) => handleUpdate(i, 'dsaSlot', v)} 
                    className="font-mono text-[10px] text-white font-bold"
                    renderAs="div"
                  />
                </div>

                <div className="bg-white/[0.03] rounded-xl p-3 shadow-md border-l-2 border-neo-accent">
                  <div className="flex items-center gap-1.5 font-mono text-[9px] text-neo-accent mb-1 uppercase">
                    <Server size={10} /> Backend
                  </div>
                  <EditableField 
                    value={day.backendSlot} 
                    onChange={(v) => handleUpdate(i, 'backendSlot', v)} 
                    className="font-mono text-[10px] text-white font-bold"
                    renderAs="div"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
