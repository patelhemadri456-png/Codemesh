"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TechnicalBriefModal from "@/components/TechnicalBriefModal";
import DemoVideoModal from "@/components/DemoVideoModal";
import ContactSalesModal from "@/components/ContactSalesModal";
import CommandPaletteModal from "@/components/CommandPaletteModal";
import InteractiveASTVisualizer from "@/components/InteractiveASTVisualizer";
import SemanticSearchVisualizer from "@/components/SemanticSearchVisualizer";
import { executeCodeInBrowser } from "@/lib/codeRunner";

const heroSnippets = {
  python: {
    lang: "python",
    fileName: "stream_processor.py",
    code: `import os
from typing import Dict
import multiprocessing

# CodeMesh AST Stream Engine
def process_realtime_stream(stream_id: str, payload: Dict) -> bool:
    concurrency = multiprocessing.cpu_count()
    buffer_pool = max(2048, concurrency * 512)
    print(f"[CodeMesh Python] Stream '{stream_id}' linked. Active buffer pool: {buffer_pool} bytes.")
    return True

if __name__ == "__main__":
    status = process_realtime_stream("Beta-Omega-9", {"packets": 128})
    print(f"Pipeline executed successfully with status: {status}")`,
  },
  typescript: {
    lang: "typescript",
    fileName: "presence_sync.ts",
    code: `// CodeMesh AST Presence Dispatcher
export interface LiveCollaborator {
  id: string;
  cursor: { line: number; col: number };
}

export function broadcastState(collab: LiveCollaborator): string {
  console.log(\`[Realtime AST] Cursor delta @ line \${collab.cursor.line}, col \${collab.cursor.col}\`);
  return "AST Delta Vector Synced";
}

const res = broadcastState({ id: "sarah_j", cursor: { line: 8, col: 14 } });
console.log("Sync Status:", res);`,
  },
  rust: {
    lang: "rust",
    fileName: "worker_core.rs",
    code: `// CodeMesh Rust High-Throughput Worker
pub struct ASTWorker {
    pub room_id: String,
}

impl ASTWorker {
    pub fn dispatch(&self, delta: &str) {
        println!("[Rust Engine] AST node delta applied in room '{}': {}", self.room_id, delta);
    }
}

fn main() {
    let worker = ASTWorker { room_id: "Beta-Omega-9".to_string() };
    worker.dispatch("TokenStream::InsertFunction");
    println!("Worker thread finished with 0 lock contention.");
}`,
  },
};

