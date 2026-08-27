"use client";

import { useState, useEffect } from "react";
import { getThemePreference, setThemePreference, AppTheme } from "@/lib/authSession";

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
  const [theme, setTheme] = useState<AppTheme>("dark");

  useEffect(() => {
    setTheme(getThemePreference());
  }, []);

  const handleApply = () => {
    setThemePreference(theme);
    onSave({ fontSize, tabSize, wordWrap });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[#080809]/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-[#17171a] border border-white/15 rounded-xl w-full max-w-md shadow-2xl p-6 z-10 space-y-6 font-code text-xs">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#adc6ff] text-[20px]">
              settings
            </span>
            <span className="font-bold text-sm text-[#ededed]">IDE &amp; Editor Settings</span>
          </div>
          <button onClick={onClose} className="text-[#727685] hover:text-[#ededed]">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="space-y-4">
          {/* Aesthetic Theme Selection */}
          <div>
            <label className="block text-[#b0b4c3] mb-2 font-semibold uppercase tracking-wider text-[11px]">
              Color Theme
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={`p-2.5 rounded-lg border text-left flex items-center gap-2 transition-all ${
                  theme === "dark"
                    ? "bg-[#1e1e23] border-[#adc6ff] text-[#ededed] shadow-sm"
                    : "bg-[#111113] border-white/5 text-[#727685] hover:text-[#ededed]"
                }`}
              >
                <span className="material-symbols-outlined text-[16px] text-[#adc6ff]">
                  dark_mode
                </span>
                <div className="text-[11px]">
                  <div className="font-bold">Obsidian Dark</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={`p-2.5 rounded-lg border text-left flex items-center gap-2 transition-all ${
                  theme === "light"
                    ? "bg-white border-[#005ac2] text-[#0f172a] shadow-sm"
                    : "bg-[#111113] border-white/5 text-[#727685] hover:text-[#ededed]"
                }`}
              >
                <span className="material-symbols-outlined text-[16px] text-[#005ac2]">
                  light_mode
                </span>
                <div className="text-[11px]">
                  <div className="font-bold">Frosted Light</div>
                </div>
              </button>
            </div>
          </div>

          {/* Font Size Slider */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-[#b0b4c3] font-semibold uppercase tracking-wider text-[11px]">
                Font Size ({fontSize}px)
              </label>
            </div>
            <input
              type="range"
              min="11"
              max="20"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full accent-[#adc6ff] cursor-pointer"
            />
          </div>

          {/* Tab Spaces */}
          <div>
            <label className="block text-[#b0b4c3] mb-1.5 font-semibold uppercase tracking-wider text-[11px]">
              Tab Size
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTabSize(2)}
                className={`py-2 rounded-lg border text-center transition-all ${
                  tabSize === 2
                    ? "bg-[#1e1e23] border-[#adc6ff] text-[#adc6ff] font-bold"
                    : "bg-[#111113] border-white/10 text-[#727685]"
                }`}
              >
                2 Spaces
              </button>
              <button
                type="button"
                onClick={() => setTabSize(4)}
                className={`py-2 rounded-lg border text-center transition-all ${
                  tabSize === 4
                    ? "bg-[#1e1e23] border-[#adc6ff] text-[#adc6ff] font-bold"
                    : "bg-[#111113] border-white/10 text-[#727685]"
                }`}
              >
                4 Spaces
              </button>
            </div>
          </div>

          {/* Word Wrap */}
          <div>
            <label className="block text-[#b0b4c3] mb-1.5 font-semibold uppercase tracking-wider text-[11px]">
              Word Wrap
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setWordWrap("on")}
                className={`py-2 rounded-lg border text-center transition-all ${
                  wordWrap === "on"
                    ? "bg-[#1e1e23] border-[#adc6ff] text-[#adc6ff] font-bold"
                    : "bg-[#111113] border-white/10 text-[#727685]"
                }`}
              >
                Enabled
              </button>
              <button
                type="button"
                onClick={() => setWordWrap("off")}
                className={`py-2 rounded-lg border text-center transition-all ${
                  wordWrap === "off"
                    ? "bg-[#1e1e23] border-[#adc6ff] text-[#adc6ff] font-bold"
                    : "bg-[#111113] border-white/10 text-[#727685]"
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
            className="px-4 py-2 rounded-lg border border-white/10 hover:bg-[#1e1e23] text-[#ededed] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 rounded-lg bg-[#adc6ff] text-[#002e6a] font-bold hover:bg-[#d8e2ff] transition-all shadow-[0_0_15px_rgba(173,198,255,0.25)]"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
