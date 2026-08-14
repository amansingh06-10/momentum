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
        setJsonText(text); // Just load it into the editor so they can review before saving
        setError(null);
      } catch (err: any) {
        setError("Failed to read file.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="neo-flat w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-neo-cyan rounded-full animate-pulse shadow-[0_0_10px_var(--color-neo-cyan)]" />
            <h2 className="font-mono text-sm font-bold text-white tracking-widest uppercase">
              Global State Editor
            </h2>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={downloadBackup}
              className="px-4 py-2 font-mono text-[11px] text-neo-muted hover:text-white uppercase tracking-widest flex items-center gap-2 border border-white/5 rounded-lg bg-black/20"
            >
              <Download size={14} /> Backup
            </button>
            <label className="px-4 py-2 font-mono text-[11px] text-neo-muted hover:text-white uppercase tracking-widest flex items-center gap-2 border border-white/5 rounded-lg bg-black/20 cursor-pointer">
              <Upload size={14} /> Import
              <input type="file" accept=".json" className="hidden" onChange={uploadBackup} />
            </label>
            <button 
              onClick={() => setIsDataModalOpen(false)}
              className="px-4 py-2 font-mono text-[11px] text-neo-muted hover:text-white uppercase tracking-widest transition-colors ml-4"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="neo-btn neo-btn-primary px-6 py-2 font-mono text-[11px] uppercase tracking-widest flex items-center gap-2"
            >
              <Save size={14} /> Save Changes
            </button>
          </div>
        </div>

        {/* Error Bar */}
        {error && (
          <div className="bg-red-500/10 border-b border-red-500/20 p-3 flex items-center gap-2 text-red-400 font-mono text-xs">
            <AlertTriangle size={14} />
            JSON Parse Error: {error}
          </div>
        )}

        {/* Editor */}
        <div className="flex-1 bg-[#050505] relative">
          <textarea
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            className="absolute inset-0 w-full h-full p-6 bg-transparent text-[#e0e0e0] font-mono text-[13px] leading-relaxed resize-none outline-none focus:ring-1 focus:ring-neo-cyan/50"
            spellCheck={false}
          />
        </div>
        
        <div className="p-3 border-t border-white/10 bg-white/[0.02] text-center font-mono text-[10px] text-neo-muted">
          Modify the raw JSON state. Changes will update heatmaps, schedules, logs, and progress immediately.
        </div>
      </div>
    </div>
  );
}
