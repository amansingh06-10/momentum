"use client";

import { useState, useRef, useEffect } from "react";
import { useApp } from "@/lib/DataContext";
import { Send, X, AlertCircle, Sparkles, User, Copy, Check, Trash2, Bot, Code2, Terminal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NeoSelect } from "./NeoSelect";

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 rounded-xl overflow-hidden border border-white/10 bg-[#090a0f] shadow-lg font-mono text-xs">
      <div className="flex items-center justify-between px-3.5 py-2 bg-white/[0.04] border-b border-white/10 text-slate-400 text-[11px]">
        <span className="flex items-center gap-1.5 text-cyan-400 font-medium lowercase">
          <Terminal size={12} />
          {language || "code"}
        </span>
        <button
          onClick={handleCopyCode}
          className="flex items-center gap-1 hover:text-white transition-colors text-[10px] bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded-md"
        >
          {copied ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
          {copied ? "Copied" : "Copy code"}
        </button>
      </div>
      <pre className="p-3.5 overflow-x-auto text-slate-200 leading-relaxed font-mono selection:bg-cyan-500/30">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function InlineText({ text }: { text: string }) {
  // Parse inline code `code`, bold **bold**, italic *italic*
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g);

  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code
              key={i}
              className="px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-mono text-[11px]"
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="font-semibold text-white">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith("*") && part.endsWith("*")) {
          return (
            <em key={i} className="italic text-slate-300">
              {part.slice(1, -1)}
            </em>
          );
        }
        return part;
      })}
    </>
  );
}

