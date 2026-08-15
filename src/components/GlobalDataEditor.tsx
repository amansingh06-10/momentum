"use client";

import { useState, useEffect } from "react";
import { useApp } from "@/lib/DataContext";
import { X, Save, AlertTriangle, Download, Upload, Cloud, Database, Check, Copy } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabaseClient";

export function GlobalDataEditor() {
  const { isDataModalOpen, setIsDataModalOpen, data, updateData, isCloudConnected, syncStatus } = useApp();
  const [jsonText, setJsonText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  useEffect(() => {
    if (isDataModalOpen) {
      setJsonText(JSON.stringify(data, null, 2));
      setError(null);
    }
  }, [isDataModalOpen, data]);

  if (!isDataModalOpen) return null;

  const handleSave = () => {
    try {
      const parsed = JSON.parse(jsonText);
      updateData(parsed);
      setError(null);
      setIsDataModalOpen(false);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const downloadBackup = () => {
    const blob = new Blob([jsonText], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `momentum_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const uploadBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        setJsonText(text);
        setError(null);
      } catch (err: any) {
        setError("Failed to read file.");
      }
    };
    reader.readAsText(file);
  };

  const supabaseSql = `create table if not exists momentum_state (
  id text primary key default 'aman_momentum_main',
  data jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);`;

  const copySql = () => {
    navigator.clipboard.writeText(supabaseSql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-black/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="neo-elevated w-full max-w-5xl h-[88vh] flex flex-col overflow-hidden border border-white/[0.06] shadow-2xl">
        
        {/* Header */}
        <div className="p-4 border-b border-white/[0.04] flex justify-between items-center bg-[#181b26] flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-2.5 h-2.5 rounded-full ${isCloudConnected ? "bg-emerald-400" : "bg-amber-400"}`} />
            <div>
              <h2 className="font-mono text-sm font-bold text-white tracking-wider uppercase flex items-center gap-2">
                Global State & Cloud Sync
              </h2>
              <div className="font-mono text-[10px] text-slate-400">
                {isCloudConnected ? (
                  <span className="text-emerald-400">☁️ Supabase Connected ({syncStatus})</span>
                ) : (
                  <span className="text-slate-400">💾 Local Mode (Configure Supabase in .env for multi-device sync)</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            <button 
              onClick={downloadBackup}
              className="px-3 py-1.5 font-mono text-xs neo-btn text-slate-300 hover:text-white flex items-center gap-1.5"
            >
              <Download size={13} /> Backup JSON
            </button>
            <label className="px-3 py-1.5 font-mono text-xs neo-btn text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer">
              <Upload size={13} /> Import JSON
              <input type="file" accept=".json" className="hidden" onChange={uploadBackup} />
            </label>
            <button 
              onClick={() => setIsDataModalOpen(false)}
              className="px-3 py-1.5 font-mono text-xs text-slate-400 hover:text-white transition-colors ml-1"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="neo-btn-primary px-4 py-1.5 font-mono text-xs font-semibold flex items-center gap-1.5 rounded-xl"
            >
              <Save size={13} /> Save State
            </button>
          </div>
        </div>

        {/* Supabase Quick Guide Notice if not configured */}
        {!isCloudConnected && (
          <div className="bg-[#141824] border-b border-white/[0.04] p-3 px-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs font-mono text-slate-300">
            <div className="flex items-center gap-2">
              <Database size={14} className="text-amber-400 shrink-0" />
              <span>
                To enable <strong>automatic Supabase sync</strong>, paste your Supabase URL & Anon Key into <code className="text-amber-300 neo-inset px-1.5 py-0.5 rounded">.env.local</code> and Vercel Environment Variables.
              </span>
            </div>
            <button
              onClick={copySql}
              className="neo-btn px-2.5 py-1 text-[11px] flex items-center gap-1 text-slate-300 hover:text-white shrink-0"
            >
              {copiedSql ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              <span>{copiedSql ? "SQL Copied!" : "Copy Supabase SQL Table"}</span>
            </button>
          </div>
        )}

        {/* Error Bar */}
        {error && (
          <div className="bg-rose-950/60 border-b border-rose-500/30 p-3 flex items-center gap-2 text-rose-300 font-mono text-xs">
            <AlertTriangle size={14} />
            JSON Parse Error: {error}
          </div>
        )}

        {/* Editor */}
        <div className="flex-1 bg-[#0d0f17] relative">
          <textarea
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            className="absolute inset-0 w-full h-full p-6 bg-transparent text-slate-200 font-mono text-xs leading-relaxed resize-none outline-none scrollbar-thin"
            spellCheck={false}
          />
        </div>
        
        <div className="p-3 border-t border-white/[0.04] bg-[#141620] text-center font-mono text-[11px] text-slate-400">
          Modify raw JSON state. Changes will persist to LocalStorage and automatically sync to Supabase if configured.
        </div>
      </div>
    </div>
  );
}
