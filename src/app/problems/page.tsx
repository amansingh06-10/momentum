"use client";

import { useState } from "react";
import { useApp } from "@/lib/DataContext";
import { Search, Filter, CheckCircle, Circle, ArrowRightCircle } from "lucide-react";
import { NeoSelect } from "@/components/NeoSelect";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function ProblemsPage() {
  const { data, toggleTopicStatus } = useApp();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Flatten all problems from the progress state
  const allProblems = Object.entries(data.progress || {}).flatMap(([sectionKey, section]) => {
    return section.topics.map(topic => ({
      ...topic,
      sectionKey,
      sectionLabel: section.label
    }));
  });

  // Filter logic
  const filteredProblems = allProblems.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    if (status === 'done') return <CheckCircle size={16} className="text-neo-cyan" />;
    if (status === 'partial') return <ArrowRightCircle size={16} className="text-white/60" />;
    return <Circle size={16} className="text-white/20" />;
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-end mb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white mb-1">
            Problems Database
          </h2>
          <div className="font-mono text-xs text-neo-muted">
            Search and manage all {allProblems.length} DSA problems.
          </div>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neo-muted" />
            <input 
              type="text" 
              placeholder="Search problems..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full neo-input py-2.5 pl-9 pr-4 font-mono text-xs text-white placeholder:text-neo-muted transition-colors focus:ring-1 focus:ring-neo-cyan"
            />
          </div>
          
          <div className="flex items-center gap-2 relative">
             <Filter size={14} className="text-neo-muted absolute left-3 z-10 pointer-events-none" />
             <NeoSelect
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: "all", label: "All Status" },
                { value: "done", label: "Done" },
                { value: "partial", label: "Revisit" },
                { value: "pending", label: "Pending" }
              ]}
              className="w-36 shrink-0 pl-7"
            />
          </div>
        </div>
      </div>

      {/* Problems List */}
      <div className="neo-flat overflow-hidden border border-white/5">
        <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 p-4 border-b border-white/5 bg-white/[0.02] font-mono text-[10px] text-neo-muted uppercase tracking-widest">
          <div className="w-8 text-center">Status</div>
          <div>Problem Name & Section</div>
          <div className="w-20 text-center">Confidence</div>
          <div className="w-24 text-right">Action</div>
        </div>

        <div className="max-h-[65vh] overflow-y-auto">
          {filteredProblems.length > 0 ? (
            filteredProblems.slice(0, 50).map((problem, idx) => (
              <ScrollReveal key={`${problem.sectionKey}-${problem.id}-${idx}`}>
                <div 
                  className="grid grid-cols-[auto_1fr_auto_auto] gap-4 p-4 border-b border-white/5 items-center hover:bg-white/[0.02] transition-colors group"
                >
                  <div className="w-8 flex justify-center">
                    {getStatusIcon(problem.status)}
                  </div>
                  
                  <div>
                    <div className={`font-mono text-sm mb-1 ${problem.status === 'done' ? 'text-neo-muted line-through' : 'text-white font-bold'}`}>
                      {problem.name}
                    </div>
                    <div className="font-mono text-[10px] text-neo-muted bg-white/5 px-2 py-0.5 rounded inline-block border border-white/5">
                      {problem.sectionLabel}
                    </div>
                  </div>

                  <div className="w-20 flex justify-center">
                    {problem.status === 'done' ? (
                       <div className="font-mono text-xs font-bold px-2 py-1 rounded bg-black/20 neo-inset text-white border border-white/5">
                         {problem.confidence}/10
                       </div>
                    ) : (
                       <span className="text-neo-muted text-xs">-</span>
                    )}
                  </div>

                  <div className="w-24 text-right">
                    <button 
                      onClick={() => toggleTopicStatus(problem.sectionKey, problem.id)}
                      className="font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 rounded neo-btn hover:text-white"
                    >
                      Toggle
                    </button>
                  </div>
                </div>
              </ScrollReveal>
            ))
          ) : (
            <div className="p-10 text-center font-mono text-sm text-neo-muted">
              No problems found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
