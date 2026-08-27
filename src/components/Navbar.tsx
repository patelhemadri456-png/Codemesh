"use client";

import Link from "next/link";
import { useState } from "react";
import CreateRoomModal from "./CreateRoomModal";
import JoinRoomModal from "./JoinRoomModal";

interface NavbarProps {
  variant?: "landing" | "dashboard" | "workspace";
  roomId?: string;
}

export default function Navbar({ variant = "landing", roomId }: NavbarProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

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
              <span className="text-[#adc6ff] font-semibold border-b-2 border-[#adc6ff] py-3 flex items-center">
                Explorer
              </span>
              <span className="text-[#c2c6d6] py-3 hover:text-white cursor-pointer transition-colors">
                Git
              </span>
              <span className="text-[#c2c6d6] py-3 hover:text-white cursor-pointer transition-colors">
                Debug
              </span>
            </div>
          )}

          {variant === "workspace" && (
            <div className="flex items-center gap-3">
              <div className="h-4 w-px bg-[#424754]"></div>
              <span className="font-code text-xs text-[#c2c6d6] flex items-center gap-1.5 bg-[#201f1f] px-2.5 py-0.5 rounded border border-[#424754]">
                <span className="material-symbols-outlined text-[14px] text-[#adc6ff]">
                  group_work
                </span>
                {roomId || "Beta-Omega-9"}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {variant === "landing" ? (
            <>
              <Link
                href="/auth"
                className="text-[#c2c6d6] text-sm hover:text-[#adc6ff] transition-colors px-3 py-1.5"
              >
                Sign In
              </Link>
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
                onClick={() => setShowCreateModal(true)}
                className="px-3 py-1 bg-[#adc6ff] text-[#002e6a] rounded text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                Share
              </button>
              <Link
                href="/auth"
                className="w-8 h-8 rounded-full bg-[#353534] flex items-center justify-center text-[#c2c6d6] hover:text-[#adc6ff] transition-colors"
                title="Account Profile"
              >
                <span className="material-symbols-outlined text-[20px]">
                  account_circle
                </span>
              </Link>
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
