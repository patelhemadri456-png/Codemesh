"use client";

const partnerLogos = [
  { name: "Vercel", desc: "Edge Deployment", icon: "▲" },
  { name: "Supabase", desc: "Realtime Database", icon: "⚡" },
  { name: "Neon", desc: "Serverless Postgres", icon: "◈" },
  { name: "PostHog", desc: "Product Analytics", icon: "🦔" },
  { name: "Cloudflare", desc: "Edge Workers", icon: "☁" },
  { name: "Linear", desc: "Issue Tracking", icon: "⬡" },
  { name: "GitHub", desc: "Version Control", icon: "🐙" },
  { name: "Stripe", desc: "Global Payments", icon: "S" },
];

export default function LogoMarquee() {
  return (
    <section className="py-14 border-y border-[#1c1b26]/70 relative overflow-hidden bg-[#0c0b12]/60 select-none">
      
      {/* Side Fade Gradients for Seamless Marquee Edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-[#0a0a0f] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-[#0a0a0f] to-transparent z-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 mb-5 text-center">
        <span className="text-[11px] font-code uppercase tracking-widest text-[#78758c]">
          Engineered for teams scaling on modern cloud infrastructure
        </span>
      </div>

      {/* Infinite Scrolling Logo Strip */}
      <div className="flex overflow-hidden">
        <div className="animate-marquee flex items-center gap-8 sm:gap-14 pr-8 sm:pr-14">
          {[...partnerLogos, ...partnerLogos].map((logo, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-[#12111b]/40 border border-transparent hover:border-[#38334f] hover:bg-[#181624] transition-all duration-300 group cursor-pointer"
            >
              <span className="text-base sm:text-lg font-bold text-[#625f75] group-hover:text-[#d0bcff] transition-colors">
                {logo.icon}
              </span>
              <div className="flex flex-col text-left">
                <span className="font-headline font-semibold text-xs sm:text-sm text-[#78758c] group-hover:text-[#f4f2f0] transition-colors tracking-tight">
                  {logo.name}
                </span>
                <span className="font-code text-[9px] text-[#524f63] group-hover:text-[#ffb786] transition-colors hidden sm:inline">
                  {logo.desc}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
