"use client";

import { useState } from "react";
import Navbar from "./Navbar";

interface WorkspaceIDEProps {
  roomId?: string;
}

const fileContents: Record<string, { lang: string; code: string; lines: number }> = {
  "main.py": {
    lang: "python",
    lines: 15,
    code: `import os
import sys
from typing import List, Dict

# Collaborative cursor processing engine
def process_data_stream(stream_id: str, payload: Dict) -> bool:
    try:
        buffer_size = payload.get('buffer', 2048)
        if not stream_id:
            raise ValueError("Stream ID cannot be null")
        
        # Apply transformations
        processed = apply_transforms(payload, buffer_size)
        return True
        
    except Exception as e:
        logger.error(f"Stream failure: {e}")
        return False`,
  },
  "utils.py": {
    lang: "python",
    lines: 12,
    code: `import time
import logging

logger = logging.getLogger("codemesh.stream")

def apply_transforms(data: dict, buffer_size: int) -> dict:
    start_ts = time.time()
    # Batch partition based on dynamic buffer size
    chunks = [data[i:i+buffer_size] for i in range(0, len(data), buffer_size)]
    return {"chunks": len(chunks), "latency_ms": (time.time() - start_ts) * 1000}`,
  },
  "config.json": {
    lang: "json",
    lines: 10,
    code: `{
  "workspace_id": "beta-omega-9",
  "engine_version": "2.4.1-stable",
  "max_concurrency": 16,
  "telemetry": true,
  "rag_index": {
    "files_indexed": 42,
    "vector_dim": 1536
  }
}`,
  },
};

