"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getUserSession,
  logoutUser,
  getThemePreference,
  setThemePreference,
  UserSession,
  AppTheme,
} from "@/lib/authSession";

interface NavbarProps {
  variant?: "landing" | "dashboard" | "ide";
  roomId?: string;
  activeFile?: string;
}

export default function Navbar({
  variant = "landing",
  roomId,
  activeFile,
}: NavbarProps) {
  const router = useRouter();
  const [user, setUser] = useState<UserSession>(getUserSession());
  const [theme, setTheme] = useState<AppTheme>("dark");
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    setUser(getUserSession());
    const initialTheme = getThemePreference();
    setTheme(initialTheme);
    if (initialTheme === "light") {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    }

    const handleAuthChange = () => {
      setUser(getUserSession());
    };

    const handleThemeChange = (e: Event) => {
      const custom = e as CustomEvent<{ theme: AppTheme }>;
      if (custom.detail?.theme) {
        setTheme(custom.detail.theme);
      }
    };

    window.addEventListener("codemesh:auth_change", handleAuthChange);
    window.addEventListener("codemesh:theme_change", handleThemeChange);
    return () => {
      window.removeEventListener("codemesh:auth_change", handleAuthChange);
      window.removeEventListener("codemesh:theme_change", handleThemeChange);
    };
  }, []);

  const toggleTheme = () => {
    const nextTheme: AppTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    setThemePreference(nextTheme);
  };

  const handleLogout = () => {
    logoutUser();
    setShowUserMenu(false);
    router.push("/");
  };

  return (
    <nav className="h-14 border-b border-white/10 px-4 md:px-6 flex items-center justify-between bg-[#111113]/80 backdrop-blur-md sticky top-0 z-40">
      {/* Brand & Logo */}
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2 group">
          <span
            className="material-symbols-outlined text-[#adc6ff] text-[24px] group-hover:rotate-12 transition-transform"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            widgets
          </span>
          <span className="font-headline font-bold text-lg tracking-tight text-[#ededed]">
            CodeMesh
          </span>
          <span className="text-[10px] font-code bg-[#1e1e23] border border-white/10 text-[#adc6ff] px-1.5 py-0.5 rounded">
            v2.4
          </span>
        </Link>

        {variant === "landing" && (
          <div className="hidden md:flex items-center gap-6 text-xs font-medium text-[#b0b4c3]">
            <a href="#velocity" className="hover:text-[#ededed] transition-colors">
              Architecture
            </a>
            <Link href="/workspaces" className="hover:text-[#ededed] transition-colors">
              Workspaces
            </Link>
            <Link href="/auth" className="hover:text-[#ededed] transition-colors">
              Pricing
            </Link>
          </div>
        )}

        {variant === "dashboard" && (
          <div className="hidden md:flex items-center gap-2 text-xs font-code text-[#727685]">
            <span>/</span>
            <span className="text-[#ededed] font-semibold">workspaces</span>
          </div>
        )}

        {variant === "ide" && roomId && (
          <div className="hidden sm:flex items-center gap-2 text-xs font-code text-[#727685]">
            <span>/</span>
            <Link
              href="/workspaces"
              className="hover:text-[#ededed] transition-colors"
            >
              rooms
            </Link>
            <span>/</span>
            <span className="text-[#adc6ff] font-semibold">{roomId}</span>
            {activeFile && (
              <>
                <span>/</span>
                <span className="text-[#ededed]">{activeFile}</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Right Controls & Profile */}
      <div className="flex items-center gap-3">
        {/* Quick Theme Switcher Button */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${theme === "dark" ? "Light" : "Dark"} mode`}
          className="p-1.5 rounded-lg border border-white/10 hover:border-white/20 text-[#b0b4c3] hover:text-[#ededed] transition-colors flex items-center justify-center bg-[#17171a]"
        >
          <span className="material-symbols-outlined text-[18px]">
            {theme === "dark" ? "light_mode" : "dark_mode"}
          </span>
        </button>

        {variant === "landing" && (
          <div className="flex items-center gap-3">
            <Link
              href="/auth"
              className="text-xs font-code text-[#ededed] hover:text-white px-3 py-1.5 rounded-lg transition-colors hidden sm:block"
            >
              Sign In
            </Link>
            <Link
              href="/workspaces"
              className="bg-[#adc6ff] text-[#002e6a] text-xs font-code font-bold px-3.5 py-1.5 rounded-lg hover:bg-[#d8e2ff] transition-all shadow-[0_0_15px_rgba(173,198,255,0.3)]"
            >
              Get Started
            </Link>
          </div>
        )}

        {(variant === "dashboard" || variant === "ide") && (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1 rounded-lg border border-white/10 hover:border-white/20 bg-[#17171a] transition-all"
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow"
                style={{ backgroundColor: user.avatarColor || "#4d8eff" }}
              >
                {user.initials}
              </div>
              <span className="font-code text-xs text-[#ededed] hidden sm:block pr-1">
                {user.handle}
              </span>
              <span className="material-symbols-outlined text-[16px] text-[#727685]">
                expand_more
              </span>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-[#17171a] border border-white/15 rounded-xl shadow-2xl z-50 overflow-hidden font-code text-xs">
                <div className="p-3 border-b border-white/10 bg-[#111113]">
                  <div className="font-bold text-[#ededed]">{user.handle}</div>
                  <div className="text-[11px] text-[#727685] truncate">{user.email}</div>
                  <div className="mt-1 flex items-center gap-1.5 text-[10px] text-[#adc6ff]">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                    <span>Provider: {user.provider || "email"}</span>
                  </div>
                </div>

                <div className="p-1 space-y-0.5">
                  <button
                    onClick={toggleTheme}
                    className="w-full px-3 py-2 text-left hover:bg-[#28282e] text-[#ededed] rounded-lg transition-colors flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px]">
                        {theme === "dark" ? "light_mode" : "dark_mode"}
                      </span>
                      Theme
                    </span>
                    <span className="text-[10px] text-[#727685] uppercase">{theme}</span>
                  </button>

                  <Link
                    href="/workspaces"
                    onClick={() => setShowUserMenu(false)}
                    className="w-full px-3 py-2 text-left hover:bg-[#28282e] text-[#ededed] rounded-lg transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[16px]">grid_view</span>
                    All Workspaces
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full px-3 py-2 text-left hover:bg-red-950/40 text-red-400 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[16px]">logout</span>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
