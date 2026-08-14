"use client";

import { useState } from "react";
import { useApp } from "@/lib/DataContext";
import { ChevronDown, ChevronRight, CheckCircle, Circle, ArrowRightCircle } from "lucide-react";

export default function ProgressPage() {
  const { data, toggleTopicStatus } = useApp();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(
    Object.keys(data.progress || {}).reduce((acc, key) => ({ ...acc, [key]: true }), {})
  );

  const toggleSection = (key: string) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getStatusIcon = (status: string) => {
    if (status === 'done') return <CheckCircle size={16} className="text-neo-mint " />;
    if (status === 'partial') return <ArrowRightCircle size={16} className="text-amber-500" />;
    return <Circle size={16} className="text-neo-muted" />;
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold font-mono tracking-tight text-white">
          <span className="text-neo-cyan mr-2">/</span> DSA Sheet Progress
        </h2>
        <div className="font-mono text-xs text-neo-muted">
          Track mastery level for all patterns
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {Object.entries(data.progress || {}).map(([key, section]) => {
          const doneCount = section.topics.filter(t => t.status === 'done').length;
          const isExpanded = expandedSections[key];
          
          return (
            <div key={key} className="neo-flat rounded-2xl overflow-hidden border border-white/5 transition-all">
              <button 
                onClick={() => toggleSection(key)}
                className="w-full flex items-center justify-between p-5 bg-gradient-to-r hover:from-white/[0.02] hover:to-transparent transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="text-neo-muted">
                    {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                  </div>
                  <h3 className="font-bold font-mono text-white text-lg">{section.label}</h3>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-32 h-1.5 bg-black/40 neo-inset rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-neo-cyan transition-all duration-500"
                      style={{ width: `${(doneCount / section.total) * 100}%` }}
                    />
                  </div>
                  <div className="font-mono text-xs font-bold text-neo-muted w-12 text-right">
                    {doneCount}/{section.total}
                  </div>
                </div>
              </button>

              {isExpanded && (
                <div className="px-5 pb-5 pt-2 grid grid-cols-1 md:grid-cols-2 gap-3 border-t border-white/5">
                  {section.topics.map((topic) => (
                    <div 
                      key={topic.id}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.02] border border-transparent hover:border-white/5 transition-colors group cursor-pointer"
                      onClick={() => toggleTopicStatus(key, topic.id)}
                    >
                      <div className="flex items-center gap-3">
                        <button className="neo-btn p-1 rounded-full bg-neo-surface border border-white/5 shadow-inner">
                          {getStatusIcon(topic.status)}
                        </button>
                        <span className={`font-mono text-sm transition-colors ${topic.status === 'done' ? 'text-neo-muted line-through' : 'text-white group-hover:text-neo-cyan'}`}>
                          {topic.name}
                        </span>
                      </div>
                      
                      {topic.status === 'done' && (
                        <div className="flex gap-1 items-center">
                          <span className="font-mono text-[10px] text-neo-muted">CONF</span>
                          <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded bg-black/20 neo-inset ${topic.confidence >= 9 ? 'text-neo-mint' : 'text-neo-cyan'}`}>
                            {topic.confidence}/10
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
