"use client";

export default function ScrollComparisonTable() {
  const comparisonRows = [
    {
      feature: "Multi-User Pairing Latency",
      codemesh: "Sub-10ms P2P WebRTC & OT delta broadcast",
      traditional: "500ms - 2s SSH remote terminal latency & lock contention",
    },
    {
      feature: "Codebase Context & Vector Memory",
      codemesh: "1536-D pgvector hierarchical AST embeddings",
      traditional: "Single-file copy-pasting with hallucinated imports",
    },
    {
      feature: "Environment Initialization",
      codemesh: "< 150ms isolated MicroVM container ready in browser",
      traditional: "15+ minutes Docker rebuilds or local setup rot",
    },
    {
      feature: "Team Code Discussion & Anchors",
      codemesh: "Live code referencing with real-time thread pins",
      traditional: "Stale Slack snippets without active symbol context",
    },
    {
      feature: "Security Boundary",
      codemesh: "eBPF-hardened ephemeral VM isolation per workspace",
      traditional: "Shared developer hosts with untracked local credentials",
    },
  ];

  return (
    <section id="comparison" className="py-24 px-4 max-w-6xl mx-auto relative z-10">
      
      {/* Section Header */}
      <div className="text-center mb-12">
        <span className="text-xs font-code uppercase tracking-widest text-white bg-white/5 border border-white/10 px-3.5 py-1 rounded-full">
          Architecture Matrix
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mt-3 tracking-tight">
          How CodeMesh compares to{" "}
          <span className="font-serif-editorial italic font-normal text-white">
            legacy stacks.
          </span>
        </h2>
        <p className="text-sm sm:text-base text-neutral-400 max-w-xl mx-auto mt-2">
          Engineered from first principles to eliminate merge locks and slow cloud setups.
        </p>
      </div>

      {/* Comparison Table Box */}
      <div className="rounded-2xl border border-white/15 bg-[#050505]/90 backdrop-blur-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.7)]">
        
        {/* Table Header Bar */}
        <div className="grid grid-cols-12 px-5 py-4 border-b border-white/10 bg-[#000000] font-code text-xs uppercase tracking-wider text-neutral-400">
          <div className="col-span-4">Capability</div>
          <div className="col-span-4 text-white font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            <span>CodeMesh Cloud IDE</span>
          </div>
          <div className="col-span-4 text-neutral-500">Traditional Setup</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-white/10">
          {comparisonRows.map((row, idx) => (
            <div
              key={idx}
              className="grid grid-cols-12 px-5 py-4.5 items-center font-body text-xs sm:text-sm hover:bg-white/5 transition-colors duration-200 group"
            >
              {/* Feature Name */}
              <div className="col-span-4 font-semibold text-white group-hover:text-white flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white opacity-60 group-hover:opacity-100 transition-opacity" />
                <span>{row.feature}</span>
              </div>

              {/* CodeMesh Advantage */}
              <div className="col-span-4 text-white font-medium flex items-center gap-2 pr-4">
                <span className="material-symbols-outlined text-white text-[16px] shrink-0">
                  check_circle
                </span>
                <span>{row.codemesh}</span>
              </div>

              {/* Traditional Disadvantage */}
              <div className="col-span-4 text-neutral-500 flex items-center gap-2 group-hover:text-neutral-400 transition-colors">
                <span className="material-symbols-outlined text-neutral-600 text-[16px] shrink-0">
                  cancel
                </span>
                <span>{row.traditional}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
