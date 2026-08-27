"use client";

import { useState } from "react";

export default function SemanticSearchVisualizer() {
  const [activeQueryIndex, setActiveQueryIndex] = useState(0);

  const queries = [
    {
      query: "How is stream buffer allocated under high concurrency?",
      matchedFile: "src/utils.py",
      score: "0.962 cosine similarity",
      dimension: "1536-dim embedding",
      snippet: `def get_optimal_buffer() -> int:\n    # Auto-sized based on system CPU concurrency\n    return max(1024, multiprocessing.cpu_count() * 512)`,
    },
    {
      query: "Where are WebSocket presence heartbeats handled?",
      matchedFile: "src/index.ts",
      score: "0.941 cosine similarity",
      dimension: "1536-dim embedding",
      snippet: `export function broadcastPresence(presence: UserPresence): string {\n  supabase.realtime.broadcast({ event: 'presence:heartbeat', payload: presence });\n}`,
    },
    {
      query: "What is the token auth payload schema?",
      matchedFile: "src/config.json",
      score: "0.918 cosine similarity",
      dimension: "1536-dim embedding",
      snippet: `{\n  "workspace_id": "beta-omega-9",\n  "max_concurrency": 16,\n  "vector_dim": 1536\n}`,
    },
  ];

  const current = queries[activeQueryIndex];

  return (
    <div className="bg-[#111113] border border-white/10 rounded-xl p-5 flex flex-col justify-between h-full overflow-hidden">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#d0bcff]">
              psychology
            </span>
            <span className="font-code text-xs font-bold text-[#ededed] uppercase tracking-wider">
              pgvector 1536D RAG Index
            </span>
          </div>
          <span className="text-[10px] font-code text-[#d0bcff] bg-[#571bc1]/20 px-2 py-0.5 rounded border border-[#571bc1]/40">
            Cosine Distance Index
          </span>
        </div>

        {/* Query Pills */}
        <div className="space-y-1.5 mb-4">
          {queries.map((q, idx) => (
            <button
              key={idx}
              onClick={() => setActiveQueryIndex(idx)}
              className={`w-full p-2 rounded-lg text-left text-xs font-code transition-all flex items-center justify-between ${
                activeQueryIndex === idx
                  ? "bg-[#1e1e23] border border-[#d0bcff]/40 text-[#ededed]"
                  : "bg-[#17171a] border border-white/5 text-[#727685] hover:text-[#ededed]"
              }`}
            >
              <span className="truncate pr-2">&quot;{q.query}&quot;</span>
              <span className="text-[10px] text-[#d0bcff] shrink-0 font-semibold">{q.score.split(" ")[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Embedding Match Code Preview */}
      <div className="bg-[#080809] border border-white/10 rounded-lg p-3 font-code text-xs space-y-2">
        <div className="flex items-center justify-between text-[10px] text-[#727685] border-b border-white/5 pb-1">
          <span className="text-[#adc6ff]">{current.matchedFile}</span>
          <span className="text-[#d0bcff]">{current.dimension} &bull; {current.score}</span>
        </div>
        <pre className="text-[11px] text-[#ededed] overflow-x-auto whitespace-pre">
          <code>{current.snippet}</code>
        </pre>
      </div>
    </div>
  );
}
