"use client";

interface TestimonialItem {
  name: string;
  handle: string;
  role: string;
  company: string;
  avatarColor: string;
  initials: string;
  text: string;
  highlight: string;
}

const testimonials: TestimonialItem[] = [
  {
    name: "Alex Vance",
    handle: "@alexvance_dev",
    role: "Staff Infra Eng",
    company: "Vercel",
    avatarColor: "#d0bcff",
    initials: "AV",
    text: "CodeMesh completely replaced our clunky SSH remote setups. Sub-10ms OT cursor syncing across time zones is genuinely mind-blowing.",
    highlight: "Sub-10ms OT cursor syncing",
  },
  {
    name: "Devon Chen",
    handle: "@devon_kernel",
    role: "Principal Systems Arch",
    company: "Supabase",
    avatarColor: "#ffb786",
    initials: "DC",
    text: "The pgvector RAG memory graph is the only AI integration that actually understands our 400-file repository without hallucinating types.",
    highlight: "pgvector RAG memory graph",
  },
  {
    name: "Sarah Jenkins",
    handle: "@sjenkins_oss",
    role: "Tech Lead",
    company: "Linear",
    avatarColor: "#adc6ff",
    initials: "SJ",
    text: "Booting a MicroVM container in under 150ms directly inside the browser has saved our frontend team hundreds of hours in Docker rebuilds.",
    highlight: "Booting a MicroVM in < 150ms",
  },
  {
    name: "Mateo Rossi",
    handle: "@mrossi_systems",
    role: "Lead Platform Eng",
    company: "Neon",
    avatarColor: "#86efac",
    initials: "MR",
    text: "Zero merge locks during live pair programming sessions. It feels like Google Docs speed, but for full-stack TypeScript and Rust.",
    highlight: "Zero merge locks",
  },
];

export default function SocialProofMarquee() {
  return (
    <section className="py-24 border-t border-[#1c1b26] relative overflow-hidden bg-[#09080e]/80">
      
      {/* Side Fade Gradients */}
      <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-[#0a0a0f] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-[#0a0a0f] to-transparent z-10 pointer-events-none" />

      {/* Section Header */}
      <div className="max-w-4xl mx-auto text-center px-4 mb-12">
        <span className="text-xs font-code uppercase tracking-widest text-[#d0bcff] bg-[#221838] border border-[#483377] px-3.5 py-1 rounded-full">
          Trusted by Systems Engineers
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#f4f2f0] mt-3 tracking-tight">
          Loved by teams shipping at extreme velocity.
        </h2>
      </div>

      {/* Auto-scrolling Marquee Rows */}
      <div className="space-y-4">
        {/* Row 1 */}
        <div className="flex overflow-hidden">
          <div className="animate-marquee flex items-center gap-5 pr-5">
            {[...testimonials, ...testimonials].map((item, idx) => (
              <div
                key={idx}
                className="w-80 sm:w-96 rounded-2xl border border-[#242236] bg-[#11101b]/90 p-5 backdrop-blur-xl hover:border-[#4f4870] hover:shadow-[0_10px_30px_rgba(0,0,0,0.6)] transition-all duration-300 group cursor-pointer shrink-0"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-[#0a0a0f]"
                      style={{ backgroundColor: item.avatarColor }}
                    >
                      {item.initials}
                    </div>
                    <div>
                      <div className="font-headline font-semibold text-xs text-[#f4f2f0] flex items-center gap-1">
                        <span>{item.name}</span>
                        <span className="material-symbols-outlined text-[14px] text-[#adc6ff]">
                          verified
                        </span>
                      </div>
                      <div className="text-[10px] font-code text-[#737085]">
                        {item.role} • {item.company}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-[#524f63] font-code">{item.handle}</span>
                </div>

                {/* Body */}
                <p className="text-xs text-[#b0adc4] leading-relaxed font-body">
                  &ldquo;{item.text}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
