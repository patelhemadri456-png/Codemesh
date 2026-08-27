"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface JoinRoomModalProps {
  onClose: () => void;
}

export default function JoinRoomModal({ onClose }: JoinRoomModalProps) {
  const router = useRouter();
  const [code, setCode] = useState("");

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    onClose();
    router.push(`/workspace/${code.trim().toLowerCase()}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[#131313]/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-[#2a2a2a] pane-border rounded-lg w-full max-w-sm shadow-2xl flex flex-col z-10 overflow-hidden">
        <div className="border-t-2 border-[#adc6ff] absolute top-0 left-0 right-0 pointer-events-none" />
        <div className="p-4 border-b border-[#424754] flex justify-between items-center bg-[#201f1f]">
          <h2 className="font-headline text-lg font-semibold text-[#e5e2e1] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#adc6ff] text-[20px]">
              group_add
            </span>
            Join Room
          </h2>
          <button
            className="text-[#c2c6d6] hover:text-[#e5e2e1] transition-colors p-1"
            onClick={onClose}
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleJoin} className="p-5 flex flex-col gap-4">
          <p className="text-xs text-[#c2c6d6] leading-relaxed">
            Enter the 6-character room code provided by the workspace host.
          </p>

          <div>
            <input
              type="text"
              maxLength={12}
              placeholder="e.g. BETA-9"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              autoFocus
              className="w-full bg-[#121212] border border-[#424754] rounded px-4 py-3 font-code text-base text-center tracking-[0.25em] text-[#adc6ff] font-bold focus:border-[#adc6ff] focus:outline-none transition-colors placeholder:text-[#8c909f]"
            />
          </div>

          <div className="pt-3 border-t border-[#424754]/50 flex justify-end gap-3">
            <button
              type="button"
              className="px-4 py-2 text-[#c2c6d6] text-sm hover:text-[#e5e2e1] transition-colors"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!code.trim()}
              className="px-5 py-2 bg-[#adc6ff] disabled:opacity-50 disabled:cursor-not-allowed text-[#002e6a] rounded text-sm font-semibold hover:bg-[#d8e2ff] transition-colors flex items-center gap-1.5 shadow-[0_0_12px_rgba(173,198,255,0.2)]"
            >
              <span>Connect</span>
              <span className="material-symbols-outlined text-[16px]">
                login
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
