"use client";

import { useState, useEffect } from "react";

export default function StorytellingSectionRAG() {
  const [searchQuery, setSearchQuery] = useState("optimize concurrency in presence_sync.ts");
  const [activeVectorIndex, setActiveVectorIndex] = useState(0);

  const matchedVectors = [
    {
      file: "src/lib/roomStorage.ts",
      symbol: "broadcastDelta()",
      similarity: "98.4%",
      dim: "1536-D Vector",
      highlight: true,
    },
    {
      file: "src/types/workspace.ts",
      symbol: "interface LiveCollaborator",
      similarity: "95.1%",
      dim: "1536-D Vector",
      highlight: false,
    },
    {
      file: "src/lib/codeRunner.ts",
      symbol: "executeInMicroVM()",
      similarity: "91.8%",
      dim: "1536-D Vector",
      highlight: false,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveVectorIndex((prev) => (prev + 1) % matchedVectors.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 sm:py-32 px-4 max-w-6xl mx-auto relative z-10">
      
      {/* Ambient Glow */}
      <div className="absolute top-1/2 -right-32 -translate-y-1/2 w-[450px] h-[450px] bg-[#ff8c42]/08 blur-[160px] rounded-full pointer-events-none -z-10" />

      {/* Asymmetric Alternating Grid: Left Interactive Vector Graph, Right Narrative */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
        
        {/* Left Column: Interactive Vector Graph Visual (7 cols) */}
        <div className="lg:col-span-7 order-2 lg:order-1">
          <div className="rounded-2xl border border-[#2f2d42] bg-[#0e0d16]/95 backdrop-blur-2xl shadow-[0_20px_70px_rgba(0,0,0,0.8)] p-5 sm:p-6 space-y-4">
            
            {/* Search Query Bar */}
            <div className="p-3 rounded-xl bg-[#141220] border border-[#3e3860] flex items-center justify-between gap-3 font-code text-xs">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="material-symbols-outlined text-[17px] text-[#ffb786]">search</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none text-[#e5e2e1] focus:outline-none w-full font-code text-xs"
                />
              </div>
              <span className="text-[10px] font-code px-2 py-0.5 rounded bg-[#2a1d3d] text-[#d0bcff] border border-[#52387a] shrink-0">
                pgvector 1536-D
              </span>
            </div>

            {/* Visual Vector Similarity Matching Cards */}
            <div className="space-y-2.5">
              {matchedVectors.map((vec, idx) => {
                const isActive = idx === activeVectorIndex;
                return (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border transition-all duration-300 ${
                      isActive
                        ? "bg-[#1d1730] border-[#8a2be2]/60 shadow-[0_0_20px_rgba(138,43,226,0.15)]"
                        : "bg-[#11101a] border-[#222030] hover:border-[#38344f]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5 font-code text-xs">
                      <div className="flex items-center gap-2 font-semibold text-[#e5e2e1]">
                        <span className="w-2 h-2 rounded-full bg-[#d0bcff]" />
                        <span>{vec.file}</span>
                      </div>
                      <span className="text-[11px] font-bold text-[#ffb786]">
                        {vec.similarity} Cosine Match
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#7f7c94] font-code">
                      <span>Symbol: {vec.symbol}</span>
                      <span className="text-[#a5a2b8]">{vec.dim}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* AST Graph Telemetry */}
            <div className="p-3 rounded-xl bg-[#08070d] border border-[#1d1b2b] flex items-center justify-between text-xs font-code text-[#737085]">
              <span className="flex items-center gap-1.5 text-green-400">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                Whole-Repository AST Index Synced
              </span>
              <span>Sub-4ms Semantic Query</span>
            </div>
          </div>
        </div>

        {/* Right Column: Narrative (5 cols) */}
        <div className="lg:col-span-5 space-y-6 order-1 lg:order-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2a1a14] border border-[#6b3c22] text-xs font-code text-[#ffb786]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ffb786] animate-ping" />
            <span>02 / REPOSITORY MEMORY</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#f4f2f0] tracking-tight leading-[1.12]">
            pgvector RAG.{" "}
            <span className="bg-gradient-to-r from-[#ffb786] to-[#d0bcff] bg-clip-text text-transparent">
              Zero hallucinated context.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-[#9b98ab] leading-relaxed font-body">
            CodeMesh indexes your entire codebase into a 1536-dimensional vector embedding lattice in real time. AI code suggestions understand your custom types, interfaces, and architecture without pasting files.
          </p>

          <div className="space-y-3 pt-2 font-body text-xs sm:text-sm">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-[#13121d] border border-[#262438] hover:border-[#4d486e] transition-colors">
              <span className="material-symbols-outlined text-[#ffb786] text-[18px] mt-0.5">
                memory
              </span>
              <div>
                <div className="font-semibold text-[#e5e2e1]">Deep Semantic Tokenization</div>
                <div className="text-[#7e7b90] text-xs font-code">
                  Hierarchical AST node parsing for 100K+ symbols per room.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-[#13121d] border border-[#262438] hover:border-[#4d486e] transition-colors">
              <span className="material-symbols-outlined text-[#d0bcff] text-[18px] mt-0.5">
                hub
              </span>
              <div>
                <div className="font-semibold text-[#e5e2e1]">Multi-File Graph Traversal</div>
                <div className="text-[#7e7b90] text-xs font-code">
                  Traces call-sites and imported types across your entire repository.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
