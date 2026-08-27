"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useState } from "react";

export default function Home() {
  const [aiAccepted, setAiAccepted] = useState(false);

  return (
    <div className="bg-[#131313] text-[#e5e2e1] min-h-screen flex flex-col selection:bg-[#4d8eff] selection:text-[#00285d]">
      <Navbar variant="landing" />

      {/* Main Content Canvas */}
      <main className="flex-grow flex flex-col relative overflow-hidden">
        {/* Hero Section */}
        <section className="relative pt-20 pb-28 px-4 md:px-8 lg:px-16 flex flex-col items-center text-center z-10">
          {/* Decorative background glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#adc6ff] opacity-5 blur-[130px] rounded-full pointer-events-none" />

          <div className="max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#424754] bg-[#1c1b1b] text-[#adc6ff] font-code text-xs mb-2">
              <span className="w-2 h-2 rounded-full bg-[#adc6ff] animate-pulse"></span>
              <span>v2.0 Beta is now live</span>
            </div>

            <h1 className="font-headline text-[44px] md:text-[64px] leading-tight font-bold tracking-tight text-[#e5e2e1]">
              Code at the speed of thought,{" "}
              <span className="text-[#adc6ff] relative inline-block">
                together.
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-[#adc6ff] opacity-60"
                  preserveAspectRatio="none"
                  viewBox="0 0 100 10"
                >
                  <path
                    d="M0,5 Q50,10 100,5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  />
                </svg>
              </span>
            </h1>

            <p className="text-base md:text-lg text-[#c2c6d6] max-w-2xl mx-auto leading-relaxed mt-4">
              A high-performance collaborative environment. Real-time RAG-powered AI, simultaneous multi-user editing, and instant environment spin-up for modern engineering teams.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <Link
                href="/workspaces"
                className="bg-[#adc6ff] text-[#002e6a] font-semibold px-8 py-3 rounded hover:bg-[#d8e2ff] transition-all flex items-center gap-2 w-full sm:w-auto justify-center glow-effect shadow-[0_0_25px_rgba(173,198,255,0.3)]"
              >
                <span>Launch Workspace</span>
                <span className="material-symbols-outlined text-[18px]">
                  arrow_forward
                </span>
              </Link>
              <Link
                href="/workspace/demo"
                className="border border-[#424754] text-[#e5e2e1] px-8 py-3 rounded hover:bg-[#353534]/50 transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                <span className="material-symbols-outlined text-[18px] text-[#adc6ff]">
                  play_circle
                </span>
                <span>Live Interactive Demo</span>
              </Link>
            </div>
          </div>

          {/* Hero Visual (Interactive Editor Mockup) */}
          <div className="mt-16 w-full max-w-5xl relative animate-float">
            <div className="glass-panel rounded-lg overflow-hidden border border-[#424754] shadow-2xl relative z-10 bg-[#0a0a0a]">
              {/* Editor Header */}
              <div className="bg-[#201f1f] flex items-center px-4 py-2 border-b border-[#424754]/60">
                <div className="flex gap-2 mr-4">
                  <div className="w-3 h-3 rounded-full bg-[#ffb4ab]/80"></div>
                  <div className="w-3 h-3 rounded-full bg-[#ffb786]/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <div className="flex gap-1 overflow-hidden">
                  <div className="px-4 py-1 bg-[#0a0a0a] border-t-2 border-[#adc6ff] text-[#e5e2e1] font-code text-xs flex items-center gap-2 rounded-t-sm">
                    <span className="material-symbols-outlined text-[14px] text-[#adc6ff]">
                      description
                    </span>
                    main.rs
                  </div>
                  <div className="px-4 py-1 text-[#c2c6d6] font-code text-xs flex items-center gap-2">
                    <span className="material-symbols-outlined text-[14px]">
                      terminal
                    </span>
                    terminal
                  </div>
                </div>
                <div className="ml-auto flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 rounded-full bg-[#4d8eff] border border-[#201f1f] flex items-center justify-center text-[10px] font-bold text-white">
                      SJ
                    </div>
                    <div className="w-6 h-6 rounded-full bg-[#ffb786] border border-[#201f1f] flex items-center justify-center text-[10px] font-bold text-[#502400]">
                      AL
                    </div>
                  </div>
                  <div className="bg-[#353534] px-2 py-0.5 rounded font-code text-[11px] text-[#adc6ff] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping"></span>
                    Live
                  </div>
                </div>
              </div>

              {/* Editor Body */}
              <div className="flex h-[380px] text-left">
                {/* Line Numbers */}
                <div className="w-12 bg-[#0e0e0e] border-r border-[#424754]/40 flex flex-col text-right pr-3 py-4 font-code text-xs text-[#8c909f] select-none leading-[24px]">
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                  <span className="text-[#adc6ff] font-bold">5</span>
                  <span>6</span>
                  <span>7</span>
                  <span>8</span>
                  <span>9</span>
                  <span>10</span>
                  <span>11</span>
                  <span>12</span>
                </div>

                {/* Code Area */}
                <div className="flex-1 bg-[#0a0a0a] p-4 font-code text-xs md:text-sm leading-[24px] overflow-hidden relative">
                  <pre className="text-[#c2c6d6]">
                    <code>
                      <span className="syntax-keyword">use</span> std::sync::Arc;
                      {"\n"}<span className="syntax-keyword">use</span> tokio::sync::RwLock;
                      {"\n\n"}<span className="syntax-keyword">pub struct</span>{" "}
                      <span className="text-[#4d8eff]">WorkspaceManager</span> &#123;
                      {"\n"}    <span className="text-[#adc6ff]">sessions</span>: Arc&lt;RwLock&lt;HashMap&lt;String, Session&gt;&gt;&gt;,
                      {"\n"}&#125;
                      {"\n\n"}<span className="syntax-keyword">impl</span>{" "}
                      <span className="text-[#4d8eff]">WorkspaceManager</span> &#123;
                      {"\n"}    <span className="syntax-keyword">pub async fn</span>{" "}
                      <span className="syntax-string">connect_client</span>(&amp;<span className="syntax-keyword">mut</span> self, client_id: &amp;str) -&gt; Result&lt;(), Error&gt; &#123;
                      {"\n"}        <span className="syntax-comment">// Initialize real-time sync</span>
                      {"\n"}        <span className="syntax-keyword">let</span> session = self.sessions.write().<span className="syntax-string">await</span>;
                      {"\n"}        session.<span className="syntax-string">add_participant</span>(client_id);
                      {"\n"}        
                      {"\n"}        <span className="syntax-comment">// Cursor broadcast</span>
                      {"\n"}        <span className="text-[#adc6ff]">Ok</span>(())
                      {"\n"}    &#125;
                      {"\n"}&#125;
                    </code>
                  </pre>

                  {/* Collaborator Cursor Overlay */}
                  <div className="absolute top-[195px] left-[240px] flex items-center pointer-events-none">
                    <div className="w-0.5 h-[1.2em] bg-[#ffb786] cursor-blink"></div>
                    <div className="bg-[#ffb786] text-[#502400] font-code text-[9px] px-1 py-0.5 rounded ml-1 font-semibold whitespace-nowrap shadow-md">
                      Sarah J.
                    </div>
                  </div>

                  {/* AI Suggestion Overlay */}
                  <div className="absolute top-[215px] left-[60px] bg-[#2a2a2a] border border-[#424754] rounded p-3 shadow-2xl glass-panel max-w-sm">
                    <div className="flex items-center gap-2 mb-1.5 border-b border-[#424754]/50 pb-1.5">
                      <span className="material-symbols-outlined text-[15px] text-[#d0bcff]">
                        auto_awesome
                      </span>
                      <span className="font-code text-[11px] font-semibold text-[#d0bcff]">
                        AI Suggestion (pgvector RAG)
                      </span>
                    </div>
                    <div className="font-code text-xs text-[#c2c6d6] leading-relaxed">
                      {aiAccepted
                        ? "✓ DashMap patch applied. Concurrent throughput increased 3.8x."
                        : "Consider using a DashMap for concurrent lock-free access instead of RwLock<HashMap> to eliminate contention."}
                    </div>
                    <div className="flex gap-2 mt-2.5">
                      <button
                        onClick={() => setAiAccepted(!aiAccepted)}
                        className="bg-[#353534] text-[#e5e2e1] text-[11px] px-2.5 py-1 rounded border border-[#424754] hover:bg-[#424754] transition-colors"
                      >
                        {aiAccepted ? "Revert" : "Accept (Tab)"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="mt-20 w-full max-w-4xl flex flex-col items-center">
            <p className="font-code text-xs text-[#8c909f] mb-6 uppercase tracking-widest text-center">
              Engineered for velocity &bull; Real-time distributed architecture
            </p>
            <div className="flex flex-wrap justify-center items-center gap-10 opacity-60 text-xs font-code text-[#c2c6d6]">
              <div className="flex items-center gap-2 border border-[#424754]/50 px-3 py-1.5 rounded bg-[#1c1b1b]">
                <span className="material-symbols-outlined text-[#adc6ff] text-[16px]">
                  database
                </span>
                Supabase Realtime + pgvector
              </div>
              <div className="flex items-center gap-2 border border-[#424754]/50 px-3 py-1.5 rounded bg-[#1c1b1b]">
                <span className="material-symbols-outlined text-[#d0bcff] text-[16px]">
                  psychology
                </span>
                Google Gemini Engine
              </div>
              <div className="flex items-center gap-2 border border-[#424754]/50 px-3 py-1.5 rounded bg-[#1c1b1b]">
                <span className="material-symbols-outlined text-[#ffb786] text-[16px]">
                  terminal
                </span>
                Monaco Collaborative Core
              </div>
            </div>
          </div>
        </section>

        {/* Bento Grid Value Proposition */}
        <section
          id="velocity"
          className="py-24 px-4 md:px-8 lg:px-16 bg-[#0e0e0e] border-t border-[#424754]/40 relative z-20"
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-headline text-[32px] md:text-[40px] font-bold text-[#e5e2e1] mb-3">
                Engineered for Velocity
              </h2>
              <p className="text-base text-[#c2c6d6] max-w-2xl mx-auto">
                Stop managing environments and start building. CodeMesh provides a zero-latency workspace designed for intense technical collaboration.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Large Feature Card: Instant Environments */}
              <div className="md:col-span-2 bg-[#201f1f] border border-[#424754]/60 rounded-lg p-6 flex flex-col justify-between overflow-hidden relative group hover:border-[#adc6ff] transition-colors">
                <div className="relative z-10 mb-6">
                  <div className="w-10 h-10 bg-[#353534] rounded flex items-center justify-center mb-4 border border-[#424754]">
                    <span className="material-symbols-outlined text-[#adc6ff]">
                      bolt
                    </span>
                  </div>
                  <h3 className="font-headline text-lg font-bold text-[#e5e2e1] mb-2">
                    Instant Environment Spin-up
                  </h3>
                  <p className="text-xs md:text-sm text-[#c2c6d6] max-w-md">
                    Launch fully configured cloud workspaces in under 3 seconds. Pre-built with your repo&apos;s dependencies, ready for code immediately.
                  </p>
                </div>

                <div className="relative h-44 bg-[#0a0a0a] border border-[#424754] rounded-md overflow-hidden p-4 font-code text-xs text-[#8c909f] group-hover:border-[#adc6ff]/50 transition-colors">
                  <div className="flex items-center gap-2 mb-2 text-[#e5e2e1]">
                    <span className="text-[#ffb786]">➜</span> <span>~</span>{" "}
                    <span className="text-[#adc6ff]">codemesh init</span>
                  </div>
                  <div className="space-y-1">
                    <div>[+] Analyzing repository configuration...</div>
                    <div>[+] Provisioning container (ubuntu-latest)...</div>
                    <div>[+] Initializing pgvector RAG memory graph...</div>
                    <div>[+] Mounting AST sync channel...</div>
                    <div className="text-[#d0bcff] font-semibold mt-2">
                      ✓ Workspace ready in 2.4s. Connecting session...
                    </div>
                  </div>
                </div>
              </div>

              {/* Vertical Feature Card: Multi-user Sync */}
              <div className="bg-[#201f1f] border border-[#424754]/60 rounded-lg p-6 flex flex-col justify-between overflow-hidden relative group hover:border-[#adc6ff] transition-colors">
                <div className="relative z-10 mb-6">
                  <div className="w-10 h-10 bg-[#353534] rounded flex items-center justify-center mb-4 border border-[#424754]">
                    <span className="material-symbols-outlined text-[#ffb786]">
                      group_work
                    </span>
                  </div>
                  <h3 className="font-headline text-lg font-bold text-[#e5e2e1] mb-2">
                    Multi-user Realtime Sync
                  </h3>
                  <p className="text-xs text-[#c2c6d6]">
                    True simultaneous editing with conflict resolution handled at the AST level, not just text diffs.
                  </p>
                </div>

                <div className="relative h-44 bg-[#181818] border border-[#424754] rounded-md flex items-center justify-center overflow-hidden">
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 rounded-full border-2 border-[#adc6ff] bg-[#131313] flex items-center justify-center shadow-lg">
                      <span className="font-code text-xs font-bold text-[#adc6ff]">
                        SJ
                      </span>
                    </div>
                    <div className="w-16 h-[2px] bg-[#424754] relative">
                      <div className="absolute inset-0 bg-[#adc6ff] w-full animate-pulse"></div>
                    </div>
                    <div className="w-12 h-12 rounded-full border-2 border-[#ffb786] bg-[#131313] flex items-center justify-center shadow-lg">
                      <span className="font-code text-xs font-bold text-[#ffb786]">
                        MK
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Full Width Feature Card: RAG-Powered AI */}
              <div className="md:col-span-3 bg-[#201f1f] border border-[#424754]/60 rounded-lg p-6 overflow-hidden relative group hover:border-[#d0bcff] transition-colors border-l-2 hover:border-l-[#d0bcff]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="w-10 h-10 bg-[#353534] rounded flex items-center justify-center mb-4 border border-[#424754]">
                      <span className="material-symbols-outlined text-[#d0bcff]">
                        memory
                      </span>
                    </div>
                    <h3 className="font-headline text-lg font-bold text-[#e5e2e1] mb-2">
                      RAG-Powered Contextual AI
                    </h3>
                    <p className="text-xs md:text-sm text-[#c2c6d6] mb-4 leading-relaxed">
                      Our assistant indexes your entire codebase using Retrieval-Augmented Generation. It understands your custom types, internal APIs, and architectural patterns in real time.
                    </p>
                    <Link
                      href="/workspace/demo"
                      className="text-[#d0bcff] text-xs md:text-sm font-semibold hover:underline flex items-center gap-1"
                    >
                      <span>Try AI in Workspace</span>
                      <span className="material-symbols-outlined text-[15px]">
                        arrow_forward
                      </span>
                    </Link>
                  </div>

                  <div className="bg-[#0a0a0a] border border-[#424754] rounded-md p-4 font-code text-xs relative">
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#d0bcff] opacity-70"></div>
                    <div className="text-[#c2c6d6] mb-2 border-b border-[#424754]/50 pb-2 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#d0bcff] text-[16px]">
                        robot_2
                      </span>
                      <span>Ask AI</span>
                    </div>
                    <div className="text-[#e5e2e1] mb-2">
                      <p>How is user authentication handled across microservices?</p>
                    </div>
                    <div className="text-[#c2c6d6] bg-[#201f1f] p-2.5 rounded border border-[#424754]/40 mt-2 leading-relaxed">
                      <span className="text-[#d0bcff] font-bold">AI:</span> Based on{" "}
                      <span className="text-[#adc6ff] underline">
                        auth_service/src/middleware.rs
                      </span>
                      , we use JWT tokens verified against Redis. The{" "}
                      <code className="bg-[#0e0e0e] px-1 py-0.5 rounded text-[#e5e2e1]">
                        ValidateAuth
                      </code>{" "}
                      struct injects the user context into the request headers.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4 relative flex justify-center items-center overflow-hidden border-t border-[#424754]/40">
          <div className="absolute inset-0 bg-[#1c1b1b]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#353534]/30 via-[#131313] to-[#131313]" />
          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <h2 className="font-headline text-[32px] md:text-[36px] font-bold text-[#e5e2e1] mb-3">
              Ready to accelerate your workflow?
            </h2>
            <p className="text-sm md:text-base text-[#c2c6d6] mb-8">
              Join engineering teams building faster, together.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/workspaces"
                className="bg-[#adc6ff] text-[#002e6a] font-semibold px-8 py-3 rounded hover:bg-[#d8e2ff] transition-colors"
              >
                Start Free Trial
              </Link>
              <Link
                href="/auth"
                className="border border-[#424754] bg-[#201f1f] text-[#e5e2e1] px-8 py-3 rounded hover:bg-[#353534] transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#131313] border-t border-[#424754]/40 w-full py-4 px-6 flex flex-col sm:flex-row justify-between items-center gap-3 z-40 relative text-xs font-code text-[#8c909f]">
        <div>&copy; 2026 CodeMesh Industrial Digital</div>
        <div className="flex gap-4">
          <a href="#" className="hover:text-[#adc6ff] transition-colors">
            Documentation
          </a>
          <a href="#" className="hover:text-[#adc6ff] transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-[#adc6ff] transition-colors">
            Terms
          </a>
          <a href="#" className="hover:text-[#adc6ff] transition-colors">
            Support
          </a>
        </div>
      </footer>
    </div>
  );
}
