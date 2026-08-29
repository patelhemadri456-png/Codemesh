"use client";

import { useState, useEffect } from "react";
import confetti from "canvas-confetti";

export default function StorytellingSectionAST() {
  const [typedCode, setTypedCode] = useState(
`// CodeMesh Real-time AST Delta Dispatcher
export function broadcastTransform(delta: ASTDelta): boolean {
  const vectorClock = syncClock(delta.roomId, delta.timestamp);
  return vectorClock.isDeterministic;
}`
  );
  const [streamLogs, setStreamLogs] = useState<string[]>([
    "[Peer 0x8F] broadcast cursor line: 4, col: 18 (Elena R.)",
    "[CRDT Kernel] Reconciled AST insert: 'syncClock' (0 conflicts)",
    "[WebRTC Mesh] P99 latency: 4.2ms to Frankfurt edge",
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const ms = (Math.random() * 2 + 3).toFixed(1);
      const peers = ["0x8F (Elena R.)", "0x2B (Marcus C.)", "0x7A (Sarah J.)"];
      const peer = peers[Math.floor(Math.random() * peers.length)];
      setStreamLogs((prev) => [
        `[Peer ${peer}] delta synced in ${ms}ms`,
        ...prev.slice(0, 4),
      ]);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const handleTestRun = () => {
    confetti({ particleCount: 35, spread: 45, origin: { y: 0.7 }, colors: ["#0066FF", "#A855F7", "#ffffff"] });
  };

  return (
    <section className="py-24 sm:py-32 px-4 max-w-6xl mx-auto relative z-10">
      
      {/* Asymmetric Grid: Left Narrative, Right Live Visual */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
        
        {/* Left Column: Narrative (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0066FF]/10 border border-[#0066FF]/25 text-xs font-code text-[#0066FF] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0066FF] animate-ping" />
            <span>01 / DISTRIBUTED STATE KERNEL</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.12]">
            Sub-10ms OT synchronization.{" "}
            <span className="font-serif-editorial italic font-normal text-white">
              Zero merge locks.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-neutral-400 leading-relaxed font-body">
            Traditional cloud IDEs stall on full-file locks and remote sync lags. CodeMesh decomposes source code into atomic AST delta streams, propagated through peer-to-peer WebRTC and edge WebSockets.
          </p>

          <div className="space-y-3 pt-2 font-body text-xs sm:text-sm">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-[#0a0a0a] border border-white/10 hover:border-[#0066FF]/30 transition-colors">
              <span className="material-symbols-outlined text-[#0066FF] text-[18px] mt-0.5">
                account_tree
              </span>
              <div>
                <div className="font-semibold text-white">Deterministic Vector Clocks</div>
                <div className="text-neutral-500 text-xs font-code">
                  Guarantees eventual consistency without centralized lock servers.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-[#0a0a0a] border border-white/10 hover:border-[#0066FF]/30 transition-colors">
              <span className="material-symbols-outlined text-[#0066FF] text-[18px] mt-0.5">
                bolt
              </span>
              <div>
                <div className="font-semibold text-white">Binary CBOR Serialization</div>
                <div className="text-neutral-500 text-xs font-code">
                  Under 120 bytes per keystroke for instant worldwide propagation.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Mockup & Stream Matrix (7 cols) */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-white/15 bg-[#050505]/95 backdrop-blur-2xl shadow-[0_20px_70px_rgba(0,0,0,0.8)] overflow-hidden">
            
            {/* Header */}
            <div className="px-4 py-3 border-b border-white/10 bg-[#000000] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/80"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/80"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]/80"></span>
                </div>
                <span className="text-xs font-code text-neutral-400">presence_dispatcher.ts</span>
              </div>

              {/* Collaborators */}
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1.5">
                  <div className="w-6 h-6 rounded-full bg-[#0066FF] text-white text-[9px] font-bold flex items-center justify-center border border-black shadow">
                    ER
                  </div>
                  <div className="w-6 h-6 rounded-full bg-[#FF7E33] text-black text-[9px] font-bold flex items-center justify-center border border-black shadow">
                    MC
                  </div>
                </div>
                <button
                  onClick={handleTestRun}
                  className="px-2.5 py-1 rounded bg-[#0066FF] text-white font-semibold text-[11px] font-code hover:bg-[#2563EB] transition-colors"
                >
                  Run Delta
                </button>
              </div>
            </div>

            {/* Code Body */}
            <div className="p-4 sm:p-5 font-code text-xs sm:text-sm text-neutral-200 leading-relaxed relative bg-[#000000] min-h-[170px]">
              <div className="absolute top-[36px] left-[280px] hidden sm:flex items-center gap-1 z-10 pointer-events-none">
                <div className="w-0.5 h-4 bg-[#0066FF] animate-pulse" />
                <span className="px-1.5 py-0.2 rounded bg-[#0066FF] text-white text-[9px] font-bold shadow">
                  Elena R.
                </span>
              </div>

              <div className="absolute top-[88px] left-[320px] hidden sm:flex items-center gap-1 z-10 pointer-events-none">
                <div className="w-0.5 h-4 bg-[#FF7E33] animate-pulse" />
                <span className="px-1.5 py-0.2 rounded bg-[#FF7E33] text-black text-[9px] font-bold shadow">
                  Marcus C.
                </span>
              </div>

              <pre className="overflow-x-auto text-neutral-300">
                <code>{typedCode}</code>
              </pre>
            </div>

            {/* Bottom Logs Bar */}
            <div className="p-3 bg-[#000000] border-t border-white/10 font-code text-[11px]">
              <div className="flex items-center justify-between text-neutral-400 mb-1.5">
                <span className="flex items-center gap-1.5 text-[#10B981]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
                  LIVE OT BROADCAST STREAM
                </span>
                <span className="text-[#10B981] font-semibold">32 Edge Nodes Active</span>
              </div>
              <div className="space-y-1 text-neutral-400">
                {streamLogs.map((log, idx) => (
                  <div key={idx} className="truncate">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
