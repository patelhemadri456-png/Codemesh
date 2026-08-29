"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Hero3DCanvas from "./Hero3DCanvas";
import { executeCodeInBrowser } from "@/lib/codeRunner";
import confetti from "canvas-confetti";

interface FramerExactHeroProps {
  onOpenDemo: () => void;
  onOpenBrief: () => void;
}

export default function FramerExactHero({ onOpenDemo, onOpenBrief }: FramerExactHeroProps) {
  const [promptText, setPromptText] = useState(
    "Build real-time pair programming workspace with OT sync & pgvector RAG memory"
  );
  const [activeCode, setActiveCode] = useState(
`// CodeMesh Real-Time Canvas Kernel
export function broadcastPresence(collab: Collaborator): void {
  const delta = OT.reconcile(collab.cursor, collab.fileId);
  console.log(\`[Mesh] Synced cursor delta for @\${collab.handle} in 4.2ms\`);
}

broadcastPresence({ handle: "elena_ts", cursor: { line: 8, col: 14 }, fileId: "presence.ts" });`
  );
  const [isRunning, setIsRunning] = useState(false);
  const [consoleLog, setConsoleLog] = useState<string>("[Mesh Engine] Live AST canvas active. Sub-10ms latency.");
  const [selectedLayer, setSelectedLayer] = useState("presence.ts");

  // 3D Tilt state on Canvas Frame
  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasTilt, setCanvasTilt] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -3.5;
    const rotY = ((x - centerX) / centerX) * 3.5;

    setCanvasTilt(`perspective(1200px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.01, 1.01, 1.01)`);
  };

  const handleCanvasMouseLeave = () => {
    setIsHovered(false);
    setCanvasTilt("perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setTimeout(() => {
      const res = executeCodeInBrowser("presence.ts", activeCode);
      setConsoleLog(res.logs.join(" ") || `[Success] Process executed in ${res.durationMs}ms with 0 lock contention`);
      setIsRunning(false);
      confetti({ particleCount: 45, spread: 55, origin: { y: 0.7 }, colors: ["#0066FF", "#8B5CF6", "#ffffff"] });
    }, 240);
  };

  const handleLaunchConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 75,
      origin: { y: 0.65 },
      colors: ["#ffffff", "#0066FF", "#8B5CF6", "#FF7E33"],
    });
  };

  return (
    <section className="relative pt-32 sm:pt-40 pb-24 px-4 max-w-7xl mx-auto z-10 flex flex-col items-center text-center overflow-hidden">
      
      {/* 3D WebGL Orbital Canvas */}
      <Hero3DCanvas />

      {/* Selective Color: AI Prompt Pill with Purple/Blue Spark */}
      <div className="w-full max-w-xl mx-auto mb-10 relative z-10">
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#0a0a0a]/90 border border-white/15 shadow-[0_8px_30px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.15)] backdrop-blur-2xl hover:border-[#8B5CF6]/50 transition-all group">
          <span className="material-symbols-outlined text-[17px] text-[#A855F7] animate-pulse">
            auto_awesome
          </span>
          <input
            type="text"
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            className="w-full bg-transparent border-none text-xs font-body text-white focus:outline-none placeholder-neutral-500"
          />
          <button
            onClick={onOpenBrief}
            className="px-3.5 py-1 rounded-full bg-white text-black hover:bg-neutral-200 text-[11px] font-code font-semibold transition-colors shrink-0"
          >
            Generate →
          </button>
        </div>
      </div>

      {/* Main Headline with EB Garamond Editorial Italic Flourishes */}
      <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[84px] font-extrabold tracking-[-0.04em] text-white leading-[1.04] max-w-5xl mb-6 relative z-10">
        <span>Go from idea to launch with an agent that </span>
        <span className="font-serif-editorial italic font-normal text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.35)]">
          codes
        </span>{" "}
        <span>and </span>
        <span className="font-serif-editorial italic font-normal text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.35)]">
          executes
        </span>{" "}
        <span>on the canvas.</span>
      </h1>

      {/* Subtitle */}
      <p className="text-base sm:text-lg md:text-xl text-neutral-400 max-w-3xl mx-auto leading-relaxed mb-10 font-body relative z-10">
        Keep each change fully editable in real time, with multi-cursor OT synchronization, 
        whole-repository vector RAG memory, and isolated MicroVM runtimes built in.
      </p>

      {/* Framer CTAs */}
      <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto mb-16 relative z-10">
        <Link
          href="/workspaces"
          onClick={handleLaunchConfetti}
          className="relative group overflow-hidden w-full sm:w-auto px-8 py-3.5 rounded-full font-body font-bold text-sm text-black bg-white hover:bg-neutral-200 shadow-[0_0_30px_rgba(255,255,255,0.25)] transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <span className="absolute top-0 left-[-100%] w-[60%] h-full bg-gradient-to-r from-transparent via-black/15 to-transparent skew-x-[-25deg] group-hover:left-[200%] transition-all duration-1000 ease-out" />
          <span className="tracking-wide">Start for free</span>
          <span className="text-xs font-bold">→</span>
        </Link>

        <button
          onClick={onOpenDemo}
          className="w-full sm:w-auto px-6 py-3.5 rounded-full font-body font-medium text-sm text-white bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/30 transition-all duration-200 flex items-center justify-center gap-2.5 shadow-sm group backdrop-blur-xl"
        >
          <div className="w-5 h-5 rounded-full bg-white/10 group-hover:bg-white/20 flex items-center justify-center transition-colors">
            <span className="material-symbols-outlined text-[13px] text-white group-hover:scale-110 transition-transform">
              play_arrow
            </span>
          </div>
          <span>Watch interactive demo</span>
        </button>
      </div>

      {/* 3D Tilt-Interactive Studio Canvas Stage */}
      <div
        ref={canvasRef}
        onMouseMove={handleCanvasMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleCanvasMouseLeave}
        style={{
          transform: canvasTilt,
          transition: isHovered ? "transform 0.1s ease-out" : "transform 0.5s ease-out",
        }}
        className="w-full max-w-6xl relative rounded-2xl border border-white/15 bg-[#050505]/95 backdrop-blur-2xl shadow-[0_30px_100px_rgba(0,0,0,0.95),0_0_50px_rgba(0,102,255,0.06)] overflow-hidden text-left relative z-10"
      >
        {/* Top Canvas Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-[#000000] select-none text-xs font-code text-neutral-400">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]/80" />
            </div>
            <span className="text-white font-semibold">CodeMesh Studio</span>
            <span className="px-2 py-0.5 rounded bg-white/10 text-white border border-white/15 text-[10px]">
              Canvas: 1280 × 720 • 100%
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span className="text-[#10B981] text-[11px] font-medium">OT Mesh Connected</span>
            </div>
            <button
              onClick={handleRunCode}
              disabled={isRunning}
              className="px-3.5 py-1 rounded-md bg-[#0066FF] text-white font-bold text-xs hover:bg-[#2563EB] transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50 shadow"
            >
              <span className="material-symbols-outlined text-[14px]">
                {isRunning ? "hourglass_empty" : "play_arrow"}
              </span>
              <span>{isRunning ? "Running..." : "Run Sandbox"}</span>
            </button>
          </div>
        </div>

        {/* 3-Column Studio Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[380px] bg-[#050505]">
          
          {/* Left Column: Layer Tree (3 cols) */}
          <div className="hidden lg:block lg:col-span-3 border-r border-white/10 p-3.5 bg-[#000000] font-code text-xs">
            <div className="text-[10px] uppercase tracking-wider text-neutral-500 mb-2 font-bold">
              LAYERS & FILES
            </div>
            <div className="space-y-1">
              {[
                { name: "presence.ts", icon: "code", badge: "Active", accent: "text-[#0066FF]" },
                { name: "crdt_kernel.rs", icon: "hub", badge: "CRDT", accent: "text-[#A855F7]" },
                { name: "rag_indexer.py", icon: "memory", badge: "RAG", accent: "text-[#FF7E33]" },
                { name: "microvm.json", icon: "settings", badge: "VM", accent: "text-neutral-400" },
              ].map((layer) => (
                <div
                  key={layer.name}
                  onClick={() => setSelectedLayer(layer.name)}
                  className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                    selectedLayer === layer.name
                      ? "bg-white/10 text-white font-semibold border border-white/20"
                      : "text-neutral-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <span className={`material-symbols-outlined text-[14px] ${layer.accent}`}>
                      {layer.icon}
                    </span>
                    <span className="truncate">{layer.name}</span>
                  </div>
                  <span className="text-[9px] px-1 rounded bg-white/10 text-neutral-400">
                    {layer.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Center Column: Framer Electric Blue Selection Frame & Multi-Cursor Overlay (6 cols) */}
          <div className="lg:col-span-6 p-4 sm:p-5 font-code text-xs sm:text-sm text-neutral-200 leading-relaxed relative bg-[#000000] min-h-[260px] framer-dot-grid overflow-hidden">
            
            {/* Framer Iconic Electric Blue Selection Frame */}
            <div className="absolute inset-3 border border-[#0066FF] rounded-xl pointer-events-none shadow-[0_0_20px_rgba(0,102,255,0.2)]">
              <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-[#0066FF] border border-white rounded-sm" />
              <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-[#0066FF] border border-white rounded-sm" />
              <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-[#0066FF] border border-white rounded-sm" />
              <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-[#0066FF] border border-white rounded-sm" />
              <div className="absolute -top-3 left-6 px-1.5 py-0.5 rounded bg-[#0066FF] text-white text-[9px] font-bold font-code shadow">
                {selectedLayer} • 960 × 480
              </div>
            </div>

            {/* Multi-Cursor Tag for Elena (Electric Blue) */}
            <div className="absolute top-[52px] left-[260px] hidden sm:flex items-center gap-1 z-20 pointer-events-none">
              <div className="w-0.5 h-4 bg-[#0066FF] animate-pulse" />
              <div className="px-1.5 py-0.5 rounded bg-[#0066FF] text-white text-[9px] font-bold shadow-md">
                Elena Rostova
              </div>
            </div>

            {/* Multi-Cursor Tag for Marcus (Amber) */}
            <div className="absolute top-[125px] left-[220px] hidden sm:flex items-center gap-1 z-20 pointer-events-none">
              <div className="w-0.5 h-4 bg-[#FF7E33] animate-pulse" />
              <div className="px-1.5 py-0.5 rounded bg-[#FF7E33] text-black text-[9px] font-bold shadow-md">
                Marcus Chen
              </div>
            </div>

            {/* Editable Code */}
            <textarea
              value={activeCode}
              onChange={(e) => setActiveCode(e.target.value)}
              className="w-full h-full min-h-[190px] bg-transparent resize-none focus:outline-none font-code text-xs sm:text-sm text-neutral-200 leading-6 selection:bg-[#0066FF]/30 border-none pt-4"
              spellCheck={false}
            />
          </div>

          {/* Right Column: Framer Studio Inspector Panel (3 cols) */}
          <div className="hidden lg:block lg:col-span-3 border-l border-white/10 p-3.5 bg-[#000000] font-code text-xs space-y-3">
            <div className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold">
              INSPECTOR & TELEMETRY
            </div>

            <div className="p-2 rounded-lg bg-[#0a0a0a] border border-white/10 space-y-1.5 text-[11px]">
              <div className="flex justify-between text-neutral-400">
                <span>Dimensions:</span>
                <span className="text-white font-bold">960 × 480</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>P99 OT Sync:</span>
                <span className="text-[#10B981] font-bold">4.2ms</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>pgvector Index:</span>
                <span className="text-[#A855F7] font-semibold">1536-D</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>MicroVM State:</span>
                <span className="text-[#FF7E33] font-semibold">Ready</span>
              </div>
            </div>

            <div className="p-2 rounded-lg bg-[#000000] border border-white/10 text-[10px] text-neutral-400 leading-relaxed">
              <span className="text-[#0066FF] font-bold">Live Kernel: </span>
              {consoleLog}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
