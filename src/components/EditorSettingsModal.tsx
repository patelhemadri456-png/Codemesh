"use client";

import { useState } from "react";

interface EditorSettingsModalProps {
  fontSize: number;
  tabSize: number;
  wordWrap: "on" | "off";
  onSave: (settings: { fontSize: number; tabSize: number; wordWrap: "on" | "off" }) => void;
  onClose: () => void;
}

export default function EditorSettingsModal({
  fontSize: initialFontSize,
  tabSize: initialTabSize,
  wordWrap: initialWordWrap,
  onSave,
  onClose,
}: EditorSettingsModalProps) {
  const [fontSize, setFontSize] = useState(initialFontSize);
  const [tabSize, setTabSize] = useState(initialTabSize);
  const [wordWrap, setWordWrap] = useState<"on" | "off">(initialWordWrap);

  const handleApply = () => {
    onSave({ fontSize, tabSize, wordWrap });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      <div
        className="absolute inset-0 bg-[#000000]/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-[#0d0d10] border border-white/15 rounded-2xl w-full max-w-md shadow-2xl p-6 z-10 space-y-6 font-code text-xs">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0066FF] text-[20px]">
              settings
            </span>
            <span className="font-bold text-sm text-white">Editor Settings</span>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-white p-1 cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="space-y-5">
          {/* Font Size Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-neutral-300 font-semibold uppercase tracking-wider text-[11px]">
                Font Size ({fontSize}px)
              </label>
            </div>
            <input
              type="range"
              min="11"
              max="20"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full accent-[#0066FF] cursor-pointer"
            />
          </div>

          {/* Tab Spaces */}
          <div>
            <label className="block text-neutral-300 mb-2 font-semibold uppercase tracking-wider text-[11px]">
              Tab Size
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTabSize(2)}
                className={`py-2 rounded-xl border text-center transition-all cursor-pointer ${
                  tabSize === 2
                    ? "bg-[#18181c] border-[#0066FF] text-[#0066FF] font-bold shadow-sm"
                    : "bg-[#050505] border-white/10 text-neutral-400 hover:text-white"
                }`}
              >
                2 Spaces
              </button>
              <button
                type="button"
                onClick={() => setTabSize(4)}
                className={`py-2 rounded-xl border text-center transition-all cursor-pointer ${
                  tabSize === 4
                    ? "bg-[#18181c] border-[#0066FF] text-[#0066FF] font-bold shadow-sm"
                    : "bg-[#050505] border-white/10 text-neutral-400 hover:text-white"
                }`}
              >
                4 Spaces
              </button>
            </div>
          </div>

          {/* Word Wrap */}
          <div>
            <label className="block text-neutral-300 mb-2 font-semibold uppercase tracking-wider text-[11px]">
              Word Wrap
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setWordWrap("on")}
                className={`py-2 rounded-xl border text-center transition-all cursor-pointer ${
                  wordWrap === "on"
                    ? "bg-[#18181c] border-[#0066FF] text-[#0066FF] font-bold shadow-sm"
                    : "bg-[#050505] border-white/10 text-neutral-400 hover:text-white"
                }`}
              >
                Enabled
              </button>
              <button
                type="button"
                onClick={() => setWordWrap("off")}
                className={`py-2 rounded-xl border text-center transition-all cursor-pointer ${
                  wordWrap === "off"
                    ? "bg-[#18181c] border-[#0066FF] text-[#0066FF] font-bold shadow-sm"
                    : "bg-[#050505] border-white/10 text-neutral-400 hover:text-white"
                }`}
              >
                Disabled
              </button>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full border border-white/10 hover:bg-white/5 text-neutral-300 hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-5 py-2 rounded-full bg-white text-black font-bold hover:bg-neutral-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)] cursor-pointer"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
