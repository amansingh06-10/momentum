"use client";

import { useState, useRef, useEffect } from "react";
import { useApp } from "@/lib/DataContext";
import {
  Send,
  X,
  Sparkles,
  User,
  Copy,
  Check,
  Trash2,
  Bot,
  Terminal,
  CheckCircle2,
  Zap,
  TrendingUp,
  BookOpen,
  Calendar
} from "lucide-react";
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
    <div className="my-3 rounded-xl overflow-hidden neo-inset font-mono text-xs">
      <div className="flex items-center justify-between px-3.5 py-2 border-b border-white/[0.04] bg-white/[0.02] text-slate-400 text-[11px]">
        <span className="flex items-center gap-1.5 text-slate-300 font-medium lowercase">
          <Terminal size={12} className="text-amber-400" />
          {language || "code"}
        </span>
        <button
          onClick={handleCopyCode}
          className="flex items-center gap-1 hover:text-white transition-colors text-[10px] neo-btn px-2 py-0.5"
        >
          {copied ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
          {copied ? "Copied" : "Copy code"}
        </button>
      </div>
      <pre className="p-3.5 overflow-x-auto text-slate-200 leading-relaxed font-mono">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function InlineText({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g);

  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code
              key={i}
              className="px-1.5 py-0.5 rounded neo-inset text-amber-300 font-mono text-[11px]"
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
  const blocks = content.split(/\n\n+/);

  return (
    <div className="space-y-3 text-slate-200 text-xs sm:text-[13px] leading-relaxed font-sans">
      {blocks.map((block, bIdx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // Fenced code block check
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
            <h1 key={bIdx} className="text-base font-bold text-white pt-1 border-b border-white/[0.04] pb-1">
              <InlineText text={trimmed.slice(2)} />
            </h1>
          );
        }
        if (trimmed.startsWith("## ")) {
          return (
            <h2 key={bIdx} className="text-sm font-semibold text-amber-300 pt-1">
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

        // Table check
        if (trimmed.includes("|") && trimmed.split("\n").length >= 2) {
          const tableLines = trimmed.split("\n").filter((l) => l.trim().startsWith("|"));
          if (tableLines.length >= 2) {
            const headerCells = tableLines[0]
              .split("|")
              .map((c) => c.trim())
              .filter(Boolean);
            const bodyRows = tableLines
              .slice(2)
              .map((row) =>
                row
                  .split("|")
                  .map((c) => c.trim())
                  .filter(Boolean)
              );

            return (
              <div key={bIdx} className="my-2 overflow-x-auto rounded-lg neo-inset">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-white/[0.04] bg-white/[0.02]">
                      {headerCells.map((h, hIdx) => (
                        <th key={hIdx} className="p-2.5 text-slate-200 font-semibold">
                          <InlineText text={h} />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bodyRows.map((row, rIdx) => (
                      <tr key={rIdx} className="border-b border-white/[0.02] last:border-0 hover:bg-white/[0.02]">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="p-2.5 text-slate-300">
                            <InlineText text={cell} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }
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
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400/80 mt-1.5 shrink-0" />
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
              className="pl-3 py-1.5 border-l-2 border-amber-400 neo-inset text-slate-300 italic rounded-r-lg"
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

const QUICK_ACTIONS = [
  { label: "Log today's study", prompt: "Log today's study session: 2 DSA problems, 3 hours, rating 9/10", icon: Calendar },
  { label: "Check pace to 190", prompt: "How is my pace toward my 190 target goal? Give me breakdown and recommendations.", icon: TrendingUp },
  { label: "Explain an algorithm", prompt: "Explain the Sliding Window technique with an intuitive code example in C++.", icon: BookOpen },
  { label: "Mark problem done", prompt: "Mark Two Sum and Kadane's Algorithm as done with confidence 9/10.", icon: Zap },
];

export function AIChatDrawer() {
  const { updateData, data, isChatOpen, setIsChatOpen } = useApp();
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    {
      role: "assistant",
      content:
        "Hello Aman! I'm your Momentum AI copilot. Ask me any coding or algorithmic questions, discuss backend architectures, or let me log and update your tracker in real time.",
    },
  ]);
  const [input, setInput] = useState("");
  const [model, setModel] = useState("gemini-3.5-flash");
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
        content: "Chat history cleared. What would you like to focus on next?",
      },
    ]);
  };

  const executePrompt = async (promptText: string) => {
    const userMsg = promptText.trim();
    if (!userMsg || isLoading) return;

    const newMessages = [...messages, { role: "user", content: userMsg }];
    setInput("");
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userMsg,
          messages: newMessages,
          model,
          currentData: data
        }),
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
            let changes: string[] = [];
            if (muts.addDayLog) changes.push("Logged study session");
            if (muts.updateDayLog || muts.editDayLog) changes.push("Updated day log");
            if (muts.deleteDayLog) changes.push("Deleted log entry");
            if (muts.addNewWeek) changes.push("Started new week");
            if (muts.updateProgress || muts.updateTopic || muts.markTopicsDone) changes.push("Updated DSA progress");
            if (muts.updateOverview) changes.push("Updated overview targets");
            if (muts.updateBackend || muts.addBackendPhase) changes.push("Updated backend roadmap");
            if (muts.updateAcademics) changes.push("Updated academics marks");
            if (muts.updateSchedule) changes.push("Updated schedule slots");
            if (muts.replaceFullState) changes.push("Updated full tracker state");

            const systemMsg =
              changes.length > 0
                ? `⚡ Tracker Synchronized: ${changes.join(", ")}.`
                : "⚡ Tracker Synchronized.";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executePrompt(input);
  };

  return (
    <>
      {/* Floating Action Trigger Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-8 right-8 z-[100] w-12 h-12 rounded-full neo-btn text-amber-400 flex items-center justify-center group transition-all"
        title="Open AI Copilot"
      >
        <Sparkles size={18} className="transition-transform group-hover:scale-110" />
      </button>

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
              className="fixed inset-y-0 right-0 w-full sm:w-[540px] md:w-[580px] bg-[#141621] border-l border-white/[0.05] shadow-[-20px_0_50px_rgba(0,0,0,0.85)] z-[200] flex flex-col font-sans"
            >
              {/* Header */}
              <div className="p-4 sm:px-5 sm:py-4 border-b border-white/[0.04] flex justify-between items-center bg-[#181b26]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl neo-inset flex items-center justify-center">
                    <Bot size={18} className="text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm flex items-center gap-2">
                      Momentum AI
                      <span className="w-2 h-2 rounded-full bg-emerald-400" title="Online" />
                    </h3>
                    <p className="text-[11px] text-slate-400">Engineering copilot & live tracker synchronization</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <NeoSelect
                    value={model}
                    onChange={setModel}
                    options={[
                      { value: "gemini-3.5-flash", label: "Gemini 3.5 Flash" },
                      { value: "gemini-flash-latest", label: "Gemini Flash Latest" },
                      { value: "gemini-3.7-flash", label: "Gemini 3.7 Flash" },
                      { value: "gemini-flash-lite-latest", label: "Gemini Flash Lite" },
                    ]}
                    className="w-40 text-xs"
                  />
                  <button
                    onClick={handleClearChat}
                    className="text-slate-400 hover:text-rose-400 transition-colors p-2 rounded-lg neo-btn"
                    title="Clear Chat"
                  >
                    <Trash2 size={15} />
                  </button>
                  <button
                    onClick={() => setIsChatOpen(false)}
                    className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg neo-btn"
                    title="Close"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-4 scrollbar-thin">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                  >
                    {/* Header info */}
                    {msg.role === "assistant" && (
                      <div className="flex items-center gap-1.5 mb-1.5 pl-0.5">
                        <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                          <Sparkles size={12} className="text-amber-400" />
                          Momentum AI
                        </span>
                      </div>
                    )}

                    {msg.role === "user" && (
                      <div className="flex items-center gap-1.5 mb-1.5 pr-0.5">
                        <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                          You
                          <User size={12} className="text-slate-300" />
                        </span>
                      </div>
                    )}

                    {/* Content Box */}
                    <div
                      className={`relative group max-w-[94%] sm:max-w-[90%] ${
                        msg.role === "user"
                          ? "neo-inset text-white rounded-2xl rounded-tr-xs px-4 py-3"
                          : msg.role === "system"
                          ? "w-full neo-inset text-emerald-300 rounded-xl py-2.5 px-3.5 font-mono text-xs flex items-center gap-2"
                          : "neo-card text-slate-200 rounded-2xl rounded-tl-xs p-4"
                      }`}
                    >
                      {msg.role === "system" ? (
                        <>
                          <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                          <div className="font-mono text-[11px] text-emerald-300">{msg.content}</div>
                        </>
                      ) : msg.role === "assistant" ? (
                        <>
                          <NaturalMarkdownRenderer content={msg.content} />
                          <button
                            onClick={() => handleCopy(msg.content, i)}
                            className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md neo-btn text-slate-400 hover:text-white"
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
                  </div>
                ))}

                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex flex-col items-start">
                    <div className="flex items-center gap-1.5 mb-1.5 pl-0.5">
                      <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                        <Sparkles size={12} className="text-amber-400 animate-spin" />
                        Momentum AI is thinking...
                      </span>
                    </div>
                    <div className="neo-card rounded-2xl rounded-tl-xs px-4 py-3 text-slate-400 text-xs flex items-center gap-2">
                      <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-slate-500 rounded-full animate-pulse" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Actions Bar */}
              <div className="px-4 sm:px-5 py-2.5 border-t border-white/[0.04] bg-[#10121a] flex gap-2 overflow-x-auto scrollbar-none">
                {QUICK_ACTIONS.map((action, idx) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => executePrompt(action.prompt)}
                      disabled={isLoading}
                      className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg neo-btn text-[11px] text-slate-300 hover:text-white transition-all disabled:opacity-50"
                    >
                      <Icon size={12} className="text-amber-400" />
                      <span>{action.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Bottom Input Area */}
              <div className="p-4 sm:p-5 border-t border-white/[0.04] bg-[#10121a]">
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
                      placeholder="Ask any question or update your tracker..."
                      className="w-full neo-inset px-4 py-3 text-xs sm:text-[13px] text-white placeholder:text-slate-500 outline-none resize-none min-h-[46px] max-h-[120px] scrollbar-thin font-sans"
                      disabled={isLoading}
                      rows={1}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="h-[46px] w-[46px] rounded-xl neo-btn-primary flex items-center justify-center font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-all shrink-0 active:scale-95 text-white"
                    title="Send message"
                  >
                    <Send size={16} />
                  </button>
                </form>
                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 px-1 font-mono">
                  <span>Enter to send, Shift+Enter for new line</span>
                  <span>Markdown, Code & Live Sync Supported</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
