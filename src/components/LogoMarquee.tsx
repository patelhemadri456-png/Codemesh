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
    <section className="py-14 border-y border-white/10 relative overflow-hidden bg-[#000000] select-none">
      
      {/* Side Fade Gradients for Seamless Marquee Edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 mb-5 text-center">
        <span className="text-[11px] font-code uppercase tracking-widest text-neutral-500">
          Engineered for teams scaling on modern cloud infrastructure
        </span>
      </div>

      {/* Infinite Scrolling Logo Strip: Pure Monochrome */}
      <div className="flex overflow-hidden">
        <div className="animate-marquee flex items-center gap-8 sm:gap-14 pr-8 sm:pr-14">
          {[...partnerLogos, ...partnerLogos].map((logo, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/[0.03] border border-transparent hover:border-white/20 hover:bg-white/[0.07] transition-all duration-300 group cursor-pointer"
            >
              <span className="text-base sm:text-lg font-bold text-neutral-500 group-hover:text-white transition-colors">
                {logo.icon}
              </span>
              <div className="flex flex-col text-left">
                <span className="font-headline font-semibold text-xs sm:text-sm text-neutral-400 group-hover:text-white transition-colors tracking-tight">
                  {logo.name}
                </span>
                <span className="font-code text-[9px] text-neutral-600 group-hover:text-neutral-300 transition-colors hidden sm:inline">
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