export default function Home() {
  const [selectedLang, setSelectedLang] = useState<"python" | "typescript" | "rust">("python");
  const [activeCode, setActiveCode] = useState(heroSnippets.python.code);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    "[Live Preview] Ready to execute in browser. Click 'Run Live' to evaluate.",
  ]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [aiPatchApplied, setAiPatchApplied] = useState(false);

  // Modals
  const [showBriefModal, setShowBriefModal] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showSalesModal, setShowSalesModal] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);

  // Sync active code when language tab changes
  useEffect(() => {
    setActiveCode(heroSnippets[selectedLang].code);
    setTerminalOutput([`[Switched to ${selectedLang.toUpperCase()}] Ready to execute.`]);
    setAiPatchApplied(false);
  }, [selectedLang]);

  // Global ⌘K / Ctrl+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setShowCommandPalette((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleRunHeroCode = () => {
    setIsExecuting(true);
    const result = executeCodeInBrowser(heroSnippets[selectedLang].fileName, activeCode);

    setTerminalOutput([
      `user@codemesh:~/sandbox$ run ${heroSnippets[selectedLang].fileName}`,
      ...result.logs,
      `[Completed in ${result.durationMs}ms with exit code ${result.hasError ? 1 : 0}]`,
    ]);
    setIsExecuting(false);
  };

  const handleApplyAiPatch = () => {
    if (selectedLang === "python") {
      const patched = activeCode.replace(
        "buffer_pool = max(2048, concurrency * 512)",
        "buffer_pool = max(4096, concurrency * 1024) # Gemini RAG 2x concurrency patch"
      );
      setActiveCode(patched);
      setAiPatchApplied(true);
    } else {
      setActiveCode((prev) => `${prev}\n// Applied Gemini RAG Concurrency Patch\nconsole.log("✓ Dynamic AST patch operational.");`);
      setAiPatchApplied(true);
    }
  };

  return (
    <div className="bg-[#0d0d0e] text-[#ededed] min-h-screen flex flex-col selection:bg-[#4d8eff] selection:text-[#00285d] relative overflow-x-hidden font-body">
      {/* Top Background Blueprint Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

      {/* Atmospheric Aurora Luminous Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-radial-glow pointer-events-none" />
      <div className="absolute top-48 left-1/4 w-[400px] h-[400px] aurora-glow-primary pointer-events-none opacity-60 animate-pulse-glow" />
      <div className="absolute top-72 right-1/4 w-[450px] h-[450px] aurora-glow-secondary pointer-events-none opacity-50 animate-pulse-glow" />

      <Navbar variant="landing" />

      {/* Hero Section */}
      <main className="flex-grow flex flex-col relative z-10">
        <section className="pt-20 pb-24 px-4 md:px-8 lg:px-16 flex flex-col items-center text-center">
          {/* Luminous Pill Badge */}
          <button
            onClick={() => setShowCommandPalette(true)}
            className="pill-metallic inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-code text-[#adc6ff] mb-8 hover:scale-105 transition-all shadow-[0_0_20px_rgba(77,142,255,0.15)] group"
          >
            <span className="w-2 h-2 rounded-full bg-[#4d8eff] animate-ping" />
            <span>Introducing CodeMesh 2.0 &bull; Real-time AST Engine</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-[#b0b4c3] group-hover:text-white">
              ⌘K
            </kbd>
          </button>

          {/* Hero Headline with Gradient Text Clipping */}
          <h1 className="font-headline text-[48px] sm:text-[64px] lg:text-[76px] leading-[1.08] font-bold tracking-[-0.03em] max-w-5xl mx-auto text-gradient-hero">
            Code at the speed of thought,{" "}
            <span className="text-gradient-accent relative inline-block">
              together.
            </span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-[#b0b4c3] max-w-2xl mx-auto leading-relaxed mt-6 font-normal">
            A high-performance collaborative environment. Real-time RAG-powered AI, AST conflict-free editing, and zero-latency in-browser execution for engineering teams.
          </p>

          {/* Hero Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 w-full max-w-md">
            <Link
              href="/workspaces"
              className="w-full sm:w-auto bg-[#adc6ff] text-[#002e6a] font-semibold px-8 py-3.5 rounded-lg hover:bg-[#d8e2ff] transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(173,198,255,0.35)] hover:shadow-[0_0_40px_rgba(173,198,255,0.5)] font-code text-xs"
            >
              <span>Launch Workspace</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
            <button
              onClick={() => setShowDemoModal(true)}
              className="w-full sm:w-auto pill-metallic text-[#ededed] px-8 py-3.5 rounded-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2 font-code text-xs"
            >
              <span className="material-symbols-outlined text-[18px] text-[#adc6ff]">play_circle</span>
              <span>Watch Interactive Demo</span>
            </button>
          </div>

          {/* Interactive Live Code Sandbox Preview */}
          <div className="mt-14 w-full max-w-5xl relative animate-float">
            <div className="glass-panel-elevated rounded-xl overflow-hidden shadow-2xl relative z-10 text-left">
              {/* Window Header */}
              <div className="bg-[#111113] flex items-center justify-between px-4 py-2.5 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]/80" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]/80" />
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]/80" />
                  <div className="h-4 w-px bg-white/10 ml-2" />
                  {/* Language Switcher Tabs */}
                  <div className="flex gap-1">
                    {(["python", "typescript", "rust"] as const).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setSelectedLang(lang)}
                        className={`px-3 py-1 rounded text-xs font-code transition-all ${
                          selectedLang === lang
                            ? "bg-[#1e1e23] text-[#adc6ff] font-semibold border border-white/10"
                            : "text-[#727685] hover:text-[#ededed]"
                        }`}
                      >
                        {heroSnippets[lang].fileName}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Live Collaborators */}
                  <div className="flex -space-x-1.5">
                    <div className="w-6 h-6 rounded-full bg-[#4d8eff] border border-[#111113] flex items-center justify-center text-[10px] font-bold text-white shadow">
                      YOU
                    </div>
                    <div className="w-6 h-6 rounded-full bg-[#ffb786] border border-[#111113] flex items-center justify-center text-[10px] font-bold text-[#502400] shadow">
                      SJ
                    </div>
                    <div className="w-6 h-6 rounded-full bg-[#d0bcff] border border-[#111113] flex items-center justify-center text-[10px] font-bold text-[#3c0091] shadow">
                      AL
                    </div>
                  </div>

                  <button
                    onClick={handleRunHeroCode}
                    disabled={isExecuting}
                    className="bg-[#001a42] border border-[#00285d] text-[#adc6ff] hover:bg-[#00285d] px-3 py-1 rounded text-xs font-code font-semibold flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(77,142,255,0.2)]"
                  >
                    <span className="material-symbols-outlined text-[15px]">play_arrow</span>
                    <span>{isExecuting ? "Executing..." : "Run Live"}</span>
                  </button>
                </div>
              </div>

              {/* Editor Body */}
              <div className="flex flex-col md:flex-row h-[360px] bg-[#080809]">
                {/* Code Canvas */}
                <div className="flex-1 p-4 font-code text-xs md:text-sm leading-[24px] overflow-auto relative border-r border-white/10">
                  <textarea
                    value={activeCode}
                    onChange={(e) => setActiveCode(e.target.value)}
                    spellCheck={false}
                    className="w-full h-full bg-transparent border-none text-[#ededed] resize-none focus:outline-none font-code text-xs md:text-sm leading-[24px]"
                  />

                  {/* Multi-Cursor Badges */}
                  <div className="absolute top-[80px] right-[140px] flex items-center pointer-events-none hidden sm:flex">
                    <div className="w-0.5 h-[1.2em] bg-[#ffb786] cursor-blink" />
                    <span className="bg-[#ffb786] text-[#502400] font-code text-[9px] font-bold px-1 py-0.5 rounded ml-1 shadow">
                      Sarah J. (editing)
                    </span>
                  </div>

                  {/* AI Suggestion Overlay Card */}
                  <div className="absolute bottom-4 left-4 right-4 sm:right-auto bg-[#17171a] border border-white/15 rounded-lg p-3 shadow-2xl glass-panel-dark max-w-sm">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5 text-[#d0bcff] font-code text-[11px] font-bold">
                        <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                        <span>Gemini RAG Suggestion</span>
                      </div>
                      <span className="text-[10px] text-[#727685] font-code">pgvector indexed</span>
                    </div>
                    <p className="text-[11px] text-[#b0b4c3] font-code leading-relaxed">
                      {aiPatchApplied
                        ? "✓ Concurrency buffer scaled 2x based on hardware topology."
                        : "Optimize buffer size allocation dynamically based on CPU core count."}
                    </p>
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={handleApplyAiPatch}
                        className="bg-[#28282e] hover:bg-[#383842] text-[#ededed] px-2.5 py-1 rounded text-[10px] font-code font-semibold border border-white/10 transition-colors"
                      >
                        {aiPatchApplied ? "Re-tune Patch" : "Accept Patch (Tab)"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Output Terminal Drawer */}
                <div className="w-full md:w-80 bg-[#0c0c0e] p-3 flex flex-col font-code text-xs overflow-y-auto">
                  <div className="flex items-center justify-between text-[10px] text-[#727685] border-b border-white/10 pb-1.5 mb-2">
                    <span>LIVE TERMINAL OUTPUT</span>
                    <span className="text-[#adc6ff]">In-Browser Runtime</span>
                  </div>
                  <div className="flex-1 space-y-1 text-[#b0b4c3] leading-relaxed">
                    {terminalOutput.map((line, idx) => (
                      <div key={idx} className="whitespace-pre-wrap">
                        {line.startsWith("user@") ? (
                          <span className="text-[#727685]">{line}</span>
                        ) : line.includes("[CodeMesh") || line.includes("✓") || line.includes("Completed") ? (
                          <span className="text-[#adc6ff]">{line}</span>
                        ) : line.includes("[Error") ? (
                          <span className="text-red-400">{line}</span>
                        ) : (
                          <span>{line}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Social Proof Badges */}
          <div className="mt-20 w-full max-w-4xl flex flex-col items-center">
            <p className="font-code text-xs text-[#727685] mb-6 uppercase tracking-widest text-center">
              Built for high-velocity distributed engineering teams
            </p>
            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 text-xs font-code text-[#b0b4c3]">
              <div className="pill-metallic px-4 py-2 rounded-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-[#adc6ff] text-[16px]">database</span>
                Supabase Realtime &bull; pgvector
              </div>
              <div className="pill-metallic px-4 py-2 rounded-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-[#d0bcff] text-[16px]">psychology</span>
                Google Gemini 2.0 Engine
              </div>
              <div className="pill-metallic px-4 py-2 rounded-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ffb786] text-[16px]">terminal</span>
                Monaco Collaborative Core
              </div>
            </div>
          </div>
        </section>

        {/* Live Performance Benchmarks Ticker */}
        <section className="py-12 border-y border-white/10 bg-[#0a0a0b]">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center font-code">
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-bold text-[#adc6ff]">&lt; 3ms</div>
              <div className="text-xs text-[#727685]">AST Sync Latency</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-bold text-[#d0bcff]">1536-dim</div>
              <div className="text-xs text-[#727685]">pgvector Embeddings</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-bold text-[#ffb786]">0.8s</div>
              <div className="text-xs text-[#727685]">Container Spin-Up</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-bold text-green-400">99.99%</div>
              <div className="text-xs text-[#727685]">Realtime Broadcast SLA</div>
            </div>
          </div>
        </section>

        {/* Interactive Technical Modules (Bento Architecture) */}
        <section id="velocity" className="py-24 px-4 md:px-8 lg:px-16 bg-[#080809] border-b border-white/10 relative">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-code text-[#adc6ff] uppercase tracking-wider font-semibold">
                Architecture Breakdown
              </span>
              <h2 className="font-headline text-3xl sm:text-4xl font-bold text-[#ededed]">
                Engineered for Zero-Friction Velocity
              </h2>
              <p className="text-sm text-[#b0b4c3]">
                Experience how our AST synchronization and pgvector memory eliminate merge locks and context switching.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InteractiveASTVisualizer />
              <SemanticSearchVisualizer />
            </div>
          </div>
        </section>

        {/* Architectural Comparison Matrix */}
        <section className="py-24 px-4 md:px-8 lg:px-16 bg-[#0d0d0e] border-b border-white/10">
          <div className="max-w-4xl mx-auto space-y-10">
            <div className="text-center space-y-3">
              <h2 className="font-headline text-2xl sm:text-3xl font-bold text-[#ededed]">
                Why Engineers Choose CodeMesh
              </h2>
              <p className="text-xs sm:text-sm text-[#b0b4c3]">
                Comparison between traditional local developer setups and CodeMesh cloud orchestration.
              </p>
            </div>

            <div className="overflow-x-auto border border-white/10 rounded-xl bg-[#111113]">
              <table className="w-full text-left font-code text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-[#17171a] text-[#727685]">
                    <th className="p-4">CAPABILITY</th>
                    <th className="p-4 text-[#adc6ff] font-bold">CODEMESH CLOUD</th>
                    <th className="p-4">TRADITIONAL LOCAL SETUP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-[#b0b4c3]">
                  <tr>
                    <td className="p-4 font-semibold text-[#ededed]">Multi-User Conflict Resolution</td>
                    <td className="p-4 text-[#adc6ff]">Live AST Stream Merging (0 Conflicts)</td>
                    <td className="p-4 text-[#727685]">Git Rebase / Manual Conflict Resolution</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-[#ededed]">Codebase Context &amp; RAG</td>
                    <td className="p-4 text-[#d0bcff]">1536D Vector Graph across All Files</td>
                    <td className="p-4 text-[#727685]">Static Linter / Generic Copilot Prompts</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-[#ededed]">Environment Spin-Up Time</td>
                    <td className="p-4 text-green-400">&lt; 3 Seconds (Zero Cold-Start)</td>
                    <td className="p-4 text-[#727685]">5 - 15 Minutes (Docker / Dependencies)</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-[#ededed]">Collaborator Presence</td>
                    <td className="p-4 text-[#adc6ff]">Sub-3ms Realtime Cursors &amp; Audio</td>
                    <td className="p-4 text-[#727685]">Screen Share / Video Calls</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-24 px-4 relative flex justify-center items-center overflow-hidden">
          <div className="absolute inset-0 bg-[#0a0a0b]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#4d8eff]/10 via-[#0d0d0e] to-[#0d0d0e]" />
          <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
            <h2 className="font-headline text-3xl sm:text-4xl font-bold text-[#ededed]">
              Ready to code at the speed of thought?
            </h2>
            <p className="text-sm text-[#b0b4c3] max-w-lg mx-auto">
              Join thousands of developers and teams collaborating in real time with CodeMesh.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
              <Link
                href="/workspaces"
                className="bg-[#adc6ff] text-[#002e6a] font-semibold px-8 py-3 rounded-lg hover:bg-[#d8e2ff] transition-all font-code text-xs shadow-[0_0_25px_rgba(173,198,255,0.3)]"
              >
                Launch Your First Workspace
              </Link>
              <button
                onClick={() => setShowSalesModal(true)}
                className="pill-metallic text-[#ededed] px-8 py-3 rounded-lg hover:bg-white/10 transition-colors font-code text-xs"
              >
                Contact Enterprise Sales
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Rich Developer Footer */}
      <Footer />

      {/* Modals */}
      {showBriefModal && <TechnicalBriefModal onClose={() => setShowBriefModal(false)} />}
      {showDemoModal && <DemoVideoModal onClose={() => setShowDemoModal(false)} />}
      {showSalesModal && <ContactSalesModal onClose={() => setShowSalesModal(false)} />}
      {showCommandPalette && <CommandPaletteModal onClose={() => setShowCommandPalette(false)} />}
    </div>
  );
}
