"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface CommandPaletteModalProps {
  onClose: () => void;
}

export default function CommandPaletteModal({ onClose }: CommandPaletteModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const commands = [
    {
      category: "Workspaces",
      items: [
        { title: "Launch Python Stream Engine", shortcut: "P", action: () => router.push("/workspace/compsci-101-final") },
        { title: "Launch TypeScript Realtime Hub", shortcut: "T", action: () => router.push("/workspace/hackathon-app") },
        { title: "Launch Rust Distributed Worker", shortcut: "R", action: () => router.push("/workspace/distributed-stream-engine") },
        { title: "View All Workspaces", shortcut: "W", action: () => router.push("/workspaces") },
      ],
    },
    {
      category: "Tools & AI",
      items: [
        { title: "Open Gemini RAG Query Assistant", shortcut: "AI", action: () => router.push("/workspace/demo") },
        { title: "Run Live Code Sandbox", shortcut: "▶", action: () => router.push("/workspace/demo") },
        { title: "Read AST Whitepaper", shortcut: "DOC", action: () => window.location.hash = "velocity" },
      ],
    },
    {
      category: "Account",
      items: [
        { title: "Sign In / Register Account", shortcut: "AUTH", action: () => router.push("/auth") },
      ],
    },
  ];

  const filteredCategories = commands
    .map((cat) => ({
      ...cat,
      items: cat.items.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase())
      ),
    }))
    .filter((cat) => cat.items.length > 0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4">
      <div
        className="absolute inset-0 bg-[#080809]/80 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="relative bg-[#17171a] border border-white/15 rounded-xl w-full max-w-xl shadow-[0_25px_70px_rgba(0,0,0,0.8)] flex flex-col z-10 overflow-hidden">
        {/* Top search input */}
        <div className="p-3.5 border-b border-white/10 flex items-center gap-3 bg-[#111113]">
          <span className="material-symbols-outlined text-[20px] text-[#adc6ff]">
            search
          </span>
          <input
            type="text"
            placeholder="Type a command or search workspaces..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent border-none text-[#ededed] font-code text-xs focus:outline-none placeholder:text-[#727685]"
          />
          <kbd className="px-2 py-0.5 rounded bg-[#28282e] border border-white/10 text-[10px] font-code text-[#727685]">
            ESC
          </kbd>
        </div>

        {/* Command List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-3 font-code text-xs">
          {filteredCategories.map((cat, idx) => (
            <div key={idx}>
              <div className="px-3 py-1 text-[10px] font-bold text-[#727685] uppercase tracking-wider">
                {cat.category}
              </div>
              <div className="space-y-0.5 mt-1">
                {cat.items.map((item, itemIdx) => (
                  <button
                    key={itemIdx}
                    onClick={() => {
                      onClose();
                      item.action();
                    }}
                    className="w-full px-3 py-2 rounded-lg flex items-center justify-between text-left text-[#ededed] hover:bg-[#28282e] hover:text-[#adc6ff] transition-colors group"
                  >
                    <span>{item.title}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#111113] border border-white/10 text-[#727685] group-hover:text-[#adc6ff] group-hover:border-[#adc6ff]/30">
                      {item.shortcut}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}

          {filteredCategories.length === 0 && (
            <div className="py-8 text-center text-xs text-[#727685]">
              No commands matching &quot;{query}&quot;
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-[#111113] border-t border-white/10 flex justify-between items-center text-[10px] font-code text-[#727685]">
          <div className="flex items-center gap-3">
            <span>Navigation: <kbd className="px-1 py-0.5 bg-[#1e1e23] rounded">↑</kbd> <kbd className="px-1 py-0.5 bg-[#1e1e23] rounded">↓</kbd></span>
            <span>Select: <kbd className="px-1 py-0.5 bg-[#1e1e23] rounded">↵</kbd></span>
          </div>
          <span>CodeMesh Quick Switcher</span>
        </div>
      </div>
    </div>
  );
}
