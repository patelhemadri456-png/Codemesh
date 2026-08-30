"use client";

import { useState, useRef } from "react";
import Link from "next/link";

export default function FramerDesignScreens() {
  const [activeTab, setActiveTab] = useState<"canvas" | "ai" | "network" | "microvm">("canvas");
  const [cardTilt, setCardTilt] = useState("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Screen 2 AI Diff Toggle State
  const [aiDiffApplied, setAiDiffApplied] = useState(false);

  // Screen 3 Region Ping State
  const [activeRegion, setActiveRegion] = useState("fra1");
  const [regionLatency, setRegionLatency] = useState("4.2ms");

  // Screen 4 MicroVM Benchmark State
  const [microVmLogs, setMicroVmLogs] = useState<string[]>([
    "[Daemon] eBPF Sandbox Ready",
    "[Isolated Runtime] 0ms Memory Contention",
  ]);
  const [isBenchmarking, setIsBenchmarking] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotX = -((y - centerY) / centerY) * 3.5;
    const rotY = ((x - centerX) / centerX) * 3.5;

    setCardTilt(`perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.005, 1.005, 1.005)`);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCardTilt("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
  };

  const handleSelectRegion = (regionId: string, latency: string) => {
    setActiveRegion(regionId);
    setRegionLatency(latency);
  };

  const handleRunMicroVmBenchmark = () => {
    setIsBenchmarking(true);
    setMicroVmLogs((prev) => [...prev, "> Executing hardware container test..."]);
    setTimeout(() => {
      setMicroVmLogs((prev) => [
        ...prev,
        "✓ MicroVM hardware container booted in 118ms",
        "✓ 10,000 AST operations verified in 1.4ms",
      ]);
      setIsBenchmarking(false);
    }, 300);
  };

  return (
    <section id="screens" className="py-24 sm:py-32 px-4 max-w-7xl mx-auto z-10 relative">

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <span className="text-xs font-code uppercase tracking-widest text-white bg-white/5 border border-white/10 px-3.5 py-1 rounded-full flex items-center justify-center gap-1.5 w-fit mx-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0066FF] animate-ping" />
          <span>The Orbital Suite</span>
        </span>
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-[-0.04em] text-white mt-4 leading-tight">
          Everything on the canvas.{" "}
          <span className="font-serif-editorial italic font-normal text-white">
            Every detail editable.
          </span>
        </h2>
        <p className="text-sm sm:text-base text-neutral-400 mt-3">
          Explore the exact visual screens engineered for planetary-scale collaborative development.
        </p>
      </div>

      {/* Tab Switcher Bar with Selective Active Glow */}
      <div className="flex justify-center mb-12">
        <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-[#0a0a0a]/90 border border-white/15 shadow-lg backdrop-blur-2xl">
          {[
            { id: "canvas", label: "01. Infinite Canvas", icon: "grid_view", accent: "text-[#0066FF]" },
            { id: "ai", label: "02. AI Diff Inspector", icon: "auto_awesome", accent: "text-[#A855F7]" },
            { id: "network", label: "03. Planetary Mesh", icon: "public", accent: "text-[#10B981]" },
            { id: "microvm", label: "04. MicroVM Sandbox", icon: "terminal", accent: "text-[#FF7E33]" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 sm:px-5 py-2 rounded-full font-body text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                activeTab === tab.id
                  ? "bg-white text-black shadow-md scale-[1.02]"
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className={`material-symbols-outlined text-[16px] ${activeTab === tab.id ? "text-black" : tab.accent}`}>
                {tab.icon}
              </span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Screen Wrapper with 3D Mouse Tilt */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: cardTilt,
          transition: isHovered ? "transform 0.1s ease-out" : "transform 0.5s ease-out",
        }}
      >
        {/* Screen 1: Infinite Canvas Stage */}
        {activeTab === "canvas" && (
          <div className="rounded-3xl border border-white/15 bg-[#050505]/95 backdrop-blur-2xl p-6 sm:p-10 shadow-[0_30px_90px_rgba(0,0,0,0.85)] framer-dot-grid">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-4 text-left">
                <span className="text-xs font-code text-[#0066FF] uppercase tracking-wider font-semibold">
                  Interactive Multi-User Layout
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Direct spatial code manipulation with zero latency.
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-body">
                  Group functions, pin active code discussions, and inspect live collaborator cursors directly on an infinite developer canvas.
                </p>
                <div className="flex items-center gap-3 pt-2 font-code text-xs text-neutral-500">
                  <span className="flex items-center gap-1.5 text-[#10B981]">
                    <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                    P2P WebRTC Connected
                  </span>
                  <span>•</span>
                  <span>60 FPS Fluid Pan/Zoom</span>
                </div>
                <div className="pt-2">
                  <Link
                    href="/workspace/demo"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                  >
                    <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                    <span>Launch Live Canvas Studio</span>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-7 rounded-2xl border border-white/10 bg-[#000000] p-5 font-code text-xs relative overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-white/10 text-neutral-400">
                  <span>CANVAS VIEWPORT: 1920 × 1080</span>
                  <span className="text-[#0066FF] font-semibold">3 Users Online</span>
                </div>
                <div className="py-8 text-center space-y-3">
                  <div className="inline-block p-4 rounded-xl bg-[#0a0a0a] border border-[#0066FF]/40 shadow-[0_0_25px_rgba(0,102,255,0.15)]">
                    <div className="flex items-center gap-2 font-bold text-white mb-1">
                      <span className="material-symbols-outlined text-[16px] text-[#0066FF]">account_tree</span>
                      <span>OT_SyncKernel.ts</span>
                    </div>
                    <div className="text-[11px] text-neutral-400">
                      Vector Clock: 1042 • 0 Conflicts
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Screen 2: AI Code Generation & Live Diff Inspector */}
        {activeTab === "ai" && (
          <div className="rounded-3xl border border-white/15 bg-[#050505]/95 backdrop-blur-2xl p-6 sm:p-10 shadow-[0_30px_90px_rgba(0,0,0,0.85)]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-4 text-left">
                <span className="text-xs font-code text-[#A855F7] uppercase tracking-wider font-semibold">
                  Zero-Hallucination Patches
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Whole-repository pgvector RAG memory.
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-body">
                  Google Gemini scans your full 1536-dimensional AST embedding space, writing patches that seamlessly match your existing architecture.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setAiDiffApplied(!aiDiffApplied)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#A855F7]/20 border border-[#A855F7]/40 text-[#A855F7] hover:text-white hover:bg-[#A855F7]/30 font-code text-xs font-semibold transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                    <span>{aiDiffApplied ? "Revert to Original" : "Simulate AI Patch Diff"}</span>
                  </button>
                </div>
              </div>

              <div className="lg:col-span-7 rounded-2xl border border-white/10 bg-[#000000] p-4 sm:p-5 font-code text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-white/10 text-neutral-400">
                  <span className="flex items-center gap-1.5 text-white">
                    <span className="material-symbols-outlined text-[14px] text-[#A855F7]">code</span>
                    <span>VectorRAG_Refactor.ts</span>
                  </span>
                  <span className="text-[11px] text-[#10B981] font-bold">
                    {aiDiffApplied ? "+8 lines added • Accepted" : "Ready to Patch"}
                  </span>
                </div>
                <div className="py-3 space-y-1.5 text-neutral-300">
                  <div className="text-neutral-500">// Calculating vector cosine similarity</div>
                  <div>export async function getContextualNodes() &#123;</div>
                  {aiDiffApplied ? (
                    <div className="bg-[#10B981]/15 text-[#10B981] px-2 py-1 rounded border-l-2 border-[#10B981]">
                      + return await pgvector.query(embedding, &#123; similarity: 0.94 &#125;);
                    </div>
                  ) : (
                    <div className="bg-[#EF4444]/15 text-red-400 px-2 py-1 rounded border-l-2 border-red-500">
                      - return await memoryCache.find(embedding);
                    </div>
                  )}
                  <div>&#125;</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Screen 3: Planetary Mesh & Global Edge Network */}
        {activeTab === "network" && (
          <div className="rounded-3xl border border-white/15 bg-[#050505]/95 backdrop-blur-2xl p-6 sm:p-10 shadow-[0_30px_90px_rgba(0,0,0,0.85)]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-4 text-left">
                <span className="text-xs font-code text-[#10B981] uppercase tracking-wider font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
                  Planetary Mesh Relays
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Distributed state propagation across 32 global edge clusters.
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-body">
                  Collaborator nodes connect to orbital edge relays, synchronizing multi-user keystrokes at sub-frame speed across continents.
                </p>

                {/* Interactive Region Selectors */}
                <div className="pt-1">
                  <div className="text-[10px] font-code text-neutral-500 mb-2">SELECT EDGE CLUSTER:</div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: "fra1", label: "Frankfurt (fra1)", ping: "4.2ms" },
                      { id: "hnd1", label: "Tokyo (hnd1)", ping: "12.8ms" },
                      { id: "sfo1", label: "San Francisco (sfo1)", ping: "6.1ms" },
                      { id: "sin1", label: "Singapore (sin1)", ping: "8.4ms" },
                    ].map((reg) => (
                      <button
                        key={reg.id}
                        onClick={() => handleSelectRegion(reg.id, reg.ping)}
                        className={`px-3 py-1.5 rounded-xl font-code text-xs transition-all cursor-pointer ${
                          activeRegion === reg.id
                            ? "bg-[#10B981] text-black font-bold shadow"
                            : "bg-[#000000] border border-white/10 text-neutral-400 hover:text-white"
                        }`}
                      >
                        {reg.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 rounded-2xl border border-white/10 bg-[#000000] p-5 font-code text-xs space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-white/10 text-neutral-400">
                  <span>ACTIVE CLUSTER: {activeRegion.toUpperCase()}</span>
                  <span className="text-[#10B981] font-bold">{regionLatency} P99 Latency</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px] pt-1">
                  <div className="p-2.5 rounded-xl bg-[#0a0a0a] border border-white/10">
                    <div className="text-neutral-500 text-[10px]">THROUGHPUT</div>
                    <div className="font-bold text-white mt-1">120K ops/s</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#0a0a0a] border border-white/10">
                    <div className="text-neutral-500 text-[10px]">PACKET SIZE</div>
                    <div className="font-bold text-[#10B981] mt-1">&lt; 120 B</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#0a0a0a] border border-white/10">
                    <div className="text-neutral-500 text-[10px]">UPTIME</div>
                    <div className="font-bold text-white mt-1">99.99%</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#0a0a0a] border border-white/10">
                    <div className="text-neutral-500 text-[10px]">ENCRYPTION</div>
                    <div className="font-bold text-[#10B981] mt-1">TLS 1.3</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Screen 4: Ephemeral MicroVM Container Sandbox */}
        {activeTab === "microvm" && (
          <div className="rounded-3xl border border-white/15 bg-[#050505]/95 backdrop-blur-2xl p-6 sm:p-10 shadow-[0_30px_90px_rgba(0,0,0,0.85)]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-4 text-left">
                <span className="text-xs font-code text-[#FF7E33] uppercase tracking-wider font-semibold">
                  Hardware Virtualization
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Instant Firecracker container execution.
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-body">
                  No container cold starts. Boot secure, sandboxed Linux microVM instances in &lt; 150ms with instant hardware acceleration.
                </p>
                <div className="pt-2">
                  <button
                    onClick={handleRunMicroVmBenchmark}
                    disabled={isBenchmarking}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF7E33] text-black font-bold font-code text-xs hover:bg-[#ff9557] transition-all cursor-pointer disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                    <span>{isBenchmarking ? "Running Benchmark..." : "Run Container Benchmark"}</span>
                  </button>
                </div>
              </div>

              <div className="lg:col-span-7 rounded-2xl border border-white/10 bg-[#000000] p-4 sm:p-5 font-code text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-white/10 text-neutral-400">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#FF7E33] animate-pulse" />
                    <span>firecracker_daemon.sh</span>
                  </span>
                  <span className="text-[#FF7E33] font-bold">124ms Boot</span>
                </div>
                <div className="py-2 space-y-1 text-neutral-300 text-[11px]">
                  {microVmLogs.map((log, idx) => (
                    <div key={idx} className="truncate">
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
