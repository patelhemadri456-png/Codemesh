"use client";

import Link from "next/link";
import { useState } from "react";

interface DemoVideoModalProps {
  onClose: () => void;
}

export default function DemoVideoModal({ onClose }: DemoVideoModalProps) {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      title: "Simultaneous Multi-Cursor Sync",
      desc: "Watch 3 developers edit different modules concurrently with zero lock contention.",
      code: `// Developer 1 (Sarah) editing: auth_middleware.rs\npub async fn verify_token(header: &str) -> Result<User, AuthError> {\n    let token = extract_bearer(header)?;\n    redis_cache.validate(token).await\n}`,
    },
    {
      title: "Contextual Gemini RAG Assistant",
      desc: "AI assistant indexes your custom types and automatically optimizes hot loops.",
      code: `// Gemini suggested dynamic buffer patch:\nfrom config import get_optimal_buffer\nbuffer_size = get_optimal_buffer() # Auto-tuned for high throughput`,
    },
    {
      title: "Instant In-Browser Code Sandbox",
      desc: "Execute scripts live in the integrated terminal with stdout streaming in real time.",
      code: `user@codemesh:~/project$ run main.py\n[CodeMesh Runtime] Executing main.py (python)...\n[CodeMesh] Processed 4 tensor batches in 1.8ms\n[Process completed with exit code 0]`,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[#0e0e0e]/85 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="relative bg-[#1c1b1b] border border-[#424754] rounded-lg w-full max-w-2xl shadow-2xl flex flex-col z-10 overflow-hidden">
        {/* Top accent */}
        <div className="border-t-2 border-[#adc6ff] absolute top-0 left-0 right-0 pointer-events-none" />

        {/* Header */}
        <div className="p-4 border-b border-[#2d2d2d] flex justify-between items-center bg-[#201f1f]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#adc6ff] text-[20px]">
              play_circle
            </span>
            <h2 className="font-headline text-base font-bold text-[#e5e2e1]">
              CodeMesh Interactive Demo Showcase
            </h2>
          </div>
          <button
            className="text-[#8c909f] hover:text-[#e5e2e1] transition-colors p-1"
            onClick={onClose}
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Interactive Step Switcher */}
        <div className="flex border-b border-[#2d2d2d] bg-[#121212]">
          {steps.map((step, idx) => (
            <button
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={`flex-1 py-2 px-3 text-left font-code text-xs transition-colors border-r border-[#2d2d2d] last:border-r-0 ${
                activeStep === idx
                  ? "bg-[#1c1b1b] text-[#adc6ff] font-semibold border-b-2 border-b-[#adc6ff]"
                  : "text-[#8c909f] hover:text-[#e5e2e1] hover:bg-[#181818]"
              }`}
            >
              Step 0{idx + 1}
            </button>
          ))}
        </div>

        {/* Step Preview Canvas */}
        <div className="p-6 space-y-4">
          <div>
            <h3 className="font-headline text-base font-bold text-[#e5e2e1] mb-1">
              {steps[activeStep].title}
            </h3>
            <p className="text-xs text-[#c2c6d6]">{steps[activeStep].desc}</p>
          </div>

          <div className="bg-[#0a0a0a] border border-[#2d2d2d] rounded-md p-4 font-code text-xs overflow-x-auto text-[#adc6ff]">
            <pre>
              <code>{steps[activeStep].code}</code>
            </pre>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#2d2d2d] bg-[#181818] flex justify-between items-center">
          <button
            onClick={() => setActiveStep((prev) => (prev + 1) % steps.length)}
            className="text-xs font-code text-[#8c909f] hover:text-[#adc6ff] transition-colors flex items-center gap-1"
          >
            <span>Next Feature</span>
            <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs text-[#c2c6d6] hover:text-white transition-colors"
            >
              Dismiss
            </button>
            <Link
              href="/workspace/demo"
              onClick={onClose}
              className="px-4 py-1.5 bg-[#adc6ff] text-[#002e6a] font-semibold rounded text-xs hover:bg-[#d8e2ff] transition-colors flex items-center gap-1.5"
            >
              <span>Launch Live Workspace</span>
              <span className="material-symbols-outlined text-[15px]">open_in_new</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
