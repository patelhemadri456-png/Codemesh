"use client";

import { useState } from "react";
import { AppTheme, setThemePreference } from "@/lib/authSession";

interface ThemeSelectionModalProps {
  onComplete: (selectedTheme: AppTheme) => void;
}

export default function ThemeSelectionModal({ onComplete }: ThemeSelectionModalProps) {
  const [selected, setSelected] = useState<AppTheme>("dark");

  const handleConfirm = () => {
    setThemePreference(selected);
    onComplete(selected);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#080809]/85 backdrop-blur-md" />

      {/* Modal Container */}
      <div className="relative bg-[#111113] border border-white/15 rounded-2xl w-full max-w-2xl shadow-[0_25px_70px_rgba(0,0,0,0.8)] z-10 overflow-hidden flex flex-col font-body">
        {/* Top Gradient Beam */}
        <div className="h-[2px] w-full bg-gradient-to-r from-[#4d8eff] via-[#d0bcff] to-[#ffb786]" />

        <div className="p-6 md:p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1e1e23] border border-white/10 text-xs font-code text-[#adc6ff]">
              <span className="material-symbols-outlined text-[14px]">palette</span>
              <span>Workspace Setup Step 2/2</span>
            </div>
            <h2 className="font-headline text-2xl md:text-3xl font-bold text-[#ededed]">
              Choose Your Workspace Aesthetic
            </h2>
            <p className="text-xs md:text-sm text-[#b0b4c3] max-w-md mx-auto">
              Select your preferred environment theme. You can switch this at any time in the top navigation or editor settings.
            </p>
          </div>

          {/* Theme Option Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Dark Theme: Obsidian Graphite */}
            <div
              onClick={() => setSelected("dark")}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between relative overflow-hidden ${
                selected === "dark"
                  ? "bg-[#17171a] border-[#adc6ff] ring-2 ring-[#adc6ff]/20 shadow-[0_0_25px_rgba(77,142,255,0.2)]"
                  : "bg-[#0d0d0e] border-white/10 hover:border-white/20 opacity-80"
              }`}
            >
              {selected === "dark" && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#adc6ff] flex items-center justify-center text-[#002e6a]">
                  <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-[#adc6ff] text-[20px]">
                    dark_mode
                  </span>
                  <h3 className="font-headline text-sm font-bold text-[#ededed]">
                    Obsidian Graphite
                  </h3>
                </div>
                <p className="text-[11px] text-[#727685] mb-3">
                  Deep `#0d0d0e` void with high-contrast syntax highlighting and luminous accents.
                </p>
              </div>

              {/* Mini Code Preview (Dark) */}
              <div className="bg-[#080809] border border-white/10 rounded-lg p-2.5 font-code text-[10px] space-y-1 select-none">
                <div className="flex items-center gap-1.5 mb-1 text-[#727685] border-b border-white/5 pb-1">
                  <div className="w-2 h-2 rounded-full bg-[#ff5f56]" />
                  <div className="w-2 h-2 rounded-full bg-[#ffbd2e]" />
                  <div className="w-2 h-2 rounded-full bg-[#27c93f]" />
                  <span className="ml-1 text-[9px] text-[#adc6ff]">main.rs</span>
                </div>
                <div className="text-[#d0bcff]">pub async fn connect() &#123;</div>
                <div className="text-[#adc6ff] pl-2">let ast = Engine::sync();</div>
                <div className="text-[#ffb786] pl-2">println!(&quot;Synced 0.02s&quot;);</div>
                <div className="text-[#d0bcff]">&#125;</div>
              </div>
            </div>

            {/* Light Theme: Frosted Ceramic */}
            <div
              onClick={() => setSelected("light")}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between relative overflow-hidden ${
                selected === "light"
                  ? "bg-[#ffffff] border-[#005ac2] ring-2 ring-[#005ac2]/20 shadow-[0_0_25px_rgba(0,90,194,0.15)] text-[#0f172a]"
                  : "bg-[#f8f9fc] border-[#e2e5ee] hover:border-[#c8cddc] opacity-80 text-[#0f172a]"
              }`}
            >
              {selected === "light" && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#005ac2] flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-[#005ac2] text-[20px]">
                    light_mode
                  </span>
                  <h3 className="font-headline text-sm font-bold text-[#0f172a]">
                    Frosted Ceramic
                  </h3>
                </div>
                <p className="text-[11px] text-[#64748b] mb-3">
                  Clean `#f8f9fc` daylight canvas with royal cobalt accents and sharp typography.
                </p>
              </div>

              {/* Mini Code Preview (Light) */}
              <div className="bg-[#f1f3f8] border border-[#e2e5ee] rounded-lg p-2.5 font-code text-[10px] space-y-1 select-none">
                <div className="flex items-center gap-1.5 mb-1 text-[#94a3b8] border-b border-[#e2e5ee] pb-1">
                  <div className="w-2 h-2 rounded-full bg-[#ff5f56]" />
                  <div className="w-2 h-2 rounded-full bg-[#ffbd2e]" />
                  <div className="w-2 h-2 rounded-full bg-[#27c93f]" />
                  <span className="ml-1 text-[9px] text-[#005ac2]">main.rs</span>
                </div>
                <div className="text-[#6b21a8]">pub async fn connect() &#123;</div>
                <div className="text-[#005ac2] pl-2">let ast = Engine::sync();</div>
                <div className="text-[#c2410c] pl-2">println!(&quot;Synced 0.02s&quot;);</div>
                <div className="text-[#6b21a8]">&#125;</div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleConfirm}
            className="w-full bg-[#adc6ff] text-[#002e6a] font-code text-xs font-bold py-3.5 rounded-lg hover:bg-[#d8e2ff] transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(173,198,255,0.3)]"
          >
            <span>APPLY THEME &amp; LAUNCH WORKSPACE</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
}
