"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";

interface HeroHeadlineProps {
  onOpenDemo: () => void;
  onOpenBrief: () => void;
}

export default function HeroHeadline({ onOpenDemo, onOpenBrief }: HeroHeadlineProps) {
  const headlineWords = [
    { text: "Code", highlight: false },
    { text: "at", highlight: false },
    { text: "the", highlight: false },
    { text: "speed", highlight: false },
    { text: "of", highlight: false },
    { text: "thought,", highlight: false },
    { text: "together.", highlight: true },
  ];

  const [visibleCount, setVisibleCount] = useState(0);
  const [subtextVisible, setSubtextVisible] = useState(false);
  const [ctasVisible, setCtasVisible] = useState(false);

  useEffect(() => {
    // Word-by-word animation timer
    const interval = setInterval(() => {
      setVisibleCount((prev) => {
        if (prev < headlineWords.length) {
          return prev + 1;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 110);

    // Subtext timer
    const subtextTimer = setTimeout(() => {
      setSubtextVisible(true);
    }, headlineWords.length * 110 + 150);

    // CTAs timer
    const ctasTimer = setTimeout(() => {
      setCtasVisible(true);
    }, headlineWords.length * 110 + 400);

    return () => {
      clearInterval(interval);
      clearTimeout(subtextTimer);
      clearTimeout(ctasTimer);
    };
  }, []);

  const handleLaunchConfetti = () => {
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#d0bcff", "#ffb786", "#adc6ff", "#ffffff"],
    });
  };

  return (
    <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto px-4 pt-8 md:pt-16 pb-12">
      {/* Top Pill / Changelog Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1c1b26]/90 border border-[#423e59]/60 shadow-[0_0_20px_rgba(208,188,255,0.12)] backdrop-blur-md mb-8 hover:border-[#d0bcff]/50 transition-all cursor-pointer group">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ffb786] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ffb786]"></span>
        </span>
        <span className="text-xs font-code text-[#d0bcff] font-medium tracking-wide">
          CodeMesh v2.4 Release
        </span>
        <span className="text-[#6e6b82] text-xs">|</span>
        <span className="text-xs text-[#e5e2e1]/80 group-hover:text-white transition-colors flex items-center gap-1 font-body">
          pgvector RAG & Sub-10ms OT Sync <span className="text-[11px]">→</span>
        </span>
      </div>

      {/* Main Headline (Word-by-word reveal) */}
      <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-[#f4f2f0] leading-[1.1] mb-6 min-h-[120px] sm:min-h-[150px] flex flex-wrap justify-center items-baseline gap-x-3.5 gap-y-1.5">
        {headlineWords.map((word, idx) => {
          const isVisible = idx < visibleCount;
          return (
            <span
              key={idx}
              className={`inline-block transition-all duration-500 transform ${
                isVisible
                  ? "opacity-100 translate-y-0 filter blur-0"
                  : "opacity-0 translate-y-6 filter blur-sm"
              } ${
                word.highlight
                  ? "bg-gradient-to-r from-[#d0bcff] via-[#e28cf6] to-[#ffb786] bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(208,188,255,0.4)] animate-pulse"
                  : "text-[#f4f2f0]"
              }`}
            >
              {word.text}
            </span>
          );
        })}
      </h1>

      {/* Subtext */}
      <p
        className={`text-base sm:text-lg md:text-xl text-[#9c9aa8] max-w-2xl mx-auto leading-relaxed mb-10 transition-all duration-700 ${
          subtextVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        A zero-latency cloud IDE built for hyper-productive engineering teams.
        Real-time multi-cursor OT synchronization, pgvector AST indexing, and instant isolated MicroVM runtimes.
      </p>

      {/* CTA Button Group */}
      <div
        className={`flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto transition-all duration-700 ${
          ctasVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        {/* Primary CTA (Gradient with sweep shine) */}
        <Link
          href="/workspaces"
          onClick={handleLaunchConfetti}
          className="relative group overflow-hidden w-full sm:w-auto px-8 py-3.5 rounded-xl font-body font-semibold text-sm text-[#0a0a0f] bg-gradient-to-r from-[#d0bcff] via-[#f0abfc] to-[#ffb786] shadow-[0_0_35px_rgba(208,188,255,0.35)] hover:shadow-[0_0_55px_rgba(255,183,134,0.5)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2.5"
        >
          {/* Sweep Shine Light Effect */}
          <span className="absolute top-0 left-[-100%] w-[60%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-25deg] group-hover:left-[200%] transition-all duration-1000 ease-out" />
          <span className="material-symbols-outlined text-[19px] text-[#1a1030]">rocket_launch</span>
          <span className="tracking-wide">Launch Cloud Workspace</span>
        </Link>

        {/* Secondary CTA (Outlined with interactive demo) */}
        <button
          onClick={onOpenDemo}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-body font-medium text-sm text-[#e5e2e1] bg-[#14141d]/80 hover:bg-[#1f1e2c] border border-[#353347] hover:border-[#d0bcff]/60 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg group backdrop-blur-md"
        >
          <div className="w-6 h-6 rounded-full bg-[#2a283c] group-hover:bg-[#d0bcff]/20 border border-[#484560] flex items-center justify-center transition-colors">
            <span className="material-symbols-outlined text-[15px] text-[#ffb786] group-hover:scale-110 transition-transform">
              play_arrow
            </span>
          </div>
          <span>Watch Interactive Demo</span>
        </button>
      </div>

      {/* Tech badges strip below CTA */}
      <div
        className={`mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-[#737085] font-code transition-all duration-700 ${
          ctasVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[15px] text-green-400">check_circle</span>
          <span>No credit card required</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[15px] text-[#adc6ff]">bolt</span>
          <span>&lt; 150ms spin-up</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[15px] text-[#d0bcff]">lock</span>
          <span>End-to-end CRDT encrypted</span>
        </div>
      </div>
    </div>
  );
}
