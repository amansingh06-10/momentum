"use client";

import { useApp } from "@/lib/DataContext";
import { EditableField } from "@/components/EditableField";
import { motion } from "framer-motion";
import { Server, Globe, CheckCircle2, Circle, ArrowRightCircle, ExternalLink, Code2, Database } from "lucide-react";

export default function BackendRoadmapPage() {
  const { data, updateData } = useApp();

  const getStatusIcon = (status: string) => {
    if (status === "done") return <CheckCircle2 size={18} className="text-slate-300 shrink-0" />;
    if (status === "partial") return <ArrowRightCircle size={18} className="text-amber-400 shrink-0" />;
    return <Circle size={18} className="text-slate-600 shrink-0" />;
  };

  const handleUpdate = (phaseIndex: number, field: string, value: any) => {
    const newRoadmap = JSON.parse(JSON.stringify(data.backendRoadmap || []));
    if (!newRoadmap[phaseIndex]) return;
    newRoadmap[phaseIndex][field] = value;
    updateData({ ...data, backendRoadmap: newRoadmap });
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
            Backend Engineering Track
          </h2>
          <div className="font-mono text-xs text-slate-400 mt-1">
            Structured roadmap from JavaScript fundamentals to production Node.js, Express, MongoDB & PostgreSQL architectures
          </div>
        </div>

        <div className="neo-inset px-4 py-2 font-mono text-xs text-slate-300 flex items-center gap-2">
          <Server size={14} className="text-amber-400" />
          <span>Full Stack Node.js & Database Track</span>
        </div>
      </div>

      {/* Roadmap Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(data.backendRoadmap || []).map((phase, pIdx) => (
          <motion.div
            key={phase.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: pIdx * 0.05 }}
            whileHover={{ y: -4, scale: 1.01 }}
            className="neo-card p-6 flex flex-col justify-between group transition-all"
          >
            <div>
              {/* Phase Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="w-full">
                  <div className="font-mono text-[10px] text-slate-400 uppercase mb-1 flex items-center gap-2">
                    <EditableField value={phase.week} onChange={(v) => handleUpdate(pIdx, "week", v)} />
                    <span className="text-slate-600">·</span>
                    <span className={`capitalize font-bold ${
                      phase.status === 'done' ? 'text-slate-200' : phase.status === 'partial' ? 'text-amber-400' : 'text-slate-500'
                    }`}>
                      {phase.status}
                    </span>
                  </div>
                  <EditableField
                    value={phase.label}
                    onChange={(v) => handleUpdate(pIdx, "label", v)}
                    className="font-bold text-white text-lg leading-tight w-full"
                    renderAs="h3"
                  />
                </div>
                <div className="shrink-0">{getStatusIcon(phase.status)}</div>
              </div>

              {/* Time Period */}
              <div className="font-mono text-xs text-slate-400 mb-4 pb-3 border-b border-white/[0.04]">
                <EditableField value={phase.period} onChange={(v) => handleUpdate(pIdx, "period", v)} />
              </div>

              {/* Topics List */}
              <ul className="flex flex-col gap-2 mb-6">
                {(phase.topics || []).map((topic, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed font-sans">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-500 mt-1.5 shrink-0" />
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Project Artifact Card */}
            {phase.project && (
              <a
                href={phase.project.url}
                target="_blank"
                rel="noreferrer"
                className="mt-auto p-4 rounded-xl neo-inset hover:bg-[#11131c] transition-all group/link block"
              >
                <div className="font-mono font-bold text-xs text-white mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-200">
                    <Globe size={13} className="text-amber-400" />
                    {phase.project.name}
                  </span>
                  <ExternalLink size={12} className="text-slate-500 group-hover/link:text-white transition-colors" />
                </div>
                <div className="text-[11px] text-slate-400 leading-relaxed font-sans mt-1">
                  {phase.project.desc}
                </div>
              </a>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
