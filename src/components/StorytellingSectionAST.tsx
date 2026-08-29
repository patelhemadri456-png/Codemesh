"use client";

import { useState, useEffect } from "react";
import { executeCodeInBrowser } from "@/lib/codeRunner";
import confetti from "canvas-confetti";

export default function StorytellingSectionAST() {
  const [typedCode, setTypedCode] = useState(
`// CodeMesh Real-time AST Delta Dispatcher
export function broadcastTransform(delta: ASTDelta): boolean {
  const vectorClock = syncClock(delta.roomId, delta.timestamp);
  return vectorClock.isDeterministic;
}`
  );
  const [activeTab, setActiveTab] = useState<"stream" | "matrix">("stream");
  const [streamLogs, setStreamLogs] = useState<string[]>([
    "[Peer 0x8F] broadcast cursor line: 4, col: 18 (Elena R.)",
    "[CRDT Kernel] Reconciled AST insert: 'syncClock' (0 conflicts)",
    "[WebRTC Mesh] P99 latency: 6.2ms to Frankfurt edge",
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const ms = (Math.random() * 4 + 4).toFixed(1);
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
    confetti({ particleCount: 35, spread: 45, origin: { y: 0.7 } });
  };

  return (
    <section className="py-24 sm:py-32 px-4 max-w-6xl mx-auto relative z-10">
      
      {/* Dynamic Background Glow */}
      <div className="absolute top-1/2 -left-32 -translate-y-1/2 w-[450px] h-[450px] bg-[#8a2be2]/10 blur-[160px] rounded-full pointer-events-none -z-10" />

      {/* Asymmetric Alternating Grid: Left Narrative, Right Live Visual */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
        
        {/* Left Column: Narrative (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#201834] border border-[#523d85] text-xs font-code text-[#d0bcff]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d0bcff] animate-ping" />
            <span>01 / DISTRIBUTED STATE KERNEL</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#f4f2f0] tracking-tight leading-[1.12]">
            Sub-10ms OT synchronization.{" "}
            <span className="bg-gradient-to-r from-[#d0bcff] to-[#ffb786] bg-clip-text text-transparent">
              Zero merge locks.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-[#9b98ab] leading-relaxed font-body">
            Traditional cloud IDEs stall on full-file locks and remote sync lags. CodeMesh decomposes source code into atomic AST delta streams, propagated through peer-to-peer WebRTC and edge WebSockets.
          </p>

          {/* Technical Specs List */}
          <div className="space-y-3 pt-2 font-body text-xs sm:text-sm">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-[#13121d] border border-[#262438] hover:border-[#4d486e] transition-colors">
              <span className="material-symbols-outlined text-[#d0bcff] text-[18px] mt-0.5">
                account_tree
              </span>
              <div>
                <div className="font-semibold text-[#e5e2e1]">Deterministic Vector Clocks</div>
                <div className="text-[#7e7b90] text-xs font-code">
                  Guarantees eventual consistency without centralized lock servers.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-[#13121d] border border-[#262438] hover:border-[#4d486e] transition-colors">
              <span className="material-symbols-outlined text-[#ffb786] text-[18px] mt-0.5">
                bolt
              </span>
              <div>
                <div className="font-semibold text-[#e5e2e1]">Binary CBOR Serialization</div>
                <div className="text-[#7e7b90] text-xs font-code">
                  Under 120 bytes per keystroke for instant worldwide propagation.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Mockup & Stream Matrix (7 cols) */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-[#2f2d42] bg-[#0e0d16]/95 backdrop-blur-2xl shadow-[0_20px_70px_rgba(0,0,0,0.8)] overflow-hidden">
            
            {/* Mock Header */}
            <div className="px-4 py-3 border-b border-[#212030] bg-[#0a0910] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]/70"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]/70"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]/70"></span>
                </div>
                <span className="text-xs font-code text-[#8e8a9f]">presence_dispatcher.ts</span>
              </div>

              {/* Collaborators */}
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1.5">
                  <div className="w-6 h-6 rounded-full bg-[#d0bcff] text-[#0a0a0f] text-[9px] font-bold flex items-center justify-center border border-[#0a0910]">
                    ER
                  </div>
                  <div className="w-6 h-6 rounded-full bg-[#ffb786] text-[#0a0a0f] text-[9px] font-bold flex items-center justify-center border border-[#0a0910]">
                    MC
                  </div>
                </div>
                <button
                  onClick={handleTestRun}
                  className="px-2.5 py-1 rounded bg-[#201d33] hover:bg-[#312b4f] border border-[#3e3860] text-[11px] font-code text-[#d0bcff] transition-colors"
                >
                  Run Delta
                </button>
              </div>
            </div>

            {/* Code Body with Simulated Live Cursor */}
            <div className="p-4 sm:p-5 font-code text-xs sm:text-sm text-[#d4d1e2] leading-relaxed relative bg-[#09080e] min-h-[170px]">
              {/* Simulated Live Cursor for Elena */}
              <div className="absolute top-[36px] left-[280px] hidden sm:flex items-center gap-1 z-10 pointer-events-none">
                <div className="w-0.5 h-4 bg-[#d0bcff] animate-pulse" />
                <span className="px-1.5 py-0.2 rounded bg-[#d0bcff] text-[#0a0a0f] text-[9px] font-bold shadow">
                  Elena R.
                </span>
              </div>

              {/* Simulated Live Cursor for Marcus */}
              <div className="absolute top-[88px] left-[320px] hidden sm:flex items-center gap-1 z-10 pointer-events-none">
                <div className="w-0.5 h-4 bg-[#ffb786] animate-pulse" />
                <span className="px-1.5 py-0.2 rounded bg-[#ffb786] text-[#0a0a0f] text-[9px] font-bold shadow">
                  Marcus C.
                </span>
              </div>

              <pre className="overflow-x-auto text-[#c2bed4]">
                <code>{typedCode}</code>
              </pre>
            </div>

            {/* Bottom Stream Logs Bar */}
            <div className="p-3 bg-[#06050a] border-t border-[#1e1c2b] font-code text-[11px]">
              <div className="flex items-center justify-between text-[#68657d] mb-1.5">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                  LIVE OT BROADCAST STREAM
                </span>
                <span className="text-[#ffb786]">32 Edge Nodes Active</span>
              </div>
              <div className="space-y-1 text-[#938fa6]">
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
