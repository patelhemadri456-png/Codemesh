"use client";

interface EditorSettingsModalProps {
  fontSize: number;
  setFontSize: (size: number) => void;
  tabSize: number;
  setTabSize: (size: number) => void;
  wordWrap: boolean;
  setWordWrap: (wrap: boolean) => void;
  onClose: () => void;
}

export default function EditorSettingsModal({
  fontSize,
  setFontSize,
  tabSize,
  setTabSize,
  wordWrap,
  setWordWrap,
  onClose,
}: EditorSettingsModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[#0e0e0e]/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-[#1c1b1b] border border-[#424754] rounded-lg w-full max-w-sm shadow-2xl flex flex-col z-10 overflow-hidden">
        {/* Top accent */}
        <div className="border-t-2 border-[#adc6ff] absolute top-0 left-0 right-0 pointer-events-none" />

        {/* Header */}
        <div className="p-4 border-b border-[#2d2d2d] flex justify-between items-center bg-[#201f1f]">
          <h2 className="font-headline text-sm font-bold text-[#e5e2e1] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#adc6ff] text-[18px]">
              settings
            </span>
            Editor Preferences
          </h2>
          <button
            className="text-[#8c909f] hover:text-[#e5e2e1] transition-colors p-1"
            onClick={onClose}
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>

        {/* Settings options */}
        <div className="p-5 space-y-4 font-code text-xs">
          <div>
            <div className="flex justify-between text-[#c2c6d6] mb-1.5">
              <span>FONT SIZE ({fontSize}px)</span>
              <span className="text-[#adc6ff]">{fontSize}px</span>
            </div>
            <input
              type="range"
              min={11}
              max={20}
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full accent-[#adc6ff]"
            />
          </div>

          <div>
            <label className="block text-[#c2c6d6] mb-1.5 uppercase">TAB SIZE</label>
            <div className="flex gap-2">
              {[2, 4].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setTabSize(size)}
                  className={`flex-1 py-1.5 rounded border ${
                    tabSize === size
                      ? "border-[#adc6ff] bg-[#001a42] text-[#adc6ff] font-bold"
                      : "border-[#424754] text-[#c2c6d6] hover:bg-[#2a2a2a]"
                  }`}
                >
                  {size} spaces
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#2d2d2d]">
            <span className="text-[#c2c6d6] uppercase">WORD WRAP</span>
            <button
              type="button"
              onClick={() => setWordWrap(!wordWrap)}
              className={`px-3 py-1 rounded text-xs font-bold border transition-colors ${
                wordWrap
                  ? "bg-[#001a42] border-[#00285d] text-[#adc6ff]"
                  : "bg-[#2a2a2a] border-[#424754] text-[#8c909f]"
              }`}
            >
              {wordWrap ? "ON" : "OFF"}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#2d2d2d] bg-[#181818] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#adc6ff] text-[#002e6a] font-bold rounded text-xs hover:bg-[#d8e2ff] transition-colors"
          >
            Apply Settings
          </button>
        </div>
      </div>
    </div>
  );
}
