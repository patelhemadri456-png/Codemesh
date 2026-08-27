"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import CreateRoomModal from "./CreateRoomModal";
import JoinRoomModal from "./JoinRoomModal";
import { getUserSession, logoutUser, UserSession } from "@/lib/authSession";
import confetti from "canvas-confetti";

interface NavbarProps {
  variant?: "landing" | "dashboard" | "workspace";
  roomId?: string;
}

export default function Navbar({ variant = "landing", roomId }: NavbarProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [user, setUser] = useState<UserSession | null>(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => {
    setUser(getUserSession());
    const handleAuthChange = () => setUser(getUserSession());
    window.addEventListener("codemesh:auth_change", handleAuthChange);
    return () => window.removeEventListener("codemesh:auth_change", handleAuthChange);
  }, []);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setShareCopied(true);
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.1 } });
      setTimeout(() => setShareCopied(false), 2500);
    }
  };

  return (
    <>
      <nav className="bg-[#1c1b1b] border-b border-[#424754]/50 flex justify-between items-center w-full px-4 md:px-6 h-12 sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="font-headline text-lg font-bold text-[#adc6ff] flex items-center gap-2 tracking-tight hover:opacity-90 transition-opacity"
          >
            <span
              className="material-symbols-outlined text-[22px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              widgets
            </span>
            CodeMesh
          </Link>

          {variant === "landing" && (
            <div className="hidden md:flex gap-1 text-sm font-medium">
              <a
                href="#features"
                className="text-[#c2c6d6] hover:text-[#e5e2e1] hover:bg-[#353534]/50 transition-colors px-3 py-1 rounded"
              >
                Features
              </a>
              <a
                href="#velocity"
                className="text-[#c2c6d6] hover:text-[#e5e2e1] hover:bg-[#353534]/50 transition-colors px-3 py-1 rounded"
              >
                Architecture
              </a>
              <Link
                href="/workspaces"
                className="text-[#c2c6d6] hover:text-[#e5e2e1] hover:bg-[#353534]/50 transition-colors px-3 py-1 rounded"
              >
                Workspaces
              </Link>
            </div>
          )}

          {variant === "dashboard" && (
            <div className="hidden md:flex h-full items-center gap-4 text-sm">
              <Link
                href="/workspaces"
                className="text-[#adc6ff] font-semibold border-b-2 border-[#adc6ff] py-3 flex items-center"
              >
                Workspaces
              </Link>
              <Link
                href="/workspace/demo"
                className="text-[#c2c6d6] py-3 hover:text-white transition-colors"
              >
                Sandbox IDE
              </Link>
            </div>
          )}

          {variant === "workspace" && (
            <div className="flex items-center gap-3">
              <div className="h-4 w-px bg-[#424754]"></div>
              <span className="font-code text-xs text-[#adc6ff] flex items-center gap-1.5 bg-[#201f1f] px-2.5 py-0.5 rounded border border-[#424754]">
                <span className="material-symbols-outlined text-[14px] text-[#adc6ff]">
                  group_work
                </span>
                {roomId || "workspace"}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {variant === "landing" ? (
            <>
              {user?.isLoggedIn ? (
                <Link
                  href="/workspaces"
                  className="flex items-center gap-2 text-xs font-code text-[#adc6ff] hover:text-white px-2 py-1"
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                    style={{ backgroundColor: user.avatarColor, color: "#00285d" }}
                  >
                    {user.initials}
                  </div>
                  <span>@{user.handle}</span>
                </Link>
              ) : (
                <Link
                  href="/auth"
                  className="text-[#c2c6d6] text-sm hover:text-[#adc6ff] transition-colors px-3 py-1.5"
                >
                  Sign In
                </Link>
              )}
              <Link
                href="/workspaces"
                className="bg-[#adc6ff] text-[#002e6a] text-sm font-semibold px-4 py-1.5 rounded hover:bg-[#d8e2ff] transition-all shadow-[0_0_15px_rgba(173,198,255,0.2)]"
              >
                Launch Workspace
              </Link>
            </>
          ) : (
            <>
              <button
                onClick={() => setShowJoinModal(true)}
                className="px-3 py-1 border border-[#424754] text-[#e5e2e1] bg-[#201f1f] rounded text-xs font-medium hover:bg-[#353534] transition-colors flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[15px] text-[#adc6ff]">
                  group_add
                </span>
                Join Room
              </button>
              <button
                onClick={handleShare}
                className="px-3 py-1 bg-[#adc6ff] text-[#002e6a] rounded text-xs font-semibold hover:bg-[#d8e2ff] transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">
                  {shareCopied ? "check" : "share"}
                </span>
                {shareCopied ? "Copied!" : "Share"}
              </button>

              {/* User Profile Avatar with Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-transform hover:scale-105 border border-[#424754]"
                  style={{
                    backgroundColor: user?.avatarColor || "#4d8eff",
                    color: user?.isLoggedIn ? "#00285d" : "#ffffff",
                  }}
                  title={user?.isLoggedIn ? `@${user.handle}` : "Guest Account"}
                >
                  {user?.initials || "YOU"}
                </button>

                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#201f1f] border border-[#424754] rounded-lg shadow-2xl py-1 z-50 text-xs font-code">
                    <div className="px-3 py-2 border-b border-[#424754]/50">
                      <div className="font-semibold text-[#e5e2e1]">
                        {user?.isLoggedIn ? `@${user.handle}` : "Guest Developer"}
                      </div>
                      <div className="text-[10px] text-[#8c909f] truncate">
                        {user?.email || "Local Sandbox"}
                      </div>
                    </div>
                    <Link
                      href="/workspaces"
                      onClick={() => setShowUserDropdown(false)}
                      className="w-full text-left px-3 py-2 hover:bg-[#2a2a2a] text-[#c2c6d6] hover:text-[#adc6ff] flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[15px]">grid_view</span>
                      Workspaces
                    </Link>
                    {user?.isLoggedIn ? (
                      <button
                        onClick={() => {
                          logoutUser();
                          setShowUserDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-[#2a2a2a] text-red-400 flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-[15px]">logout</span>
                        Log Out
                      </button>
                    ) : (
                      <Link
                        href="/auth"
                        onClick={() => setShowUserDropdown(false)}
                        className="w-full text-left px-3 py-2 hover:bg-[#2a2a2a] text-[#adc6ff] flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-[15px]">login</span>
                        Sign In / Register
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </nav>

      {showCreateModal && (
        <CreateRoomModal onClose={() => setShowCreateModal(false)} />
      )}
      {showJoinModal && (
        <JoinRoomModal onClose={() => setShowJoinModal(false)} />
      )}
    </>
  );
}
