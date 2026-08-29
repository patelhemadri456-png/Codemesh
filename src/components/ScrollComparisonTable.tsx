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
    <section className="py-24 px-4 max-w-6xl mx-auto relative z-10">
      
      {/* Section Header */}
      <div className="text-center mb-12">
        <span className="text-xs font-code uppercase tracking-widest text-[#ffb786] bg-[#291811] border border-[#5c331e] px-3.5 py-1 rounded-full">
          Architecture Matrix
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#f4f2f0] mt-3 tracking-tight">
          How CodeMesh compares to legacy stacks.
        </h2>
        <p className="text-sm sm:text-base text-[#9b98ab] max-w-xl mx-auto mt-2">
          Engineered from first principles to eliminate merge locks and slow cloud setups.
        </p>
      </div>

      {/* Comparison Table Box */}
      <div className="rounded-2xl border border-[#2c2a3d] bg-[#0f0e18]/90 backdrop-blur-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.7)]">
        
        {/* Table Header Bar */}
        <div className="grid grid-cols-12 px-5 py-4 border-b border-[#222030] bg-[#0c0b13] font-code text-xs uppercase tracking-wider text-[#737085]">
          <div className="col-span-4">Capability</div>
          <div className="col-span-4 text-[#d0bcff] font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#d0bcff] animate-pulse"></span>
            <span>CodeMesh Cloud IDE</span>
          </div>
          <div className="col-span-4 text-[#6e6b7d]">Traditional Setup</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-[#1b1926]">
          {comparisonRows.map((row, idx) => (
            <div
              key={idx}
              className="grid grid-cols-12 px-5 py-4.5 items-center font-body text-xs sm:text-sm hover:bg-[#161424] transition-colors duration-200 group"
            >
              {/* Feature Name */}
              <div className="col-span-4 font-semibold text-[#e5e2e1] group-hover:text-white flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ffb786] opacity-60 group-hover:opacity-100 transition-opacity" />
                <span>{row.feature}</span>
              </div>

              {/* CodeMesh Advantage */}
              <div className="col-span-4 text-[#d0bcff] font-medium flex items-center gap-2 pr-4">
                <span className="material-symbols-outlined text-green-400 text-[16px] shrink-0">
                  check_circle
                </span>
                <span>{row.codemesh}</span>
              </div>

              {/* Traditional Disadvantage */}
              <div className="col-span-4 text-[#757285] flex items-center gap-2 group-hover:text-[#8e8b9f] transition-colors">
                <span className="material-symbols-outlined text-[#686578] text-[16px] shrink-0">
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
