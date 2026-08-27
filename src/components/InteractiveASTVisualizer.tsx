"use client";

import { useState } from "react";

export default function InteractiveASTVisualizer() {
  const [activeSyncEvent, setActiveSyncEvent] = useState<number>(0);

  const events = [
    {
      author: "Sarah J. (tokio worker)",
      action: "Insert Async Token Handler",
      astNode: "FunctionDeclaration > AsyncBlock > TokenStream",
      delta: "+14 bytes @ node#392",
      status: "AST Conflict-Free Merged",
      color: "#ffb786",
    },
    {
      author: "Alex (redis client)",
      action: "Mutate Cache Pipeline",
      astNode: "CallExpression > Pipeline > SetKey",
      delta: "+8 bytes @ node#118",
      status: "AST Conflict-Free Merged",
      color: "#adc6ff",
    },
    {
      author: "You (stream engine)",
      action: "Dynamic Buffer Resizing",
      astNode: "VariableDeclarator > Literal(4096)",
      delta: "+2 bytes @ node#44",
      status: "AST Conflict-Free Merged",
      color: "#d0bcff",
    },
  ];

  return (
    <div className="bg-[#111113] border border-white/10 rounded-xl p-5 flex flex-col justify-between h-full overflow-hidden">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4d8eff] animate-pulse" />
            <span className="font-code text-xs font-bold text-[#ededed] uppercase tracking-wider">
              Live AST Conflict Matrix
            </span>
          </div>
          <span className="text-[10px] font-code text-[#4d8eff] bg-[#001a42] px-2 py-0.5 rounded border border-[#00285d]">
            0 Merge Conflicts
          </span>
        </div>

        <p className="text-xs text-[#b0b4c3] leading-relaxed mb-4">
          Click an event to inspect how CodeMesh transforms live token streams into AST nodes without blocking the main editor thread:
        </p>

        {/* Event Selectors */}
        <div className="space-y-2 mb-4 font-code text-xs">
          {events.map((ev, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSyncEvent(idx)}
              className={`w-full p-2.5 rounded-lg border text-left transition-all flex items-center justify-between ${
                activeSyncEvent === idx
                  ? "bg-[#1e1e23] border-[#adc6ff]/50 shadow-[0_0_15px_rgba(77,142,255,0.15)]"
                  : "bg-[#17171a] border-white/5 hover:border-white/15 text-[#b0b4c3]"
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: ev.color }}
                />
                <span className="font-semibold text-[#ededed]">{ev.author}</span>
                <span className="text-[11px] text-[#727685] hidden sm:inline">&bull; {ev.action}</span>
              </div>
              <span className="text-[10px] text-[#adc6ff]">{ev.delta}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Live Tree-sitter AST Graph */}
      <div className="bg-[#080809] border border-white/10 rounded-lg p-3 font-code text-xs space-y-2">
        <div className="flex items-center justify-between text-[10px] text-[#727685] border-b border-white/5 pb-1">
          <span>AST NODE HIERARCHY</span>
          <span className="text-green-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
            {events[activeSyncEvent].status}
          </span>
        </div>
        <div className="text-[#adc6ff] text-[11px]">
          <code>{`Root -> Program -> ${events[activeSyncEvent].astNode}`}</code>
        </div>
        <div className="text-[10px] text-[#727685]">
          Applied operational delta vector across 3 live clients in <span className="text-white font-bold">1.2ms</span>.
        </div>
      </div>
    </div>
  );
}
