"use client";

import { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";

interface AgentMessage {
  agent: string;
  status: string;
  message: string;
}

const agentConfig: Record<string, { label: string; icon: string; color: string; border: string; badge: string }> = {
  research: {
    label: "Research Agent",
    icon: "🔍",
    color: "bg-blue-900/40",
    border: "border-blue-500/50",
    badge: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
  },
  planner: {
    label: "Planner Agent",
    icon: "📋",
    color: "bg-amber-900/40",
    border: "border-amber-500/50",
    badge: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
  },
  executor: {
    label: "Executor Agent",
    icon: "⚙️",
    color: "bg-emerald-900/40",
    border: "border-emerald-500/50",
    badge: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
  },
  validator: {
    label: "Validator Agent",
    icon: "✅",
    color: "bg-purple-900/40",
    border: "border-purple-500/50",
    badge: "bg-purple-500/20 text-purple-300 border border-purple-500/30",
  },
  complete: {
    label: "Pipeline Complete",
    icon: "🎉",
    color: "bg-gray-800/40",
    border: "border-gray-500/50",
    badge: "bg-gray-500/20 text-gray-300 border border-gray-500/30",
  },
  error: {
    label: "Error",
    icon: "❌",
    color: "bg-red-900/40",
    border: "border-red-500/50",
    badge: "bg-red-500/20 text-red-300 border border-red-500/30",
  },
};

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  const runPipeline = () => {
    if (!input.trim() || isRunning) return;

    setMessages([]);
    setIsRunning(true);

    const ws = new WebSocket("ws://127.0.0.1:8000/ws");
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ user_input: input }));
    };

    ws.onmessage = (event) => {
      const data: AgentMessage = JSON.parse(event.data);
      setMessages((prev) => {
        // Replace starting message with real result for same agent
        const filtered = prev.filter(
          (m) => !(m.agent === data.agent && m.status === "starting")
        );
        return [...filtered, data];
      });
      if (data.agent === "complete" || data.agent === "error") {
        setIsRunning(false);
        ws.close();
      }
    };

    ws.onerror = () => setIsRunning(false);
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Top nav */}
      <div className="border-b border-white/10 px-6 py-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-sm">🤖</div>
        <span className="font-semibold text-white">Multi-Agent AI Pipeline</span>
        <span className="ml-auto text-xs text-gray-500 bg-white/5 px-3 py-1 rounded-full border border-white/10">
          Powered by LangGraph + Groq
        </span>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            AI Data Pipeline Builder
          </h1>
          <p className="text-gray-400 text-lg">
            Describe your data problem. Watch 4 specialized agents collaborate to solve it.
          </p>
        </div>

        {/* Agent flow indicators */}
        <div className="flex items-center justify-center gap-2 mb-8 text-sm">
          {["🔍 Research", "📋 Plan", "⚙️ Execute", "✅ Validate"].map((label, i, arr) => (
            <div key={label} className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400">
                {label}
              </span>
              {i < arr.length - 1 && <span className="text-gray-600">→</span>}
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="flex gap-3 mb-10">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && runPipeline()}
            placeholder="e.g. I have sales data and want to detect anomalies..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/70 focus:bg-white/8 transition-all"
          />
          <button
            onClick={runPipeline}
            disabled={isRunning}
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-white/10 disabled:text-gray-500 disabled:cursor-not-allowed px-7 py-4 rounded-xl font-semibold transition-all text-sm whitespace-nowrap"
          >
            {isRunning ? (
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Running...
              </span>
            ) : (
              "Run Pipeline →"
            )}
          </button>
        </div>

        {/* Messages */}
        <div className="space-y-4">
          {messages.map((msg, i) => {
            const config = agentConfig[msg.agent];
            if (!config) return null;
            const isStarting = msg.status === "starting";

            return (
              <div
                key={i}
                className={`rounded-xl border p-5 ${config.color} ${config.border} transition-all`}
              >
                {/* Agent header */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xl">{config.icon}</span>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${config.badge}`}>
                    {config.label}
                  </span>
                  {isRunning && i === messages.length - 1 && (
                    <span className="ml-auto flex items-center gap-1 text-xs text-gray-500">
                      <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                      working
                    </span>
                  )}
                </div>

                {/* Content */}
                {isStarting ? (
                  <p className="text-gray-400 text-sm animate-pulse">{msg.message}</p>
                ) : msg.agent === "complete" ? (
                  <p className="text-gray-300 text-sm">{msg.message}</p>
                ) : (
                  <div className="prose prose-invert prose-sm max-w-none
                    prose-headings:text-white prose-headings:font-semibold
                    prose-p:text-gray-300 prose-p:leading-relaxed
                    prose-strong:text-white
                    prose-li:text-gray-300
                    prose-code:text-emerald-300 prose-code:bg-black/40 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs
                    prose-pre:bg-black/60 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-lg
                  ">
                    <ReactMarkdown>{msg.message}</ReactMarkdown>
                  </div>
                )}
              </div>
            );
          })}

          {/* Empty state */}
          {messages.length === 0 && !isRunning && (
            <div className="text-center py-20 text-gray-600">
              <div className="text-5xl mb-4">🤖</div>
              <p>Enter a data problem above and hit Run Pipeline</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}