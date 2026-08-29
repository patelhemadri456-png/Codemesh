"use client";

import { useState } from "react";
import { executeCodeInBrowser } from "@/lib/codeRunner";
import confetti from "canvas-confetti";

export default function StorytellingSectionMicroVM() {
  const [activeCode, setActiveCode] = useState(
`# High-Throughput MicroVM Benchmark
import multiprocessing

def compute_ast_hash(payload: str) -> str:
    print(f"[MicroVM Core] Worker executed payload in 0.8ms")
    return "0x7F9A_OK"

if __name__ == "__main__":
    result = compute_ast_hash("AST_VECTOR_BLOCK_42")
    print(f"Status: {result}")`
  );
  const [outputLogs, setOutputLogs] = useState<string[]>([
    "[Container 0x4B] Firecracker MicroVM booted in 124ms",
    "[Isolated Sandbox] Network namespace isolated (eBPF locked)",
    "Ready for high-throughput execution.",
  ]);
  const [isExecuting, setIsExecuting] = useState(false);

  const handleRun = () => {
    setIsExecuting(true);
    setOutputLogs((prev) => [...prev, "> Executing benchmark.py..."]);

    setTimeout(() => {
      const result = executeCodeInBrowser("benchmark.py", activeCode);
      setOutputLogs((prev) => [
        ...prev,
        ...result.logs,
        `✓ [Benchmark completed with 0ms memory contention in ${result.durationMs}ms]`,
      ]);
      setIsExecuting(false);
      confetti({ particleCount: 30, spread: 40, origin: { y: 0.75 } });
    }, 280);
  };

  return (
    <section className="py-24 sm:py-32 px-4 max-w-6xl mx-auto relative z-10">
      
      {/* Background Ambient Violet Glow */}
      <div className="absolute top-1/2 -left-32 -translate-y-1/2 w-[450px] h-[450px] bg-[#8a2be2]/08 blur-[160px] rounded-full pointer-events-none -z-10" />

      {/* Asymmetric Alternating Grid: Left Narrative, Right Live Sandbox Visual */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
        
        {/* Left Column: Narrative (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1b2533] border border-[#2f4d70] text-xs font-code text-[#adc6ff]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#adc6ff] animate-ping" />
            <span>03 / MICROVM COMPUTE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#f4f2f0] tracking-tight leading-[1.12]">
            &lt; 150ms spin-up.{" "}
            <span className="bg-gradient-to-r from-[#adc6ff] to-[#ffb786] bg-clip-text text-transparent">
              Instant hardware execution.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-[#9b98ab] leading-relaxed font-body">
            Skip 15-minute Docker builds and local environment rot. CodeMesh provisions ephemeral Firecracker MicroVM containers instantly, giving every collaborator an isolated runtime with zero setup.
          </p>

          <div className="space-y-3 pt-2 font-body text-xs sm:text-sm">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-[#13121d] border border-[#262438] hover:border-[#4d486e] transition-colors">
              <span className="material-symbols-outlined text-[#adc6ff] text-[18px] mt-0.5">
                security
              </span>
              <div>
                <div className="font-semibold text-[#e5e2e1]">eBPF Sandboxed Isolation</div>
                <div className="text-[#7e7b90] text-xs font-code">
                  Hardened virtualization boundary prevents cross-room memory leakage.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-[#13121d] border border-[#262438] hover:border-[#4d486e] transition-colors">
              <span className="material-symbols-outlined text-[#ffb786] text-[18px] mt-0.5">
                speed
              </span>
              <div>
                <div className="font-semibold text-[#e5e2e1]">Zero-Cold-Start Cache</div>
                <div className="text-[#7e7b90] text-xs font-code">
                  Pre-warmed compiler daemon ready to execute in sub-millisecond bursts.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Live Sandbox Terminal (7 cols) */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-[#2f2d42] bg-[#0e0d16]/95 backdrop-blur-2xl shadow-[0_20px_70px_rgba(0,0,0,0.8)] overflow-hidden">
            
            {/* Window Header */}
            <div className="px-4 py-3 border-b border-[#212030] bg-[#0a0910] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]/70"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]/70"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]/70"></span>
                </div>
                <span className="text-xs font-code text-[#8e8a9f]">microvm_runner.py</span>
              </div>

              <button
                onClick={handleRun}
                disabled={isExecuting}
                className="px-3 py-1 rounded bg-gradient-to-r from-[#adc6ff] to-[#ffb786] text-[#0a0a0f] text-xs font-code font-bold hover:shadow-[0_0_15px_rgba(173,198,255,0.4)] transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[14px]">
                  {isExecuting ? "hourglass_empty" : "play_arrow"}
                </span>
                <span>{isExecuting ? "Executing..." : "Run MicroVM"}</span>
              </button>
            </div>

            {/* Editable Sandbox Code Area */}
            <div className="p-4 bg-[#08070d] font-code text-xs text-[#d4d1e2] leading-relaxed">
              <textarea
                value={activeCode}
                onChange={(e) => setActiveCode(e.target.value)}
                className="w-full h-32 bg-transparent resize-none focus:outline-none font-code text-xs text-[#c2bed4] border-none"
                spellCheck={false}
              />
            </div>

            {/* MicroVM Output Console */}
            <div className="p-3.5 bg-[#050508] border-t border-[#1e1c2b] font-code text-[11px] space-y-1">
              <div className="flex items-center justify-between text-[#68657d] mb-1">
                <span className="flex items-center gap-1.5 text-[#adc6ff]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#adc6ff] animate-pulse"></span>
                  EPHEMERAL CONTAINER LOGS
                </span>
                <span className="text-green-400">124ms Boot Time</span>
              </div>
              <div className="space-y-1 text-[#938fa6] max-h-24 overflow-y-auto">
                {outputLogs.map((log, idx) => (
                  <div key={idx} className="leading-tight">
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
