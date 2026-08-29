"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getUserSession, UserSession } from "@/lib/authSession";

interface FramerNavbarProps {
  onOpenBrief?: () => void;
  onOpenSales?: () => void;
}

export default function FramerNavbar({ onOpenBrief, onOpenSales }: FramerNavbarProps) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setUser(getUserSession());

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4 sm:pt-6 pointer-events-none">
      
      {/* Framer Pure Black & White Floating Island Nav */}
      <nav
        className={`pointer-events-auto flex items-center justify-between gap-6 px-4 sm:px-6 py-2.5 rounded-full border transition-all duration-300 ${
          scrolled
            ? "bg-[#000000]/90 border-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.15)] backdrop-blur-2xl"
            : "bg-[#0a0a0a]/80 border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.6)] backdrop-blur-xl"
        }`}
      >
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-lg bg-white p-[1px] shadow-sm">
            <div className="w-full h-full bg-black rounded-[7px] flex items-center justify-center group-hover:bg-neutral-900 transition-colors">
              <span
                className="material-symbols-outlined text-[17px] text-white group-hover:scale-110 transition-transform"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                widgets
              </span>
            </div>
          </div>
          <span className="font-headline font-bold text-sm sm:text-base text-white tracking-tight">
            CodeMesh
          </span>
        </Link>

        {/* Center Nav Links */}
        <div className="hidden md:flex items-center gap-6 text-xs font-body text-neutral-400">
          <a href="#screens" className="hover:text-white transition-colors">
            Screens
          </a>
          <a href="#features" className="hover:text-white transition-colors">
            Features
          </a>
          <button
            onClick={onOpenBrief}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Technical Specs
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {user?.isLoggedIn ? (
            <Link
              href="/workspaces"
              className="text-xs font-medium text-neutral-300 hover:text-white transition-colors hidden sm:inline"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/auth"
              className="text-xs font-medium text-neutral-300 hover:text-white transition-colors hidden sm:inline"
            >
              Log In
            </Link>
          )}

          {/* Pure Black & White Framer Pill CTA */}
          <Link
            href="/workspaces"
            className="relative group overflow-hidden px-4 sm:px-5 py-1.5 sm:py-2 rounded-full font-body font-semibold text-xs text-black bg-white hover:bg-neutral-200 shadow-[0_0_20px_rgba(255,255,255,0.25)] transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5"
          >
            <span className="absolute top-0 left-[-100%] w-[60%] h-full bg-gradient-to-r from-transparent via-black/15 to-transparent skew-x-[-25deg] group-hover:left-[200%] transition-all duration-1000 ease-out" />
            <span>Launch Free</span>
            <span className="text-[10px] font-bold">→</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
