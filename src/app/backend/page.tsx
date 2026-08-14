"use client";

import { useApp } from "@/lib/DataContext";
import { EditableField } from "@/components/EditableField";
import { Server, Globe, CheckCircle, Circle, ArrowRightCircle } from "lucide-react";

export default function BackendRoadmapPage() {
  const { data, updateData } = useApp();

  const getStatusIcon = (status: string) => {
    if (status === 'done') return <CheckCircle size={18} className="text-neo-cyan" />;
    if (status === 'partial') return <ArrowRightCircle size={18} className="text-white" />;
    return <Circle size={18} className="text-neo-muted opacity-50" />;
  };

  const getStatusClass = (status: string) => {
    if (status === 'done') return 'neo-inset border-neo-cyan/20';
    if (status === 'partial') return 'neo-flat border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.05)]';
    return 'neo-flat border-white/5 opacity-80';
  };

  const handleUpdate = (phaseIndex: number, field: string, value: any) => {
    const newRoadmap = [...data.backendRoadmap];
    (newRoadmap[phaseIndex] as any)[field] = value;
    updateData({ ...data, backendRoadmap: newRoadmap });
  };

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold font-mono tracking-tight text-white">
          <span className="text-neo-accent mr-2">/</span> Backend Roadmap
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.backendRoadmap?.map((phase, pIdx) => (
          <div key={phase.id} className={`rounded-2xl p-6 transition-all group ${getStatusClass(phase.status)}`}>
            <div className="flex justify-between items-start mb-4">
              <div className="w-full">
                <div className="font-mono text-[10px] text-neo-muted uppercase mb-1">
                  <EditableField value={phase.week} onChange={(v) => handleUpdate(pIdx, 'week', v)} />
                </div>
                <EditableField 
                  value={phase.label} 
                  onChange={(v) => handleUpdate(pIdx, 'label', v)}
                  className="font-bold font-mono text-white text-lg leading-tight w-full"
                  renderAs="h3"
                />
              </div>
              <div className="shrink-0">{getStatusIcon(phase.status)}</div>
            </div>
            
            <div className="font-mono text-xs text-neo-muted mb-4 pb-4 border-b border-white/10">
              <EditableField value={phase.period} onChange={(v) => handleUpdate(pIdx, 'period', v)} />
            </div>

            <ul className="flex flex-col gap-2 mb-6">
              {phase.topics.map((topic, i) => (
                <li key={i} className="flex items-start gap-2 font-mono text-xs text-white/80">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/20 mt-1.5 shrink-0 group-hover:bg-neo-cyan transition-colors" />
                  {topic}
                </li>
              ))}
            </ul>

            {phase.project && (
              <a 
                href={phase.project.url} 
                target="_blank" 
                rel="noreferrer"
                className="block mt-auto p-4 rounded-xl bg-black/40 border border-white/5 hover:border-neo-cyan transition-colors shadow-inner"
              >
                <div className="font-mono font-bold text-xs text-white mb-1 flex items-center gap-2">
                  <Globe size={12} className="text-neo-cyan" /> 
                  <EditableField value={phase.project.name} onChange={(v) => {
                     const newRoadmap = [...data.backendRoadmap];
                     if(newRoadmap[pIdx].project) newRoadmap[pIdx].project!.name = v;
                     updateData({ ...data, backendRoadmap: newRoadmap });
                  }} />
                </div>
                <div className="font-mono text-[10px] text-neo-muted leading-relaxed mt-2">
                  {phase.project.desc}
                </div>
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
