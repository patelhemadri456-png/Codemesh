"use client";

import { useState, useRef } from "react";

export default function FramerDesignScreens() {
  const [activeTab, setActiveTab] = useState<"canvas" | "ai" | "network" | "microvm">("canvas");
  const [diffApplied, setDiffApplied] = useState(false);

  // 3D Card Tilt
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardTilt, setCardTilt] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -2.5;
    const rotY = ((x - centerX) / centerX) * 2.5;

    setCardTilt(`perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.005, 1.005, 1.005)`);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCardTilt("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
  };

  return (
    <section id="screens" className="py-24 sm:py-32 px-4 max-w-7xl mx-auto z-10 relative">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <span className="text-xs font-code uppercase tracking-widest text-white bg-white/5 border border-white/10 px-3.5 py-1 rounded-full">
          The Suite
        </span>
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-[-0.04em] text-white mt-4 leading-tight">
          Everything on the canvas.{" "}
          <span className="font-serif-editorial italic font-normal text-white">
            Every detail editable.
          </span>
        </h2>
        <p className="text-sm sm:text-base text-neutral-400 mt-3">
          Explore the exact visual screens engineered for high-performance pair programming.
        </p>
      </div>

      {/* Tab Switcher Bar with Selective Active Glow */}
      <div className="flex justify-center mb-12">
        <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-[#0a0a0a]/90 border border-white/15 shadow-lg backdrop-blur-2xl">
          {[
            { id: "canvas", label: "01. Infinite Canvas", icon: "grid_view", accent: "text-[#0066FF]" },
            { id: "ai", label: "02. AI Diff Inspector", icon: "auto_awesome", accent: "text-[#A855F7]" },
            { id: "network", label: "03. Edge Network", icon: "language", accent: "text-[#10B981]" },
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
                  Whole-Codebase AI Agent
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Generates, optimizes, and shows live AST diffs.
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-body">
                  The agent inspects custom types from your entire multi-file project and streams color-coded semantic diffs before applying any changes.
                </p>
                <button
                  onClick={() => setDiffApplied(!diffApplied)}
                  className="px-4 py-2 rounded-full bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-all cursor-pointer shadow"
                >
                  {diffApplied ? "Revert AI Patch" : "Apply Streamed Diff"}
                </button>
              </div>

              <div className="lg:col-span-7 rounded-2xl border border-white/10 bg-[#000000] p-5 font-code text-xs space-y-3">
                <div className="flex items-center justify-between text-neutral-400 pb-2 border-b border-white/10">
                  <span className="text-white font-semibold">DIFF INSPECTOR: presence.ts</span>
                  <span className="text-[#10B981] font-bold">+14 lines added</span>
                </div>
                <div className="bg-[#0a0a0a] p-3.5 rounded-xl border border-white/10 space-y-1 text-[11px] leading-relaxed">
                  <div className="text-neutral-500">  // Standard presence broadcast</div>
                  <div className="text-[#10B981] bg-[#10B981]/10 px-1.5 py-0.5 rounded border border-[#10B981]/20">
                    + export const streamChannel = createP2PMesh(&apos;Omega-Room&apos;);
                  </div>
                  <div className="text-[#10B981] bg-[#10B981]/10 px-1.5 py-0.5 rounded border border-[#10B981]/20">
                    + OT.reconcileDeltas(streamChannel.getVectorClocks());
                  </div>
                  <div className="text-neutral-500">  return true;</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Screen 3: Global Edge Network */}
        {activeTab === "network" && (
          <div className="rounded-3xl border border-white/15 bg-[#050505]/95 backdrop-blur-2xl p-6 sm:p-10 shadow-[0_30px_90px_rgba(0,0,0,0.85)]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-4 text-left">
                <span className="text-xs font-code text-[#10B981] uppercase tracking-wider font-semibold">
                  Multi-Region Edge Clusters
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Distributed state propagation across 32 worldwide edge clusters.
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-body">
                  Peer nodes automatically connect to the lowest latency relay, ensuring instantaneous multi-cursor updates regardless of geographical distance.
                </p>
              </div>

              <div className="lg:col-span-7 grid grid-cols-2 gap-3 font-code text-xs">
                {[
                  { region: "Frankfurt (fra1)", latency: "4.2ms", status: "Optimal", color: "text-[#10B981]" },
                  { region: "San Francisco (sfo1)", latency: "6.1ms", status: "Optimal", color: "text-[#10B981]" },
                  { region: "Tokyo (nrt1)", latency: "10.8ms", status: "Active", color: "text-[#0066FF]" },
                  { region: "Singapore (sin1)", latency: "13.4ms", status: "Active", color: "text-[#0066FF]" },
                ].map((loc) => (
                  <div key={loc.region} className="p-4 rounded-xl bg-[#000000] border border-white/10 space-y-1 hover:border-white/20 transition-colors">
                    <div className="text-white font-bold">{loc.region}</div>
                    <div className={`font-extrabold text-sm ${loc.color}`}>{loc.latency} P99</div>
                    <div className="text-[10px] text-neutral-500">{loc.status}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Screen 4: MicroVM Ephemeral Compute */}
        {activeTab === "microvm" && (
          <div className="rounded-3xl border border-white/15 bg-[#050505]/95 backdrop-blur-2xl p-6 sm:p-10 shadow-[0_30px_90px_rgba(0,0,0,0.85)]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-4 text-left">
                <span className="text-xs font-code text-[#FF7E33] uppercase tracking-wider font-semibold">
                  Instant Cloud Compute
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Ephemeral Firecracker MicroVM containers ready in &lt; 150ms.
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-body">
                  Run server-side Python, Node.js, and Rust applications directly from your browser with hardened eBPF isolation.
                </p>
              </div>

              <div className="lg:col-span-7 p-4 rounded-2xl bg-[#000000] border border-white/10 font-code text-xs space-y-2">
                <div className="flex justify-between text-neutral-400 pb-1 border-b border-white/10">
                  <span>MICROVM TELEMETRY</span>
                  <span className="text-[#10B981] font-bold">Boot: 124ms</span>
                </div>
                <div className="space-y-1 text-[11px] text-neutral-300 pt-2">
                  <div>[Kernel] Firecracker v1.7.0 virtual CPU allocated (4 Cores)</div>
                  <div>[Memory] 8192MB shared pool assigned to room</div>
                  <div className="text-[#FF7E33] font-semibold">&gt; Ready for zero-delay compilation and execution.</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

    </section>
  );
}