export default function WorkspaceIDE({ roomId = "Beta-Omega-9" }: WorkspaceIDEProps) {
  const [activeFile, setActiveFile] = useState<string>("main.py");
  const [openTabs, setOpenTabs] = useState<string[]>(["main.py", "utils.py"]);
  const [activeTabPanel, setActiveTabPanel] = useState<"terminal" | "output" | "problems">("terminal");
  const [activeActivity, setActiveActivity] = useState<"explorer" | "search" | "git" | "run" | "ai">("explorer");
  const [showAIPanel, setShowAIPanel] = useState(true);
  const [aiPrompt, setAiPrompt] = useState("");
  const [copiedCode, setCopiedCode] = useState(false);
  const [editorNotice, setEditorNotice] = useState<string | null>(null);

  const [aiChat, setAiChat] = useState<Array<{ role: "user" | "assistant"; text: string; code?: string }>>([
    {
      role: "user",
      text: "Can we optimize the buffer size allocation on line 8?",
    },
    {
      role: "assistant",
      text: "Yes. Currently, it defaults to 2048 statically. Based on config.json, we should dynamically calculate optimal buffer sizes for high-throughput concurrency.",
      code: `from config import get_optimal_buffer\n\n# Dynamic Buffer\nbuffer_size = payload.get('buffer', get_optimal_buffer())`,
    },
  ]);

  const handleOpenFile = (fileName: string) => {
    if (!openTabs.includes(fileName)) {
      setOpenTabs([...openTabs, fileName]);
    }
    setActiveFile(fileName);
  };

  const handleCloseTab = (fileName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const remaining = openTabs.filter((t) => t !== fileName);
    if (remaining.length > 0) {
      setOpenTabs(remaining);
      if (activeFile === fileName) {
        setActiveFile(remaining[0]);
      }
    }
  };

  const handleSendPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    const userText = aiPrompt.trim();
    setAiPrompt("");
    setAiChat((prev) => [...prev, { role: "user", text: userText }]);

    setTimeout(() => {
      setAiChat((prev) => [
        ...prev,
        {
          role: "assistant",
          text: `Analyzing "${userText}" across 42 files indexed via pgvector RAG. Here is the suggested implementation:`,
          code: `// Synchronized AST Patch\nasync function syncAST() {\n  await supabase.realtime.broadcast({\n    event: "ast:patch",\n    payload: { node: "Identifier", delta: 1 }\n  });\n}`,
        },
      ]);
    }, 600);
  };

  const handleApplyToEditor = () => {
    setEditorNotice("Applied dynamic buffer patch from AI Assistant!");
    setTimeout(() => setEditorNotice(null), 3000);
  };

  const currentFileData = fileContents[activeFile] || fileContents["main.py"];

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#131313] text-[#e5e2e1]">
      <Navbar variant="workspace" roomId={roomId} />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Activity Bar */}
        <aside className="bg-[#131313] border-r border-[#424754]/50 w-12 flex flex-col items-center py-2 z-40 shrink-0 select-none">
          <div className="flex flex-col gap-2 w-full">
            <button
              onClick={() => setActiveActivity("explorer")}
              className={`w-full flex justify-center py-2.5 transition-colors ${
                activeActivity === "explorer"
                  ? "border-l-2 border-[#adc6ff] bg-[#353534]/50 text-[#adc6ff]"
                  : "text-[#c2c6d6] hover:bg-[#201f1f]"
              }`}
              title="Explorer"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={{
                  fontVariationSettings:
                    activeActivity === "explorer" ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                folder_open
              </span>
            </button>

            <button
              onClick={() => setActiveActivity("search")}
              className={`w-full flex justify-center py-2.5 transition-colors ${
                activeActivity === "search"
                  ? "border-l-2 border-[#adc6ff] bg-[#353534]/50 text-[#adc6ff]"
                  : "text-[#c2c6d6] hover:bg-[#201f1f]"
              }`}
              title="Search"
            >
              <span className="material-symbols-outlined text-[20px]">search</span>
            </button>

            <button
              onClick={() => setActiveActivity("git")}
              className={`w-full flex justify-center py-2.5 transition-colors ${
                activeActivity === "git"
                  ? "border-l-2 border-[#adc6ff] bg-[#353534]/50 text-[#adc6ff]"
                  : "text-[#c2c6d6] hover:bg-[#201f1f]"
              }`}
              title="Source Control"
            >
              <span className="material-symbols-outlined text-[20px]">grid_view</span>
            </button>

            <button
              onClick={() => setActiveActivity("run")}
              className={`w-full flex justify-center py-2.5 transition-colors ${
                activeActivity === "run"
                  ? "border-l-2 border-[#adc6ff] bg-[#353534]/50 text-[#adc6ff]"
                  : "text-[#c2c6d6] hover:bg-[#201f1f]"
              }`}
              title="Run & Debug"
            >
              <span className="material-symbols-outlined text-[20px]">play_arrow</span>
            </button>

            <button
              onClick={() => setShowAIPanel(!showAIPanel)}
              className={`w-full flex justify-center py-2.5 transition-colors ${
                showAIPanel
                  ? "border-l-2 border-[#d0bcff] bg-[#571bc1]/20 text-[#d0bcff]"
                  : "text-[#d0bcff]/70 hover:bg-[#201f1f]"
              }`}
              title="Toggle AI Assistant"
            >
              <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
            </button>
          </div>

          <div className="mt-auto flex flex-col gap-3 w-full pb-2">
            <button
              className="w-full flex justify-center py-2 text-[#c2c6d6] hover:bg-[#201f1f] transition-colors"
              title="Settings"
            >
              <span className="material-symbols-outlined text-[20px]">settings</span>
            </button>
            <div className="w-7 h-7 rounded-full bg-[#353534] flex items-center justify-center mx-auto overflow-hidden border border-[#424754] text-xs font-bold text-[#adc6ff]">
              YOU
            </div>
          </div>
        </aside>

        {/* Sidebar Panel (Explorer) */}
        <div className="w-64 bg-[#181818] border-r border-[#424754]/50 flex flex-col shrink-0">
          <div className="p-3 border-b border-[#424754]/50 flex justify-between items-center bg-[#1c1b1b]">
            <span className="font-code text-xs font-semibold text-[#c2c6d6] tracking-wider">
              EXPLORER
            </span>
            <span className="material-symbols-outlined text-[16px] text-[#c2c6d6] cursor-pointer hover:text-[#adc6ff]">
              more_horiz
            </span>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* Project Files */}
            <div className="py-2">
              <div className="px-3 py-1 flex items-center gap-2 text-xs font-semibold text-[#e5e2e1] cursor-pointer hover:bg-[#2a2a2a]">
                <span className="material-symbols-outlined text-[16px] text-[#c2c6d6]">
                  expand_more
                </span>
                <span className="font-code text-xs">src</span>
              </div>

              {Object.keys(fileContents).map((file) => {
                const isSelected = activeFile === file;
                const iconColor =
                  file.endsWith(".py")
                    ? "text-[#519aba]"
                    : file.endsWith(".json")
                    ? "text-[#cbcb41]"
                    : "text-[#adc6ff]";

                return (
                  <div
                    key={file}
                    onClick={() => handleOpenFile(file)}
                    className={`pl-8 pr-3 py-1.5 flex items-center gap-2 cursor-pointer transition-colors text-xs font-code ${
                      isSelected
                        ? "bg-[#201f1f] text-[#adc6ff] font-medium border-l-2 border-[#adc6ff]"
                        : "text-[#c2c6d6] hover:bg-[#2a2a2a] hover:text-[#e5e2e1]"
                    }`}
                  >
                    <span className={`material-symbols-outlined text-[16px] ${iconColor}`}>
                      description
                    </span>
                    <span>{file}</span>
                  </div>
                );
              })}
            </div>

            {/* Room Members */}
            <div className="mt-4 border-t border-[#424754]/50 pt-2">
              <div className="px-3 py-1.5 flex items-center justify-between">
                <span className="font-code text-[11px] font-semibold text-[#c2c6d6] tracking-wider">
                  ROOM MEMBERS (3)
                </span>
              </div>

              {/* You */}
              <div className="px-3 py-1.5 flex items-center gap-3 hover:bg-[#201f1f]">
                <div className="relative">
                  <div className="w-6 h-6 rounded bg-[#201f1f] flex items-center justify-center border border-[#424754] text-[10px] font-bold text-[#adc6ff]">
                    YOU
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-[#181818]"></div>
                </div>
                <span className="text-xs text-[#e5e2e1] font-medium">You (Host)</span>
                <span className="text-[10px] text-green-400 bg-green-950/40 px-1.5 py-0.5 rounded border border-green-800/50 ml-auto">
                  Owner
                </span>
              </div>

              {/* Alex */}
              <div className="px-3 py-1.5 flex items-center gap-3 hover:bg-[#201f1f]">
                <div className="relative">
                  <div className="w-6 h-6 rounded bg-[#201f1f] flex items-center justify-center border border-[#adc6ff] text-[10px] font-bold text-[#adc6ff]">
                    A
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-[#181818]"></div>
                </div>
                <span className="text-xs text-[#c2c6d6]">Alex</span>
                <span className="material-symbols-outlined text-[14px] text-[#adc6ff] ml-auto" title="Editing line 14">
                  edit
                </span>
              </div>

              {/* Sam */}
              <div className="px-3 py-1.5 flex items-center gap-3 hover:bg-[#201f1f]">
                <div className="relative">
                  <div className="w-6 h-6 rounded bg-[#201f1f] flex items-center justify-center border border-[#ffb786] text-[10px] font-bold text-[#ffb786]">
                    S
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-[#181818]"></div>
                </div>
                <span className="text-xs text-[#c2c6d6]">Sam</span>
                <span className="material-symbols-outlined text-[14px] text-[#ffb786] ml-auto" title="Viewing line 8">
                  visibility
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Editor Area */}
        <div className="flex-1 flex flex-col bg-[#0a0a0a] min-w-0">
          {/* Notification Toast */}
          {editorNotice && (
            <div className="bg-[#4d8eff]/20 border-b border-[#4d8eff] px-4 py-1.5 text-xs text-[#adc6ff] flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[15px]">check_circle</span>
                {editorNotice}
              </span>
            </div>
          )}

          {/* Editor Tabs */}
          <div className="flex bg-[#121212] border-b border-[#424754]/50 shrink-0 overflow-x-auto">
            {openTabs.map((tab) => {
              const isActive = activeFile === tab;
              return (
                <div
                  key={tab}
                  onClick={() => setActiveFile(tab)}
                  className={`px-4 py-2 border-r border-[#424754]/40 flex items-center gap-2 cursor-pointer transition-colors min-w-[130px] font-code text-xs ${
                    isActive
                      ? "bg-[#0a0a0a] border-t-2 border-t-[#adc6ff] text-[#adc6ff] font-medium"
                      : "text-[#c2c6d6] hover:bg-[#201f1f]"
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px] text-[#519aba]">
                    description
                  </span>
                  <span>{tab}</span>
                  <button
                    onClick={(e) => handleCloseTab(tab, e)}
                    className="ml-auto p-0.5 rounded hover:bg-[#353534] text-[#8c909f] hover:text-[#e5e2e1]"
                  >
                    <span className="material-symbols-outlined text-[13px]">close</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Breadcrumbs */}
          <div className="px-4 py-1 bg-[#0a0a0a] flex items-center gap-1 border-b border-[#2d2d2d] shrink-0 text-[#8c909f] font-code text-xs">
            <span>CodeMesh</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span>src</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-[#e5e2e1]">{activeFile}</span>
          </div>

          {/* Editor Canvas */}
          <div className="flex-1 flex overflow-auto font-code text-sm">
            {/* Line Numbers */}
            <div className="w-12 bg-[#0a0a0a] text-[#424754] text-right pr-4 py-4 select-none border-r border-[#2d2d2d] shrink-0 font-code text-xs flex flex-col leading-[24px]">
              {Array.from({ length: currentFileData.lines }).map((_, idx) => (
                <div
                  key={idx}
                  className={idx + 1 === 8 || idx + 1 === 14 ? "text-[#adc6ff] font-bold" : ""}
                >
                  {idx + 1}
                </div>
              ))}
            </div>

            {/* Code Content */}
            <div className="flex-1 p-4 bg-[#0a0a0a] overflow-x-auto whitespace-pre font-code text-sm leading-[24px] relative">
              {activeFile === "main.py" ? (
                <>
                  <span className="syntax-keyword">import</span> os
                  {"\n"}<span className="syntax-keyword">import</span> sys
                  {"\n"}<span className="syntax-keyword">from</span> typing <span className="syntax-keyword">import</span> List, Dict
                  {"\n\n"}<span className="syntax-comment"># Collaborative cursor processing engine</span>
                  {"\n"}<span className="syntax-keyword">def</span> <span className="syntax-function">process_data_stream</span>(stream_id: str, payload: Dict) -&gt; bool:
                  {"\n"}    <span className="syntax-keyword">try</span>:
                  {"\n"}        buffer_size = payload.get(<span className="syntax-string">&apos;buffer&apos;</span>, <span className="cursor-sam">2048</span>)
                  {"\n"}        <span className="syntax-keyword">if</span> <span className="syntax-keyword">not</span> stream_id:
                  {"\n"}            <span className="syntax-keyword">raise</span> ValueError(<span className="syntax-string">&quot;Stream ID cannot be null&quot;</span>)
                  {"\n"}        
                  {"\n"}        <span className="syntax-comment"># Apply transformations</span>
                  {"\n"}        processed = apply_transforms(payload, buffer_size)
                  {"\n"}        <span className="cursor-alex">r</span>eturn True
                  {"\n"}        
                  {"\n"}    <span className="syntax-keyword">except</span> Exception <span className="syntax-keyword">as</span> e:
                  {"\n"}        logger.error(f<span className="syntax-string">&quot;Stream failure: &#123;e&#125;&quot;</span>)
                  {"\n"}        <span className="syntax-keyword">return</span> False
                </>
              ) : (
                <code>{currentFileData.code}</code>
              )}
            </div>
          </div>

          {/* Bottom Terminal Panel */}
          <div className="h-44 bg-[#0a0a0a] border-t border-[#424754]/50 flex flex-col shrink-0">
            <div className="bg-[#121212] px-4 flex items-center border-b border-[#2d2d2d] shrink-0">
              <button
                onClick={() => setActiveTabPanel("terminal")}
                className={`py-1.5 px-3 font-code text-xs transition-colors ${
                  activeTabPanel === "terminal"
                    ? "border-b-2 border-[#adc6ff] text-[#adc6ff] font-semibold"
                    : "text-[#c2c6d6] hover:text-[#e5e2e1]"
                }`}
              >
                TERMINAL
              </button>
              <button
                onClick={() => setActiveTabPanel("output")}
                className={`py-1.5 px-3 font-code text-xs transition-colors ${
                  activeTabPanel === "output"
                    ? "border-b-2 border-[#adc6ff] text-[#adc6ff] font-semibold"
                    : "text-[#c2c6d6] hover:text-[#e5e2e1]"
                }`}
              >
                OUTPUT
              </button>
              <button
                onClick={() => setActiveTabPanel("problems")}
                className={`py-1.5 px-3 font-code text-xs transition-colors ${
                  activeTabPanel === "problems"
                    ? "border-b-2 border-[#adc6ff] text-[#adc6ff] font-semibold"
                    : "text-[#c2c6d6] hover:text-[#e5e2e1]"
                }`}
              >
                PROBLEMS (0)
              </button>
              <div className="ml-auto flex gap-2">
                <span className="material-symbols-outlined text-[16px] text-[#8c909f] cursor-pointer hover:text-[#adc6ff]">
                  add
                </span>
                <span className="material-symbols-outlined text-[16px] text-[#8c909f] cursor-pointer hover:text-[#adc6ff]">
                  delete
                </span>
              </div>
            </div>

            <div className="flex-1 p-3 font-code text-xs text-[#e5e2e1] overflow-y-auto leading-relaxed">
              {activeTabPanel === "terminal" && (
                <>
                  <div className="text-[#8c909f]">user@codemesh:~/project/src$ python main.py</div>
                  <div className="text-[#adc6ff]">Initializing stream processor...</div>
                  <div className="text-[#d0bcff]">Stream ID connected: {roomId}</div>
                  <div>Processing buffer size 2048... OK</div>
                  <div>Awaiting payload...</div>
                  <div className="text-[#8c909f] mt-1 flex items-center gap-1">
                    <span>user@codemesh:~/project/src$</span>
                    <span className="w-2 h-4 bg-[#adc6ff] inline-block align-middle animate-pulse"></span>
                  </div>
                </>
              )}
              {activeTabPanel === "output" && (
                <div className="text-[#8c909f]">
                  [Supabase Realtime] Connected to broadcast channel &quot;room:{roomId}&quot; (latency: 18ms)
                </div>
              )}
              {activeTabPanel === "problems" && (
                <div className="text-[#8c909f]">No problems detected in the workspace.</div>
              )}
            </div>
          </div>
        </div>

        {/* AI Assistant Panel */}
        {showAIPanel && (
          <div className="w-80 bg-[#181818] border-l border-[#424754]/50 flex flex-col shrink-0">
            <div className="p-3 border-b border-[#424754]/50 flex justify-between items-center bg-[#121212]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#d0bcff] text-[18px]">
                  auto_awesome
                </span>
                <span className="font-code text-xs font-semibold text-[#e5e2e1]">
                  CODEMESH ASSISTANT
                </span>
              </div>
              <button
                onClick={() => setShowAIPanel(false)}
                className="text-[#8c909f] hover:text-[#e5e2e1]"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
              <div className="bg-[#201f1f] text-[#c2c6d6] p-2.5 rounded border border-[#424754]/50 text-xs">
                Context aware of <span className="font-code text-[#adc6ff]">{activeFile}</span>. RAG indexed 42 files in workspace.
              </div>

              {aiChat.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col gap-1.5 ${
                    msg.role === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`p-3 rounded-lg text-xs leading-relaxed max-w-[95%] ${
                      msg.role === "user"
                        ? "bg-[#2a2a2a] text-[#e5e2e1] border border-[#424754]"
                        : "bg-[#121212] text-[#e5e2e1] border-l-2 border-[#d0bcff] shadow-[0_0_10px_rgba(208,188,255,0.05)]"
                    }`}
                  >
                    <p>{msg.text}</p>
                    {msg.code && (
                      <div className="bg-[#0a0a0a] rounded border border-[#424754] p-2 mt-2 font-code text-[11px] overflow-x-auto whitespace-pre">
                        <code>{msg.code}</code>
                      </div>
                    )}
                    {msg.code && (
                      <div className="mt-2.5 flex gap-2">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(msg.code || "");
                            setCopiedCode(true);
                            setTimeout(() => setCopiedCode(false), 2000);
                          }}
                          className="flex items-center gap-1 text-[11px] border border-[#424754] px-2 py-1 rounded hover:bg-[#2a2a2a] transition-colors"
                        >
                          <span className="material-symbols-outlined text-[13px]">
                            {copiedCode ? "check" : "content_copy"}
                          </span>
                          {copiedCode ? "Copied" : "Copy"}
                        </button>
                        <button
                          onClick={handleApplyToEditor}
                          className="flex items-center gap-1 text-[11px] border border-[#d0bcff] text-[#d0bcff] px-2 py-1 rounded hover:bg-[#571bc1]/20 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[13px]">
                            bolt
                          </span>
                          Apply to Editor
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <form
              onSubmit={handleSendPrompt}
              className="p-3 border-t border-[#424754]/50 bg-[#121212]"
            >
              <div className="bg-[#131313] border border-[#424754] rounded focus-within:border-[#d0bcff] flex items-end p-2 transition-colors">
                <textarea
                  className="w-full bg-transparent border-none text-[#e5e2e1] text-xs placeholder-[#8c909f] resize-none focus:outline-none p-1"
                  placeholder="Ask about your code..."
                  rows={2}
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendPrompt(e);
                    }
                  }}
                />
                <button
                  type="submit"
                  disabled={!aiPrompt.trim()}
                  className="p-1 rounded text-[#d0bcff] hover:bg-[#2a2a2a] disabled:opacity-40 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">send</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
