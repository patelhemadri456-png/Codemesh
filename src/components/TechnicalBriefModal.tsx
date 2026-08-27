"use client";

interface TechnicalBriefModalProps {
  onClose: () => void;
}

export default function TechnicalBriefModal({ onClose }: TechnicalBriefModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[#0e0e0e]/85 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="relative bg-[#1c1b1b] border border-[#424754] rounded-lg w-full max-w-2xl shadow-2xl flex flex-col z-10 overflow-hidden max-h-[85vh]">
        {/* Top accent */}
        <div className="border-t-2 border-[#d0bcff] absolute top-0 left-0 right-0 pointer-events-none" />

        {/* Header */}
        <div className="p-4 border-b border-[#2d2d2d] flex justify-between items-center bg-[#201f1f]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#d0bcff] text-[20px]">
              memory
            </span>
            <h2 className="font-headline text-base font-bold text-[#e5e2e1]">
              CodeMesh Architecture &amp; RAG Whitepaper
            </h2>
          </div>
          <button
            className="text-[#8c909f] hover:text-[#e5e2e1] transition-colors p-1"
            onClick={onClose}
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto font-body text-xs text-[#c2c6d6] space-y-5 leading-relaxed">
          <div>
            <h3 className="font-headline text-sm font-semibold text-[#adc6ff] mb-1.5 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">sync</span>
              1. AST-Level Real-Time Conflict Resolution
            </h3>
            <p>
              Unlike traditional text-based diffing tools which struggle with simultaneous multi-user line insertions, CodeMesh parses live file streams directly into Abstract Syntax Trees (ASTs). Concurrent edits are dispatched via Supabase Realtime channels with operational transform matrices preserving syntactic validity.
            </p>
          </div>

          <div className="bg-[#121212] p-3 rounded border border-[#2d2d2d] font-code text-[11px] text-[#adc6ff]">
            <code>
              {`// AST Conflict Resolver Pipeline\n` +
                `Event -> Tree-sitter AST Parser -> Delta Matrix -> Broadcast Channel -> Client Rehydrate`}
            </code>
          </div>

          <div>
            <h3 className="font-headline text-sm font-semibold text-[#d0bcff] mb-1.5 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">psychology</span>
              2. Real-Time pgvector Codebase Memory Graph
            </h3>
            <p>
              Every file save triggers a background chunking worker that creates 1536-dimensional embeddings with Google Gemini. Queries made in the AI panel evaluate cosine distance across symbols, internal APIs, and structural interfaces to provide exact, context-aware patches.
            </p>
          </div>

          <div>
            <h3 className="font-headline text-sm font-semibold text-[#ffb786] mb-1.5 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">bolt</span>
              3. In-Browser Cloud Sandbox
            </h3>
            <p>
              Workspaces spin up with instant in-browser evaluators and isolated runtime execution sandboxes, executing scripts under 3ms without heavy virtual machine cold starts.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#2d2d2d] bg-[#181818] flex justify-between items-center text-xs font-code text-[#8c909f]">
          <span>Document: RFC-2026-AST-RAG</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#d0bcff] text-[#3c0091] font-semibold rounded text-xs hover:bg-[#e9ddff] transition-colors"
          >
            Close Whitepaper
          </button>
        </div>
      </div>
    </div>
  );
}
