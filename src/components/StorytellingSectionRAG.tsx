"use client";

import { useState, useEffect } from "react";

export default function StorytellingSectionRAG() {
  const [searchQuery, setSearchQuery] = useState("optimize concurrency in presence_sync.ts");
  const [activeVectorIndex, setActiveVectorIndex] = useState(0);

  const presetQueries = [
    { label: "presence_sync.ts", query: "optimize concurrency in presence_sync.ts" },
    { label: "auth.session", query: "validate JWT token in authSession.ts" },
    { label: "MicroVM", query: "execute Python sandbox in codeRunner.ts" },
  ];

  const matchedVectors = [
    {
      file: "src/lib/roomStorage.ts",
      symbol: "broadcastDelta()",
      similarity: "98.4%",
      dim: "1536-D Vector",
    },
    {
      file: "src/types/workspace.ts",
      symbol: "interface LiveCollaborator",
      similarity: "95.1%",
      dim: "1536-D Vector",
    },
    {
      file: "src/lib/codeRunner.ts",
      symbol: "executeInMicroVM()",
      similarity: "91.8%",
      dim: "1536-D Vector",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveVectorIndex((prev) => (prev + 1) % matchedVectors.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleSelectPreset = (q: string) => {
    setSearchQuery(q);
    setActiveVectorIndex(Math.floor(Math.random() * matchedVectors.length));
  };

  return (
    <section className="py-24 sm:py-32 px-4 max-w-6xl mx-auto relative z-10">
      
      {/* Asymmetric Grid: Left Interactive Vector Graph, Right Narrative */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
        
        {/* Left Column: Interactive Vector Graph Visual (7 cols) */}
        <div className="lg:col-span-7 order-2 lg:order-1">
          <div className="rounded-2xl border border-white/15 bg-[#050505]/95 backdrop-blur-2xl shadow-[0_20px_70px_rgba(0,0,0,0.8)] p-5 sm:p-6 space-y-4">
            
            {/* Search Query Bar */}
            <div className="p-3 rounded-xl bg-[#000000] border border-white/15 flex items-center justify-between gap-3 font-code text-xs">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="material-symbols-outlined text-[17px] text-[#A855F7]">search</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Type a natural language query..."
                  className="bg-transparent border-none text-white focus:outline-none w-full font-code text-xs"
                />
              </div>
              <span className="text-[10px] font-code px-2 py-0.5 rounded bg-[#A855F7]/10 text-[#A855F7] border border-[#A855F7]/25 shrink-0 font-semibold">
                pgvector 1536-D
              </span>
            </div>

            {/* Quick Query Preset Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-code text-neutral-500 mr-1">TRY QUERY:</span>
              {presetQueries.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectPreset(p.query)}
                  className={`text-[10px] font-code px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                    searchQuery === p.query
                      ? "bg-[#A855F7] text-white font-bold border-[#A855F7]"
                      : "bg-[#000000] text-neutral-400 border-white/10 hover:text-white"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Visual Vector Similarity Matching Cards */}
            <div className="space-y-2.5">
              {matchedVectors.map((vec, idx) => {
                const isActive = idx === activeVectorIndex;
                return (
                  <div
                    key={idx}
                    onClick={() => setActiveVectorIndex(idx)}
                    className={`p-3.5 rounded-xl border transition-all duration-300 cursor-pointer ${
                      isActive
                        ? "bg-[#A855F7]/10 border-[#A855F7]/40 shadow-[0_0_20px_rgba(168,85,247,0.15)]"
                        : "bg-[#0a0a0a] border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5 font-code text-xs">
                      <div className="flex items-center gap-2 font-semibold text-white">
                        <span className="w-2 h-2 rounded-full bg-[#A855F7]" />
                        <span>{vec.file}</span>
                      </div>
                      <span className="text-[11px] font-bold text-[#A855F7]">
                        {vec.similarity} Cosine Match
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-neutral-400 font-code">
                      <span>Symbol: {vec.symbol}</span>
                      <span className="text-neutral-400">{vec.dim}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* AST Graph Telemetry */}
            <div className="p-3 rounded-xl bg-[#000000] border border-white/10 flex items-center justify-between text-xs font-code text-neutral-400">
              <span className="flex items-center gap-1.5 text-[#10B981]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
                Whole-Repository AST Index Synced
              </span>
              <span className="text-white font-bold">1536 Embeddings</span>
            </div>
          </div>
        </div>

        {/* Right Column: Narrative (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#A855F7]/10 border border-[#A855F7]/25 text-xs font-code text-[#A855F7] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A855F7] animate-ping" />
            <span>02 / REPOSITORY MEMORY</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.12]">
            pgvector RAG memory.{" "}
            <span className="font-serif-editorial italic font-normal text-white">
              Zero hallucinated types.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-neutral-400 leading-relaxed font-body">
            CodeMesh tokenizes your entire repository into a high-dimensional vector space. When asking Gemini for refactors, it references your custom types and internal APIs with 100% architectural fidelity.
          </p>

          <div className="space-y-3 pt-2 font-body text-xs sm:text-sm">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-[#0a0a0a] border border-white/10 hover:border-[#A855F7]/30 transition-colors">
              <span className="material-symbols-outlined text-[#A855F7] text-[18px] mt-0.5">
                psychology
              </span>
              <div>
                <div className="font-semibold text-white">Hierarchical AST Parsing</div>
                <div className="text-neutral-500 text-xs font-code">
                  Extracts exported interfaces, function signatures, and cross-file imports.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-[#0a0a0a] border border-white/10 hover:border-[#A855F7]/30 transition-colors">
              <span className="material-symbols-outlined text-[#A855F7] text-[18px] mt-0.5">
                travel_explore
              </span>
              <div>
                <div className="font-semibold text-white">Semantic Cosine Search</div>
                <div className="text-neutral-500 text-xs font-code">
                  Finds relevant code snippets based on logical intent, not just raw text matches.
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
