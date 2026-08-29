"use client";

import Link from "next/link";
import ThreeRecurringMotif from "./ThreeRecurringMotif";
import confetti from "canvas-confetti";

interface FullBleedFinalCTAProps {
  onOpenSales: () => void;
  onOpenBrief: () => void;
}

export default function FullBleedFinalCTA({ onOpenSales, onOpenBrief }: FullBleedFinalCTAProps) {
  const handleLaunch = () => {
    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.65 },
      colors: ["#d0bcff", "#ffb786", "#adc6ff", "#ffffff"],
    });
  };

  return (
    <section className="relative py-32 md:py-44 px-4 text-center z-10 overflow-hidden border-t border-[#1c1b26] bg-[#07060b]">
      
      {/* 3D Signature Motif Background Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[550px] pointer-events-none -z-10 opacity-70">
        <ThreeRecurringMotif variant="cta" />
      </div>

      {/* Aurora Pulse Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[400px] bg-gradient-to-r from-[#571bc1]/25 via-[#ff8c42]/15 to-[#d0bcff]/20 blur-[150px] rounded-full pointer-events-none -z-20 animate-pulse" />

      {/* Content */}
      <div className="max-w-4xl mx-auto relative">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181626]/90 border border-[#3e3859] text-xs font-code text-[#ffb786] mb-8 shadow-md backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#ffb786] animate-ping" />
          <span>Instant Provisioning • Zero Setup Required</span>
        </div>

        <h2 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-[#f4f2f0] tracking-tight leading-[1.08] mb-6">
          Code at the speed of thought,{" "}
          <span className="bg-gradient-to-r from-[#d0bcff] via-[#f0abfc] to-[#ffb786] bg-clip-text text-transparent">
            together.
          </span>
        </h2>

        <p className="text-base sm:text-lg md:text-xl text-[#9c98ad] max-w-2xl mx-auto mb-10 leading-relaxed font-body">
          Join high-velocity engineering teams building with sub-10ms operational transformation, zero merge conflicts, and intelligent pgvector code indexing.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/workspaces"
            onClick={handleLaunch}
            className="relative group overflow-hidden w-full sm:w-auto px-8 py-4 rounded-xl font-body font-bold text-sm text-[#0a0a0f] bg-gradient-to-r from-[#d0bcff] via-[#f0abfc] to-[#ffb786] shadow-[0_0_40px_rgba(208,188,255,0.4)] hover:shadow-[0_0_60px_rgba(255,183,134,0.55)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2.5"
          >
            <span className="absolute top-0 left-[-100%] w-[60%] h-full bg-gradient-to-r from-transparent via-white/45 to-transparent skew-x-[-25deg] group-hover:left-[200%] transition-all duration-1000 ease-out" />
            <span className="material-symbols-outlined text-[20px] text-[#1a1030]">rocket_launch</span>
            <span className="tracking-wide">Launch Free Workspace</span>
          </Link>

          <button
            onClick={onOpenSales}
            className="w-full sm:w-auto px-7 py-4 rounded-xl font-body font-medium text-sm text-[#e5e2e1] bg-[#14131f]/90 hover:bg-[#201d30] border border-[#34304a] hover:border-[#675f8f] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg backdrop-blur-md"
          >
            <span className="material-symbols-outlined text-[18px] text-[#adc6ff]">support_agent</span>
            <span>Contact Enterprise Team</span>
          </button>
        </div>

        <div className="mt-8 text-xs font-code text-[#737085] flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400"></span>
          <span>Free tier includes unlimited public rooms & instant browser runners</span>
        </div>
      </div>
    </section>
  );
}
