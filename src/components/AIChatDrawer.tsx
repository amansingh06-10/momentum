"use client";

import { useState, useRef, useEffect } from "react";
import { useApp } from "@/lib/DataContext";
import { Bot, Send, X, TerminalSquare, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NeoSelect } from "./NeoSelect";

export function AIChatDrawer() {
  const { updateData, data, isChatOpen, setIsChatOpen } = useApp();
  const [messages, setMessages] = useState<{role: string, content: string}[]>([
    { role: 'assistant', content: "SYSTEM INITIALIZED. I am your Session Logger AI. You can say something like: 'Logged 2 hrs, solved 3Sum and 4Sum, built auth middleware, energy was 5'. I'll process and update your tracker automatically." }
  ]);
  const [input, setInput] = useState("");
  const [model, setModel] = useState("gemini");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isChatOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMsg, model, currentData: data })
      });

      const resData = await response.json();
      
      if (resData.error) {
        setMessages(prev => [...prev, { role: 'assistant', content: `[ERROR] ${resData.error}` }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: resData.message }]);
        
        // If the AI returned state mutation actions
        if (resData.stateMutations && resData.stateMutations.updatedData) {
          const updatedData = resData.stateMutations.updatedData;
          if (updatedData) {
            updateData(updatedData);
            setMessages(prev => [...prev, { 
              role: 'system', 
              content: "STATE UPDATED: Tracker synchronized successfully." 
            }]);
          }
        }
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "[SYSTEM FAILURE] Cannot reach AI provider." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-8 right-8 z-[100] w-14 h-14 rounded-full neo-flat flex items-center justify-center neo-btn hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] border border-neo-cyan"
      >
        <Bot size={24} className="text-neo-cyan" />
      </button>

      {/* Drawer */}
      <AnimatePresence>
        {isChatOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsChatOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[150]"
            />
            <motion.div 
              initial={{ x: "100%", opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0.5 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-[450px] bg-neo-surface border-l border-white/5 shadow-[-20px_0_60px_rgba(0,0,0,0.8)] z-[200] flex flex-col"
            >
              {/* Header */}
              <div className="p-5 border-b border-white/5 flex justify-between items-center bg-gradient-to-b from-neo-bg to-transparent">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg neo-inset flex items-center justify-center border border-white/5 shadow-[0_0_15px_rgba(0,212,255,0.2)]">
                    <TerminalSquare size={16} className="text-neo-cyan" />
                  </div>
                  <div>
                    <h3 className="font-mono font-bold text-white tracking-wide text-sm">QUANTUM ORACLE</h3>
                    <div className="font-mono text-[9px] text-neo-mint animate-pulse">AUTO-LOGGER ONLINE</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <NeoSelect 
                    value={model} 
                    onChange={setModel}
                    options={[
                      { value: "gemini", label: "Gemini 1.5 Pro" },
                      { value: "claude", label: "Claude 3.5 Sonnet" },
                      { value: "kimi", label: "Moonshot Kimi" },
                      { value: "glm", label: "Zhipu GLM-4" }
                    ]}
                    className="w-40"
                  />
                  <button onClick={() => setIsChatOpen(false)} className="text-neo-muted hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-1.5 rounded-md">
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Chat History */}
              <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
                {messages.map((msg, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={i} 
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] rounded-2xl p-4 font-mono text-xs leading-relaxed shadow-lg ${
                      msg.role === 'user' 
                        ? 'neo-flat text-white border border-white/5 bg-white/[0.03]' 
                        : msg.role === 'system'
                        ? 'neo-inset text-neo-mint border border-neo-mint/20 bg-neo-mint/[0.02]'
                        : 'bg-black/40 border border-white/5 text-neo-muted'
                    }`}>
                      {msg.role === 'assistant' && <Bot size={14} className="mb-2 text-neo-cyan" />}
                      {msg.role === 'system' && <AlertCircle size={14} className="mb-2 text-neo-mint" />}
                      {msg.content}
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                    <div className="bg-black/40 border border-white/5 rounded-2xl p-4 font-mono text-xs text-neo-muted flex items-center gap-2 shadow-lg">
                      <div className="w-2 h-2 bg-neo-cyan rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-neo-magenta rounded-full animate-bounce" style={{animationDelay: '100ms'}} />
                      <div className="w-2 h-2 bg-neo-mint rounded-full animate-bounce" style={{animationDelay: '200ms'}} />
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-5 border-t border-white/5 bg-neo-bg">
                <form onSubmit={handleSubmit} className="flex gap-3">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Log your session..."
                    className="flex-1 neo-inset bg-neo-surface border border-white/5 rounded-xl px-4 py-3 font-mono text-xs text-white placeholder:text-white/20 outline-none focus:border-neo-cyan transition-colors"
                    disabled={isLoading}
                  />
                  <button 
                    type="submit" 
                    disabled={isLoading || !input.trim()}
                    className="neo-btn bg-gradient-to-br from-neo-cyan to-[#0099bb] text-black w-12 rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_15px_rgba(0,212,255,0.4)] transition-all"
                  >
                    <Send size={16} />
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
