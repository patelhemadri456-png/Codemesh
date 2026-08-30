"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getUserSession, logoutUser, UserSession } from "@/lib/authSession";

interface FramerNavbarProps {
  onOpenBrief?: () => void;
  onOpenSales?: () => void;
}

export default function FramerNavbar({ onOpenBrief, onOpenSales }: FramerNavbarProps) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    setUser(getUserSession());

    const handleAuthChange = () => {
      setUser(getUserSession());
    };

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("codemesh:auth_change", handleAuthChange);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("codemesh:auth_change", handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    logoutUser();
    setShowUserMenu(false);
  };

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
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/15 hover:border-white/30 transition-all text-xs font-medium text-white cursor-pointer"
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.handle}
                    className="w-5 h-5 rounded-full object-cover border border-white/20"
                  />
                ) : (
                  <div
                    className="w-5 h-5 rounded-full text-[9px] font-bold text-white flex items-center justify-center"
                    style={{ backgroundColor: user.avatarColor || "#0066FF" }}
                  >
                    {user.initials || "U"}
                  </div>
                )}
                <span className="hidden sm:inline font-code truncate max-w-[110px]">
                  @{user.handle}
                </span>
                <span className="material-symbols-outlined text-[14px] text-neutral-400">
                  expand_more
                </span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-[#0a0a0a] border border-white/15 shadow-2xl py-2 z-50 font-body text-xs backdrop-blur-2xl">
                  <div className="px-4 py-2 border-b border-white/10">
                    <div className="font-semibold text-white truncate">@{user.handle}</div>
                    <div className="text-[10px] font-code text-neutral-500 truncate">{user.email}</div>
                  </div>
                  <Link
                    href="/workspaces"
                    onClick={() => setShowUserMenu(false)}
                    className="w-full text-left px-4 py-2 text-neutral-300 hover:text-white hover:bg-white/5 flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[16px]">grid_view</span>
                    <span>Workspaces</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-400 hover:bg-white/5 flex items-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">logout</span>
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
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
