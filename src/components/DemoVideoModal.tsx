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
      code: `// Gemini suggested dynamic buffer patch:\nfrom config import get_optimal_buffer\n\nbuffer_size = get_optimal_buffer() # Auto-tuned for high throughput\nprint(f"[RAG Memory] Buffer allocated: {buffer_size}KB")`,
    },
    {
      title: "Instant In-Browser Code Sandbox",
      desc: "Execute scripts live in the integrated terminal with stdout streaming in real time.",
      code: `user@codemesh:~/project$ run main.py\n[CodeMesh Runtime] Executing main.py (python)...\n[CodeMesh] Processed 4 tensor batches in 1.8ms\n[Process completed with exit code 0]`,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal Card with Strict Fixed Dimensions to Prevent Resizing Between Steps */}
      <div className="relative bg-[#0a0a0a] border border-white/15 rounded-2xl w-full max-w-2xl shadow-[0_25px_80px_rgba(0,0,0,0.95)] flex flex-col z-10 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:px-6 border-b border-white/10 flex justify-between items-center bg-[#000000]">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-white text-[20px]">
              play_circle
            </span>
            <h2 className="font-headline text-sm sm:text-base font-bold text-white tracking-tight">
              CodeMesh Interactive Demo Showcase
            </h2>
          </div>
          <button
            className="text-neutral-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
            onClick={onClose}
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Interactive Step Switcher Tabs */}
        <div className="flex border-b border-white/10 bg-[#050505]">
          {steps.map((step, idx) => (
            <button
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={`flex-1 py-3 px-4 text-left font-code text-xs transition-all border-r border-white/10 last:border-r-0 cursor-pointer ${
                activeStep === idx
                  ? "bg-[#0a0a0a] text-white font-bold border-b-2 border-b-white"
                  : "text-neutral-500 hover:text-neutral-300 hover:bg-white/[0.02]"
              }`}
            >
              Step 0{idx + 1}
            </button>
          ))}
        </div>

        {/* Step Preview Canvas with Fixed Height */}
        <div className="p-6 flex flex-col justify-between h-[280px]">
          {/* Title & Description with Fixed Min-Height to Prevent Jumps */}
          <div className="h-12 flex flex-col justify-center">
            <h3 className="font-headline text-sm sm:text-base font-bold text-white mb-0.5 tracking-tight">
              {steps[activeStep].title}
            </h3>
            <p className="text-xs text-neutral-400 leading-normal">{steps[activeStep].desc}</p>
          </div>

          {/* Code Box with Fixed Height (180px) and Scrollability */}
          <div className="bg-[#000000] border border-white/10 rounded-xl p-4 font-code text-xs text-neutral-200 h-[190px] overflow-y-auto overflow-x-auto flex items-start">
            <pre className="w-full">
              <code className="leading-relaxed">{steps[activeStep].code}</code>
            </pre>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:px-6 border-t border-white/10 bg-[#000000] flex justify-between items-center">
          <button
            onClick={() => setActiveStep((prev) => (prev + 1) % steps.length)}
            className="text-xs font-code text-neutral-400 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer py-1.5 px-2 rounded hover:bg-white/5"
          >
            <span>Next Feature</span>
            <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-white transition-colors cursor-pointer rounded-full hover:bg-white/5"
            >
              Dismiss
            </button>
            <Link
              href="/workspaces"
              onClick={onClose}
              className="px-5 py-2 bg-white text-black font-semibold rounded-full text-xs hover:bg-neutral-200 transition-all flex items-center gap-1.5 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              <span>Launch Live Workspace</span>
              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