function NaturalMarkdownRenderer({ content }: { content: string }) {
  // Parse block-level markdown elements: code blocks, headings, lists, blockquotes, paragraphs
  const blocks = content.split(/\n\n+/);

  return (
    <div className="space-y-3 text-slate-200 text-xs sm:text-[13px] leading-relaxed font-sans">
      {blocks.map((block, bIdx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // Fenced code block check ```lang \n code \n ```
        if (trimmed.startsWith("```")) {
          const lines = trimmed.split("\n");
          const firstLine = lines[0].replace(/^```/, "").trim();
          const lastLineIdx = lines.length - 1;
          const codeContent = lines
            .slice(1, lines[lastLineIdx].startsWith("```") ? lastLineIdx : lines.length)
            .join("\n");
          return <CodeBlock key={bIdx} code={codeContent} language={firstLine} />;
        }

        // Headings
        if (trimmed.startsWith("# ")) {
          return (
            <h1 key={bIdx} className="text-base font-bold text-white pt-1 border-b border-white/10 pb-1">
              <InlineText text={trimmed.slice(2)} />
            </h1>
          );
        }
        if (trimmed.startsWith("## ")) {
          return (
            <h2 key={bIdx} className="text-sm font-semibold text-cyan-300 pt-1">
              <InlineText text={trimmed.slice(3)} />
            </h2>
          );
        }
        if (trimmed.startsWith("### ")) {
          return (
            <h3 key={bIdx} className="text-xs font-semibold text-slate-100 pt-0.5">
              <InlineText text={trimmed.slice(4)} />
            </h3>
          );
        }

        // List block (bullets or numbers)
        const lines = trimmed.split("\n");
        const isList = lines.every(
          (l) =>
            l.trim().startsWith("•") ||
            l.trim().startsWith("-") ||
            l.trim().startsWith("*") ||
            /^\d+\.\s/.test(l.trim())
        );

        if (isList) {
          return (
            <ul key={bIdx} className="space-y-1.5 pl-1 my-1">
              {lines.map((l, lIdx) => {
                const clean = l.trim().replace(/^[•\-\*]\s*/, "").replace(/^\d+\.\s*/, "");
                return (
                  <li key={lIdx} className="flex items-start gap-2 text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80 mt-1.5 shrink-0 shadow-[0_0_6px_rgba(34,211,238,0.5)]" />
                    <div className="flex-1 leading-relaxed">
                      <InlineText text={clean} />
                    </div>
                  </li>
                );
              })}
            </ul>
          );
        }

        // Blockquote
        if (trimmed.startsWith("> ")) {
          return (
            <blockquote
              key={bIdx}
              className="pl-3 py-1.5 border-l-2 border-cyan-500/50 bg-cyan-950/20 text-slate-300 italic rounded-r-lg"
            >
              <InlineText text={trimmed.slice(2)} />
            </blockquote>
          );
        }

        // Standard Paragraph
        return (
          <p key={bIdx} className="text-slate-300 leading-relaxed">
            {lines.map((l, lIdx) => (
              <span key={lIdx}>
                <InlineText text={l} />
                {lIdx < lines.length - 1 && <br />}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}

export function AIChatDrawer() {
  const { updateData, data, isChatOpen, setIsChatOpen } = useApp();
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    {
      role: "assistant",
      content:
        "Hello Aman! How can I help you today? You can ask coding questions, explain DSA concepts, discuss backend architecture, or update your study tracker.",
    },
  ]);
  const [input, setInput] = useState("");
  const [model, setModel] = useState("gemini");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isChatOpen]);

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "Chat history cleared. What would you like to work on next?",
      },
    ]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userMsg = input.trim();
    if (!userMsg || isLoading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMsg, model, currentData: data }),
      });

      const resData = await response.json();

      if (resData.error) {
        setMessages((prev) => [...prev, { role: "assistant", content: `I encountered an issue: ${resData.error}` }]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: resData.message }]);

        if (resData.stateMutations && resData.stateMutations.updatedData) {
          const updatedData = resData.stateMutations.updatedData;
          if (updatedData) {
            updateData(updatedData);

            const muts = resData.stateMutations;
            let changes = [];
            if (muts.addDayLog) changes.push("Logged study session");
            if (muts.addNewWeek) changes.push("Started new week");
            if (muts.updateProgress && muts.updateProgress.length > 0) changes.push("Updated DSA progress");
            if (muts.updateOverview) changes.push("Updated overview stats");
            if (muts.updateBackend && muts.updateBackend.length > 0) changes.push("Updated backend roadmap");
            if (muts.updateLog && muts.updateLog.length > 0) changes.push("Modified log entries");
            if (muts.replaceFullState) changes.push("Replaced full tracker state");

            const systemMsg =
              changes.length > 0
                ? `Tracker Synchronized: ${changes.join(", ")}.`
                : "Tracker Synchronized.";

            setMessages((prev) => [...prev, { role: "system", content: systemMsg }]);
          }
        }
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Connection issue. Please check your network and try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-8 right-8 z-[100] w-13 h-13 rounded-full bg-[#121420] border border-cyan-500/40 text-cyan-400 flex items-center justify-center shadow-[0_0_25px_rgba(0,212,255,0.35)] group transition-all"
        title="Open AI Assistant"
      >
        <Sparkles size={20} className="transition-transform group-hover:rotate-12 group-hover:scale-110" />
      </motion.button>

      {/* Drawer Container */}
      <AnimatePresence>
        {isChatOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsChatOpen(false)}
              className="fixed inset-0 bg-black/65 backdrop-blur-sm z-[150]"
            />

            {/* Main Chat Drawer */}
            <motion.div
              initial={{ x: "100%", opacity: 0.8 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0.8 }}
              transition={{ type: "spring", damping: 30, stiffness: 240 }}
              className="fixed inset-y-0 right-0 w-full sm:w-[520px] md:w-[560px] bg-[#0c0d12] border-l border-white/10 shadow-[-20px_0_60px_rgba(0,0,0,0.85)] z-[200] flex flex-col font-sans"
            >
              {/* Header */}
              <div className="p-4 sm:px-5 sm:py-4 border-b border-white/10 flex justify-between items-center bg-[#0e1017]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-indigo-500/30 flex items-center justify-center shadow-[0_0_12px_rgba(99,102,241,0.25)]">
                    <Bot size={19} className="text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm flex items-center gap-2">
                      AI Assistant
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Online" />
                    </h3>
                    <p className="text-[11px] text-slate-400">Ask questions or update your tracker</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <NeoSelect
                    value={model}
                    onChange={setModel}
                    options={[{ value: "gemini", label: "Gemini Flash" }]}
                    className="w-32 text-xs"
                  />
                  <button
                    onClick={handleClearChat}
                    className="text-slate-400 hover:text-rose-400 transition-colors p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/5"
                    title="Clear Chat"
                  >
                    <Trash2 size={16} />
                  </button>
                  <button
                    onClick={() => setIsChatOpen(false)}
                    className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/5"
                    title="Close"
                  >
                    <X size={17} />
                  </button>
                </div>
              </div>

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-white/10">
                {messages.map((msg, i) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={i}
                    className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                  >
                    {/* Header info */}
                    {msg.role === "assistant" && (
                      <div className="flex items-center gap-1.5 mb-1.5 pl-0.5">
                        <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                          <Sparkles size={12} className="text-cyan-400" />
                          Assistant
                        </span>
                      </div>
                    )}

                    {msg.role === "user" && (
                      <div className="flex items-center gap-1.5 mb-1.5 pr-0.5">
                        <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                          You
                          <User size={12} className="text-indigo-400" />
                        </span>
                      </div>
                    )}

                    {/* Content Box */}
                    <div
                      className={`relative group max-w-[94%] sm:max-w-[90%] ${
                        msg.role === "user"
                          ? "bg-indigo-600/20 border border-indigo-500/30 text-white rounded-2xl rounded-tr-xs px-4 py-3 shadow-md"
                          : msg.role === "system"
                          ? "w-full bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 rounded-xl py-2.5 px-3.5 font-mono text-xs flex items-center gap-2 shadow-sm"
                          : "bg-[#13151f]/90 border border-white/[0.08] text-slate-200 rounded-2xl rounded-tl-xs p-4 shadow-md backdrop-blur-md"
                      }`}
                    >
                      {msg.role === "system" ? (
                        <>
                          <AlertCircle size={14} className="text-emerald-400 shrink-0" />
                          <div className="font-mono text-[11px] text-emerald-300">{msg.content}</div>
                        </>
                      ) : msg.role === "assistant" ? (
                        <>
                          <NaturalMarkdownRenderer content={msg.content} />
                          <button
                            onClick={() => handleCopy(msg.content, i)}
                            className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white"
                            title="Copy message"
                          >
                            {copiedIdx === i ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                          </button>
                        </>
                      ) : (
                        <div className="whitespace-pre-wrap text-xs sm:text-[13px] leading-relaxed text-slate-100 font-sans">
                          {msg.content}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}

                {/* Loading indicator */}
                {isLoading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-start">
                    <div className="flex items-center gap-1.5 mb-1.5 pl-0.5">
                      <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                        <Sparkles size={12} className="text-cyan-400 animate-spin" />
                        Assistant is thinking...
                      </span>
                    </div>
                    <div className="bg-[#13151f]/90 border border-white/[0.08] rounded-2xl rounded-tl-xs px-4 py-3 text-slate-400 text-xs flex items-center gap-2.5 shadow-md">
                      <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                      <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: "300ms" }} />
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Bottom Input Area */}
              <div className="p-4 sm:p-5 border-t border-white/10 bg-[#08090e]">
                <form onSubmit={handleSubmit} className="flex gap-3 items-end">
                  <div className="flex-1 relative">
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSubmit(e);
                        }
                      }}
                      placeholder="Ask anything or log your session..."
                      className="w-full bg-[#12141f] border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-[13px] text-white placeholder:text-slate-500 outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all resize-none min-h-[46px] max-h-[120px] scrollbar-thin font-sans"
                      disabled={isLoading}
                      rows={1}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="h-[46px] w-[46px] rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-[0_0_18px_rgba(0,212,255,0.4)] transition-all shrink-0 active:scale-95"
                    title="Send message"
                  >
                    <Send size={16} className="text-slate-950" />
                  </button>
                </form>
                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 px-1 font-mono">
                  <span>Enter to send, Shift+Enter for new line</span>
                  <span>Markdown & Code Supported</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
