"use client";

import { useState, useEffect } from "react";
import { useApp } from "@/lib/DataContext";
import { X, Save, AlertTriangle, Download, Upload } from "lucide-react";

export function GlobalDataEditor() {
  const { isDataModalOpen, setIsDataModalOpen, data, updateData } = useApp();
  const [jsonText, setJsonText] = useState("");
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="fixed inset-0 z-[1000] bg-black/70 backdrop-blur-md flex items-center justify-center p-6 font-sans">
      <div className="neo-elevated w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden border border-white/[0.06] shadow-2xl">
        
        {/* Header */}
        <div className="p-4 border-b border-white/[0.04] flex justify-between items-center bg-[#181b26]">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 bg-amber-400 rounded-full" />
            <h2 className="font-mono text-sm font-bold text-white tracking-wider uppercase">
              Global State Editor
            </h2>
          </div>
          <div className="flex gap-2.5 flex-wrap">
            <button 
              onClick={downloadBackup}
              className="px-3.5 py-1.5 font-mono text-xs neo-btn text-slate-300 hover:text-white flex items-center gap-1.5"
            >
              <Download size={13} /> Backup
            </button>
            <label className="px-3.5 py-1.5 font-mono text-xs neo-btn text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer">
              <Upload size={13} /> Import
              <input type="file" accept=".json" className="hidden" onChange={uploadBackup} />
            </label>
            <button 
              onClick={() => setIsDataModalOpen(false)}
              className="px-3.5 py-1.5 font-mono text-xs text-slate-400 hover:text-white transition-colors ml-2"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="neo-btn-primary px-5 py-1.5 font-mono text-xs font-semibold flex items-center gap-1.5 rounded-xl"
            >
              <Save size={13} /> Save Changes
            </button>
          </div>
        </div>

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
            className="absolute inset-0 w-full h-full p-6 bg-transparent text-slate-200 font-mono text-xs leading-relaxed resize-none outline-none"
            spellCheck={false}
          />
        </div>
        
        <div className="p-3 border-t border-white/[0.04] bg-[#141620] text-center font-mono text-[11px] text-slate-400">
          Modify the raw JSON state. Changes will update heatmaps, schedules, logs, and progress immediately.
        </div>
      </div>
    </div>
  );
}
