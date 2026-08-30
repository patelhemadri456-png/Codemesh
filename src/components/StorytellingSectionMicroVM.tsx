"use client";

import { useState } from "react";
import { executeCodeInBrowser } from "@/lib/codeRunner";

export default function StorytellingSectionMicroVM() {
  const [activeLang, setActiveLang] = useState<"python" | "typescript" | "rust">("python");

  const codeSnippets: Record<"python" | "typescript" | "rust", { fileName: string; code: string }> = {
    python: {
      fileName: "benchmark.py",
      code: `# High-Throughput MicroVM Benchmark
import multiprocessing

def compute_ast_hash(payload: str) -> str:
    print(f"[MicroVM Core] Worker executed payload in 0.8ms")
    return "0x7F9A_OK"

if __name__ == "__main__":
    result = compute_ast_hash("AST_VECTOR_BLOCK_42")
    print(f"Status: {result}")`,
    },
    typescript: {
      fileName: "microvm_stream.ts",
      code: `// High-Performance TypeScript Stream
interface StreamEvent { id: string; payload: Uint8Array; }

export function processBatch(events: StreamEvent[]): number {
  console.log(\`[MicroVM Engine] Processing \${events.length} batch deltas\`);
  return events.length;
}

processBatch([{ id: "evt_1", payload: new Uint8Array([1, 2, 3]) }]);`,
    },
    rust: {
      fileName: "memory_guard.rs",
      code: `// Hardware Memory Guard
fn main() {
    println!("[eBPF Virtualization] Hardware memory fence active");
    println!("Zero cold-start compiler latency: 0.2ms");
}`,
    },
  };

  const [outputLogs, setOutputLogs] = useState<string[]>([
    "[Container 0x4B] Firecracker MicroVM booted in 124ms",
    "[Isolated Sandbox] Network namespace isolated (eBPF locked)",
    "Ready for high-throughput execution.",
  ]);
  const [isExecuting, setIsExecuting] = useState(false);

  const handleRun = () => {
    setIsExecuting(true);
    const snippet = codeSnippets[activeLang];
    setOutputLogs((prev) => [...prev, `> Executing ${snippet.fileName}...`]);

    setTimeout(() => {
      const result = executeCodeInBrowser(snippet.fileName, snippet.code);
      setOutputLogs((prev) => [
        ...prev,
        ...result.logs,
        `✓ [Execution completed with 0ms memory contention in ${result.durationMs}ms]`,
      ]);
      setIsExecuting(false);
    }, 280);
  };

  return (
    <section className="py-24 sm:py-32 px-4 max-w-6xl mx-auto relative z-10">
      
      {/* Asymmetric Grid: Left Narrative, Right Live Sandbox Visual */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
        
        {/* Left Column: Narrative (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/25 text-xs font-code text-[#10B981] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />
            <span>03 / MICROVM COMPUTE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.12]">
            &lt; 150ms spin-up.{" "}
            <span className="font-serif-editorial italic font-normal text-white">
              Instant hardware execution.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-neutral-400 leading-relaxed font-body">
            Skip 15-minute Docker builds and local environment rot. CodeMesh provisions ephemeral Firecracker MicroVM containers instantly, giving every collaborator an isolated runtime with zero setup.
          </p>

          <div className="space-y-3 pt-2 font-body text-xs sm:text-sm">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-[#0a0a0a] border border-white/10 hover:border-[#10B981]/30 transition-colors">
              <span className="material-symbols-outlined text-[#10B981] text-[18px] mt-0.5">
                security
              </span>
              <div>
                <div className="font-semibold text-white">eBPF Sandboxed Isolation</div>
                <div className="text-neutral-500 text-xs font-code">
                  Hardened virtualization boundary prevents cross-room memory leakage.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-[#0a0a0a] border border-white/10 hover:border-[#10B981]/30 transition-colors">
              <span className="material-symbols-outlined text-[#FF7E33] text-[18px] mt-0.5">
                speed
              </span>
              <div>
                <div className="font-semibold text-white">Zero-Cold-Start Cache</div>
                <div className="text-neutral-500 text-xs font-code">
                  Pre-warmed compiler daemon ready to execute in sub-millisecond bursts.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Live Sandbox Terminal (7 cols) */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-white/15 bg-[#050505]/95 backdrop-blur-2xl shadow-[0_20px_70px_rgba(0,0,0,0.8)] overflow-hidden">
            
            {/* Window Header with Language Switchers */}
            <div className="px-4 py-3 border-b border-white/10 bg-[#000000] flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/80"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/80"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]/80"></span>
                </div>
                
                {/* Language Toggles */}
                <div className="flex items-center gap-1 bg-[#0a0a0a] p-0.5 rounded-lg border border-white/10">
                  {(["python", "typescript", "rust"] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setActiveLang(lang)}
                      className={`px-2 py-0.5 rounded text-[10px] font-code capitalize transition-all cursor-pointer ${
                        activeLang === lang
                          ? "bg-white text-black font-bold"
                          : "text-neutral-500 hover:text-white"
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-code text-neutral-500 hidden sm:inline">
                  {codeSnippets[activeLang].fileName}
                </span>
                <button
                  onClick={handleRun}
                  disabled={isExecuting}
                  className="px-3.5 py-1 rounded-full bg-[#10B981] text-black font-bold text-xs font-code hover:bg-[#34D399] transition-all flex items-center gap-1 shadow cursor-pointer disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[14px]">play_arrow</span>
                  <span>{isExecuting ? "Executing..." : "Run MicroVM"}</span>
                </button>
              </div>
            </div>

            {/* Code Viewport */}
            <div className="p-4 sm:p-5 font-code text-xs sm:text-sm text-neutral-200 leading-relaxed bg-[#000000] border-b border-white/10">
              <pre className="overflow-x-auto text-neutral-300">
                <code>{codeSnippets[activeLang].code}</code>
              </pre>
            </div>

            {/* Live Terminal Output Drawer */}
            <div className="p-3.5 bg-[#050505] font-code text-[11px] space-y-1 text-neutral-400">
              <div className="flex items-center justify-between text-neutral-500 text-[10px] pb-1 border-b border-white/5">
                <span>STDOUT STREAM</span>
                <span className="text-[#10B981] font-semibold">Firecracker MicroVM Active</span>
              </div>
              {outputLogs.map((log, idx) => (
                <div
                  key={idx}
                  className={`truncate ${
                    log.startsWith("✓")
                      ? "text-[#10B981] font-semibold"
                      : log.startsWith(">")
                      ? "text-white"
                      : "text-neutral-400"
                  }`}
                >
                  {log}
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
