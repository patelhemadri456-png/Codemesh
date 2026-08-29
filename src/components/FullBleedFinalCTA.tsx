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
      colors: ["#ffffff", "#e4e4e7", "#a1a1aa", "#71717a"],
    });
  };

  return (
    <section className="relative py-32 md:py-44 px-4 text-center z-10 overflow-hidden border-t border-white/10 bg-[#000000]">
      
      {/* 3D Signature Motif Background Element (Monochrome Silver/White) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[550px] pointer-events-none -z-10 opacity-70">
        <ThreeRecurringMotif variant="cta" />
      </div>

      {/* Pure White Radial Ambient Light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[400px] bg-white/[0.04] blur-[160px] rounded-full pointer-events-none -z-20 animate-pulse" />

      {/* Content */}
      <div className="max-w-4xl mx-auto relative">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/15 text-xs font-code text-white mb-8 shadow-md backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          <span>Instant Provisioning • Zero Setup Required</span>
        </div>

        <h2 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.08] mb-6">
          Code at the speed of thought,{" "}
          <span className="font-serif-editorial italic font-normal text-white drop-shadow-[0_0_35px_rgba(255,255,255,0.4)]">
            together.
          </span>
        </h2>

        <p className="text-base sm:text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed font-body">
          Join high-velocity engineering teams building with sub-10ms operational transformation, zero merge conflicts, and intelligent pgvector code indexing.
        </p>

        {/* Action Buttons: Pure Black & White */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/workspaces"
            onClick={handleLaunch}
            className="relative group overflow-hidden w-full sm:w-auto px-8 py-4 rounded-full font-body font-bold text-sm text-black bg-white hover:bg-neutral-200 shadow-[0_0_40px_rgba(255,255,255,0.25)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2.5"
          >
            <span className="absolute top-0 left-[-100%] w-[60%] h-full bg-gradient-to-r from-transparent via-black/15 to-transparent skew-x-[-25deg] group-hover:left-[200%] transition-all duration-1000 ease-out" />
            <span className="material-symbols-outlined text-[20px] text-black">rocket_launch</span>
            <span className="tracking-wide">Launch Free Workspace</span>
          </Link>

          <button
            onClick={onOpenSales}
            className="w-full sm:w-auto px-7 py-4 rounded-full font-body font-medium text-sm text-white bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/30 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg backdrop-blur-md"
          >
            <span className="material-symbols-outlined text-[18px] text-white">support_agent</span>
            <span>Contact Enterprise Team</span>
          </button>
        </div>

        <div className="mt-8 text-xs font-code text-neutral-500 flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-white"></span>
          <span>Free tier includes unlimited public rooms & instant browser runners</span>
        </div>
      </div>
    </section>
  );
}
