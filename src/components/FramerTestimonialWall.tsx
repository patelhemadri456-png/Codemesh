"use client";

interface WallItem {
  name: string;
  handle: string;
  role: string;
  company: string;
  initials: string;
  quote: string;
  badge: string;
}

const wallItems: WallItem[] = [
  {
    name: "Alex Vance",
    handle: "@alexvance",
    role: "Staff Infrastructure Eng",
    company: "Vercel",
    initials: "AV",
    quote: "CodeMesh is the fastest pairing experience we've ever tested. Sub-10ms OT cursor syncing across continents feels like local typing.",
    badge: "OT Sync",
  },
  {
    name: "Devon Chen",
    handle: "@devon_c",
    role: "Principal Systems Architect",
    company: "Supabase",
    initials: "DC",
    quote: "The pgvector RAG memory graph is the only AI integration that actually understands our 400-file codebase without hallucinating types.",
    badge: "Vector Memory",
  },
  {
    name: "Sarah Jenkins",
    handle: "@sjenkins",
    role: "Lead Platform Engineer",
    company: "Linear",
    initials: "SJ",
    quote: "Booting a MicroVM container in under 150ms directly inside the browser saved our frontend team hundreds of hours in Docker rebuilds.",
    badge: "MicroVM",
  },
  {
    name: "Mateo Rossi",
    handle: "@mrossi",
    role: "Founding Engineer",
    company: "Neon",
    initials: "MR",
    quote: "Zero merge locks during live pair programming sessions. The level of craft and responsiveness matches Framer and Linear quality.",
    badge: "Zero Locks",
  },
  {
    name: "Clara Dubois",
    handle: "@claradubois",
    role: "Head of Product Engineering",
    company: "PostHog",
    initials: "CD",
    quote: "CodeMesh completely replaced our clunky SSH terminal sharing setups. Real-time active line pins make design reviews effortless.",
    badge: "Collaboration",
  },
  {
    name: "Kenji Sato",
    handle: "@kenji_s",
    role: "Staff Compiler Engineer",
    company: "Cloudflare",
    initials: "KS",
    quote: "Deterministic vector clocks across WebRTC channels. It's the cleanest distributed architecture for cloud code editors on the market.",
    badge: "Architecture",
  },
];

export default function FramerTestimonialWall() {
  return (
    <section className="py-24 sm:py-32 px-4 max-w-6xl mx-auto z-10 relative">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-code uppercase tracking-widest text-white bg-white/5 border border-white/10 px-3.5 py-1 rounded-full">
          Wall of Love
        </span>
        <h2 className="text-3xl sm:text-5xl font-black tracking-[-0.035em] text-white mt-4 leading-tight">
          Built for teams who care about{" "}
          <span className="font-serif-editorial italic font-normal text-white">
            craft.
          </span>
        </h2>
        <p className="text-sm sm:text-base text-neutral-400 mt-3">
          See why engineers from high-growth tech companies rely on CodeMesh for daily collaboration.
        </p>
      </div>

      {/* Bento Grid Masonry with Pure Black & White Palette */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wallItems.map((item, idx) => (
          <div
            key={idx}
            className="rounded-3xl border border-white/15 bg-[#050505]/85 p-6 backdrop-blur-2xl shadow-[0_15px_40px_rgba(0,0,0,0.5)] hover:border-white/30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(255,255,255,0.05)] transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-white text-black">
                    {item.initials}
                  </div>
                  <div>
                    <div className="font-headline font-semibold text-xs text-white flex items-center gap-1">
                      <span>{item.name}</span>
                      <span className="material-symbols-outlined text-[13px] text-white">
                        verified
                      </span>
                    </div>
                    <div className="text-[10px] font-code text-neutral-400">
                      {item.role} • {item.company}
                    </div>
                  </div>
                </div>

                <span className="text-[10px] font-code px-2 py-0.5 rounded-full bg-white/5 text-white border border-white/10">
                  {item.badge}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-body">
                &ldquo;{item.quote}&rdquo;
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-white/10 text-[11px] font-code text-neutral-500 group-hover:text-neutral-300 transition-colors">
              {item.handle}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
