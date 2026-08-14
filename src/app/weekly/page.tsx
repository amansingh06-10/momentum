"use client";

import { useApp } from "@/lib/DataContext";
import { EditableField } from "@/components/EditableField";

export default function WeeklyPage() {
  const { data, updateData } = useApp();

  const handleUpdate = (weekIdx: number, dayIdx: number, field: string, value: any) => {
    const newWeeks = [...data.weeks];
    (newWeeks[weekIdx].days[dayIdx] as any)[field] = value;
    
    // Recalculate average
    const weekDays = newWeeks[weekIdx].days.filter(d => d.rating !== null);
    if (weekDays.length > 0) {
      const sum = weekDays.reduce((a, d) => a + (d.rating || 0), 0);
      newWeeks[weekIdx].average = Number((sum / weekDays.length).toFixed(1));
    }

    updateData({ ...data, weeks: newWeeks });
  };

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold font-mono tracking-tight text-white">
          <span className="text-neo-accent mr-2">/</span> Weekly Logs
        </h2>
      </div>

      <div className="flex flex-col gap-10">
        {data.weeks?.map((week, wIdx) => (
          <div key={wIdx} className="flex flex-col gap-4">
            <div className="flex items-end justify-between border-b border-white/10 pb-2">
              <div>
                <h3 className="font-bold font-mono text-white text-lg">{week.label}</h3>
                <div className="font-mono text-xs text-neo-muted">{week.range}</div>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-mono text-xs text-neo-muted uppercase">Avg Rating</span>
                <span className={`font-mono text-xl font-bold ${week.average >= 9 ? 'text-neo-cyan' : 'text-white'}`}>
                  {week.average.toFixed(1)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {week.days.map((day, dIdx) => (
                <div key={dIdx} className="neo-flat p-5 flex flex-col justify-between group">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white text-sm">{day.date}</span>
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-black/40 text-neo-muted border border-white/5">
                          {day.day}
                        </span>
                      </div>
                      <div className="w-10 h-10 rounded-full neo-inset flex items-center justify-center font-mono font-bold text-sm relative border border-white/5">
                        {day.rating !== null ? (
                          <>
                            <EditableField 
                              type="number"
                              value={day.rating} 
                              onChange={(v) => handleUpdate(wIdx, dIdx, 'rating', v)}
                              className={`text-center w-8 bg-transparent ${day.rating >= 9 ? 'text-neo-cyan' : day.rating >= 8 ? 'text-white' : 'text-neo-muted'}`}
                            />
                            <svg className="absolute inset-0 w-full h-full transform -rotate-90 pointer-events-none">
                              <circle cx="20" cy="20" r="18" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="2" />
                              <circle 
                                cx="20" cy="20" r="18" fill="none" 
                                stroke={day.rating >= 9 ? '#00e5ff' : day.rating >= 8 ? '#ffffff' : '#8a8f98'} 
                                strokeWidth="2" 
                                strokeDasharray={`${(day.rating/10)*113} 113`} 
                              />
                            </svg>
                          </>
                        ) : (
                          <span className="text-neo-muted text-xs">🧊</span>
                        )}
                      </div>
                    </div>
                    <EditableField 
                      value={day.topic} 
                      onChange={(v) => handleUpdate(wIdx, dIdx, 'topic', v)}
                      className="font-mono text-xs text-neo-muted leading-relaxed w-full min-h-[60px]"
                      renderAs="p"
                    />
                  </div>
                  
                  <div className="mt-4 flex gap-4 pt-3 border-t border-white/5">
                    <div className="flex items-center gap-2 font-mono text-[10px] text-neo-muted">
                      <span className="text-white/40">Mood:</span> 
                      <EditableField type="number" value={day.mood} onChange={(v) => handleUpdate(wIdx, dIdx, 'mood', v)} className="w-8 text-neo-cyan" />/5
                    </div>
                    <div className="flex items-center gap-2 font-mono text-[10px] text-neo-muted">
                      <span className="text-white/40">Hours:</span> 
                      <EditableField type="number" value={day.hours} onChange={(v) => handleUpdate(wIdx, dIdx, 'hours', v)} className="w-8 text-neo-cyan" />h
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
