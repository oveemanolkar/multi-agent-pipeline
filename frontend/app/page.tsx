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

const agentSteps = [
  { key: "research", label: "Research", icon: "🔍" },
  { key: "planner", label: "Plan", icon: "📋" },
  { key: "executor", label: "Execute", icon: "⚙️" },
  { key: "validator", label: "Validate", icon: "✅" },
];

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const [isDone, setIsDone] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  const runPipeline = () => {
    if (!input.trim() || isRunning) return;

    setMessages([]);
    setIsRunning(true);
    setIsDone(false);
    setActiveAgent("research");

    const ws = new WebSocket("ws://127.0.0.1:8000/ws");
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ user_input: input }));
    };

    ws.onmessage = (event) => {
      const data: AgentMessage = JSON.parse(event.data);

      // Update active agent indicator
      if (data.status === "done" && data.agent !== "complete" && data.agent !== "error") {
        const keys = agentSteps.map((s) => s.key);
        const nextIndex = keys.indexOf(data.agent) + 1;
        if (nextIndex < keys.length) {
          setActiveAgent(keys[nextIndex]);
        }
      }

      setMessages((prev) => {
        const filtered = prev.filter(
          (m) => !(m.agent === data.agent && m.status === "starting")
        );
        return [...filtered, data];
      });

      if (data.agent === "complete" || data.agent === "error") {
        setIsRunning(false);
        setActiveAgent(null);
        setIsDone(true);
        ws.close();
      }
    };

    ws.onerror = () => {
      setIsRunning(false);
      setActiveAgent(null);
    };
  };

  const resetPipeline = () => {
    setMessages([]);
    setInput("");
    setIsDone(false);
    setActiveAgent(null);
  };

  const completedAgents = messages
    .filter((m) => m.status === "done" && m.agent !== "complete")
    .map((m) => m.agent);

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

        {/* Agent flow indicators - live highlighting */}
        <div className="flex items-center justify-center gap-2 mb-8 text-sm">
          {agentSteps.map((step, i) => {
            const isActive = activeAgent === step.key;
            const isCompleted = completedAgents.includes(step.key);
            return (
              <div key={step.key} className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full border transition-all duration-300 ${
                  isActive
                    ? "bg-blue-500/20 border-blue-400 text-blue-300 shadow-lg shadow-blue-500/20"
                    : isCompleted
                    ? "bg-white/10 border-white/20 text-white"
                    : "bg-white/5 border-white/10 text-gray-500"
                }`}>
                  {isActive && (
                    <span className="inline-block w-2 h-2 rounded-full bg-blue-400 animate-pulse mr-1" />
                  )}
                  {isCompleted && <span className="mr-1">✓</span>}
                  {step.icon} {step.label}
                </span>
                {i < agentSteps.length - 1 && (
                  <span className={`transition-colors duration-300 ${isCompleted ? "text-white/40" : "text-gray-700"}`}>
                    →
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Input */}
        <div className="flex gap-3 mb-10">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && runPipeline()}
            placeholder="e.g. I have sales data and want to detect anomalies..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/70 transition-all"
          />
          {isDone ? (
            <button
              onClick={resetPipeline}
              className="bg-white/10 hover:bg-white/20 px-7 py-4 rounded-xl font-semibold transition-all text-sm whitespace-nowrap border border-white/10"
            >
              New Pipeline
            </button>
          ) : (
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
          )}
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

                {isStarting ? (
                  <p className="text-gray-400 text-sm animate-pulse">{msg.message}</p>
                ) : msg.agent === "complete" ? (
                  <p className="text-gray-300 text-sm">{msg.message}</p>
                ) : (
                  <div className="prose prose-invert prose-sm max-w-none
                    prose-headings:text-white prose-headings:font-semibold prose-headings:mt-4 prose-headings:mb-2
                    prose-p:text-gray-300 prose-p:leading-relaxed prose-p:my-1
                    prose-strong:text-white
                    prose-ul:text-gray-300 prose-ul:my-2 prose-ul:pl-4
                    prose-ol:text-gray-300 prose-ol:my-2 prose-ol:pl-4
                    prose-li:text-gray-300 prose-li:my-0.5 prose-li:marker:text-gray-500
                    prose-code:text-emerald-300 prose-code:bg-black/40 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs
                    prose-pre:bg-black/60 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-lg prose-pre:my-3
                  ">
                    <ReactMarkdown>{msg.message}</ReactMarkdown>
                  </div>
                )}
              </div>
            );
          })}

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