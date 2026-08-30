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
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<UserSession>(getUserSession());
  const [theme, setTheme] = useState<AppTheme>("dark");
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    setMounted(true);
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
    <nav className="h-14 border-b border-white/10 px-4 md:px-6 flex items-center justify-between bg-[#000000]/90 backdrop-blur-xl sticky top-0 z-40">
      {/* Brand & Logo */}
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-6 h-6 rounded-md bg-white p-[1px] shadow-sm flex items-center justify-center">
            <span
              className="material-symbols-outlined text-black text-[16px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              widgets
            </span>
          </div>
          <span className="font-headline font-bold text-base tracking-tight text-white">
            CodeMesh
          </span>
          <span className="text-[10px] font-code bg-white/10 border border-white/15 text-white px-1.5 py-0.5 rounded-full">
            v2.4
          </span>
        </Link>

        {variant === "dashboard" && (
          <div className="hidden md:flex items-center gap-2 text-xs font-code text-neutral-500">
            <span>/</span>
            <span className="text-white font-semibold">workspaces</span>
          </div>
        )}

        {variant === "ide" && roomId && (
          <div className="hidden sm:flex items-center gap-2 text-xs font-code text-neutral-500">
            <span>/</span>
            <Link
              href="/workspaces"
              className="hover:text-white transition-colors"
            >
              workspaces
            </Link>
            <span>/</span>
            <span className="text-white font-semibold">{roomId}</span>
            {activeFile && (
              <>
                <span>/</span>
                <span className="text-neutral-300">{activeFile}</span>
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
          className="p-1.5 rounded-full border border-white/10 hover:border-white/20 text-neutral-400 hover:text-white transition-colors flex items-center justify-center bg-white/5"
        >
          <span className="material-symbols-outlined text-[16px]">
            {theme === "dark" ? "light_mode" : "dark_mode"}
          </span>
        </button>

        {/* User Status / Avatar */}
        {mounted && user.isLoggedIn ? (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1 pl-2.5 rounded-full bg-white/5 border border-white/10 hover:border-white/20 transition-all text-xs font-medium text-white cursor-pointer"
            >
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.handle}
                  className="w-6 h-6 rounded-full object-cover border border-white/20 shrink-0"
                />
              ) : (
                <div
                  className="w-6 h-6 rounded-full text-white text-[10px] font-bold flex items-center justify-center shrink-0"
                  style={{ backgroundColor: user.avatarColor || "#0066FF" }}
                >
                  {user.initials || "U"}
                </div>
              )}
              <span className="truncate max-w-[120px]">@{user.handle}</span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-[#0a0a0a] border border-white/15 shadow-2xl py-2 z-50 font-body text-xs">
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
            className="px-4 py-1.5 rounded-full bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-all"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}
