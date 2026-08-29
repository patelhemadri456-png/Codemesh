"use client";

import { useState } from "react";

export default function FramerBentoGrid() {
  const [activeDevice, setActiveDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [selectedTag, setSelectedTag] = useState("Types");

  return (
    <section id="features" className="py-24 sm:py-32 px-4 max-w-6xl mx-auto z-10 relative">
      
      {/* Section Title */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-code uppercase tracking-widest text-white bg-white/5 border border-white/10 px-3.5 py-1 rounded-full">
          The Developer Canvas
        </span>
        <h2 className="text-3xl sm:text-5xl font-black tracking-[-0.035em] text-white mt-4 leading-tight">
          Everything you need to ship in{" "}
          <span className="font-serif-editorial italic font-normal text-white">
            real time.
          </span>
        </h2>
        <p className="text-sm sm:text-base text-neutral-400 mt-3">
          Explore the interactive primitives behind zero-conflict collaboration and whole-repository AI context.
        </p>
      </div>

      {/* Selective Framer Color Bento Grid (4 Interactive Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Bento 1: Interactive Multi-Cursor AST Canvas (Spans 7 cols - Electric Blue Accent) */}
        <div className="md:col-span-7 rounded-3xl border border-white/15 bg-[#050505]/90 backdrop-blur-2xl p-6 sm:p-8 flex flex-col justify-between shadow-[0_20px_60px_rgba(0,0,0,0.7)] hover:border-[#0066FF]/40 transition-all group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-[#0066FF]/15 border border-[#0066FF]/30 flex items-center justify-center text-[#0066FF]">
                <span className="material-symbols-outlined text-[20px]">account_tree</span>
              </div>
              <span className="text-[10px] font-code px-2 py-0.5 rounded bg-[#0066FF]/10 text-[#0066FF] border border-[#0066FF]/20 font-semibold">
                Sub-10ms OT
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-2">
              Operational Transformation Engine
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-6 font-body">
              Every keystroke is broken down into deterministic CRDT delta vectors, synchronizing multi-user state with zero lock contention.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#000000] border border-white/10 font-code text-xs space-y-2">
            <div className="flex items-center justify-between text-neutral-400 pb-1 border-b border-white/10">
              <span>PEER VECTOR MESH</span>
              <span className="text-[#10B981] font-semibold">32 Clusters Synced</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-[11px] pt-1">
              <div className="p-2 rounded-lg bg-[#0a0a0a] border border-white/10 text-white">
                <div className="font-bold">Peer A</div>
                <div className="text-[9px] text-neutral-500">Clock: 1042</div>
              </div>
              <div className="p-2 rounded-lg bg-[#0066FF]/10 border border-[#0066FF]/30 text-[#0066FF]">
                <div className="font-bold">CRDT Root</div>
                <div className="text-[9px] text-neutral-300">Reconciled</div>
              </div>
              <div className="p-2 rounded-lg bg-[#0a0a0a] border border-white/10 text-white">
                <div className="font-bold">Peer B</div>
                <div className="text-[9px] text-neutral-500">Clock: 1042</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bento 2: Interactive Viewport Breakpoint Switcher (Spans 5 cols - Amber Accent) */}
        <div className="md:col-span-5 rounded-3xl border border-white/15 bg-[#050505]/90 backdrop-blur-2xl p-6 sm:p-8 flex flex-col justify-between shadow-[0_20px_60px_rgba(0,0,0,0.7)] hover:border-[#FF7E33]/40 transition-all group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-[#FF7E33]/15 border border-[#FF7E33]/30 flex items-center justify-center text-[#FF7E33]">
                <span className="material-symbols-outlined text-[20px]">devices</span>
              </div>
              
              {/* Interactive Device Toggles */}
              <div className="flex items-center gap-1 bg-[#000000] p-1 rounded-lg border border-white/10">
                {(["desktop", "tablet", "mobile"] as const).map((dev) => (
                  <button
                    key={dev}
                    onClick={() => setActiveDevice(dev)}
                    className={`px-2 py-0.5 rounded text-[10px] font-code uppercase transition-all ${
                      activeDevice === dev
                        ? "bg-[#FF7E33] text-black font-bold"
                        : "text-neutral-500 hover:text-white"
                    }`}
                  >
                    {dev === "desktop" ? "1920" : dev === "tablet" ? "768" : "375"}
                  </button>
                ))}
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-2">
              Responsive Canvas Preview
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-6 font-body">
              Simulate edge container rendering across viewport resolutions in real time.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#000000] border border-white/10 text-center font-code text-xs text-neutral-300">
            <div className="text-[10px] text-neutral-500 mb-1">CURRENT SIMULATION:</div>
            <div className="text-sm font-bold text-[#FF7E33] uppercase">
              {activeDevice === "desktop" ? "Desktop (1920 x 1080) • 60 FPS" : activeDevice === "tablet" ? "Tablet (768 x 1024) • 60 FPS" : "Mobile (375 x 812) • 60 FPS"}
            </div>
          </div>
        </div>

        {/* Bento 3: pgvector 1536-D Semantic RAG Graph (Spans 5 cols - Purple Accent) */}
        <div className="md:col-span-5 rounded-3xl border border-white/15 bg-[#050505]/90 backdrop-blur-2xl p-6 sm:p-8 flex flex-col justify-between shadow-[0_20px_60px_rgba(0,0,0,0.7)] hover:border-[#A855F7]/40 transition-all group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-[#A855F7]/15 border border-[#A855F7]/30 flex items-center justify-center text-[#A855F7]">
                <span className="material-symbols-outlined text-[20px]">memory</span>
              </div>
              <span className="text-[10px] font-code px-2 py-0.5 rounded bg-[#A855F7]/10 text-[#A855F7] border border-[#A855F7]/20 font-semibold">
                1536-D Graph
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-2">
              Deep pgvector RAG Index
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-6 font-body">
              Hierarchical tokenization across all repository files for zero-hallucination code suggestions.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {["Types", "Functions", "APIs", "Modules"].map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1 rounded-xl text-xs font-code transition-all ${
                  selectedTag === tag
                    ? "bg-[#A855F7] text-white font-bold shadow-sm"
                    : "bg-[#000000] text-neutral-400 border border-white/10 hover:text-white"
                }`}
              >
                {tag} (Indexed)
              </button>
            ))}
          </div>
        </div>

        {/* Bento 4: MicroVM Instant Runtime Gauge (Spans 7 cols - Emerald Accent) */}
        <div className="md:col-span-7 rounded-3xl border border-white/15 bg-[#050505]/90 backdrop-blur-2xl p-6 sm:p-8 flex flex-col justify-between shadow-[0_20px_60px_rgba(0,0,0,0.7)] hover:border-[#10B981]/40 transition-all group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#10B981]">
                <span className="material-symbols-outlined text-[20px]">bolt</span>
              </div>
              <span className="text-[10px] font-code px-2 py-0.5 rounded bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 font-semibold">
                &lt; 150ms Boot
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-2">
              Isolated MicroVM Compute
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-6 font-body">
              Execute Python, TypeScript, and Rust with native hardware speed in ephemeral Firecracker sandboxes.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#000000] border border-white/10 flex items-center justify-between font-code text-xs text-neutral-300">
            <div className="flex items-center gap-2 text-[#10B981]">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span>Firecracker MicroVM Daemon Ready</span>
            </div>
            <span className="text-[#10B981] font-bold">124ms Telemetry</span>
          </div>
        </div>

      </div>
    </section>
  );
}
