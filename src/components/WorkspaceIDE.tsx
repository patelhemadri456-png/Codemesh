"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Navbar from "./Navbar";
import { WorkspaceFile, RoomMember, AIChatMessage } from "@/types/workspace";
import confetti from "canvas-confetti";

// Dynamically import Monaco Editor to prevent SSR issues
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center bg-[#0a0a0a] text-xs font-code text-[#8c909f]">
      <span className="w-2 h-2 rounded-full bg-[#adc6ff] animate-ping mr-2"></span>
      Initializing Monaco IDE Environment...
    </div>
  ),
});

interface WorkspaceIDEProps {
  roomId?: string;
}

const defaultFiles: WorkspaceFile[] = [
  {
    id: "f1",
    name: "main.py",
    language: "python",
    isEntry: true,
    content: `import os
import sys
import time
from typing import List, Dict

# CodeMesh Real-Time Distributed Processing Engine
def process_data_stream(stream_id: str, payload: Dict) -> bool:
    """
    Executes high-throughput stream processing with collaborative
    AST sync and automated pgvector RAG memory mapping.
    """
    try:
        buffer_size = payload.get('buffer', 2048)
        if not stream_id:
            raise ValueError("Stream ID cannot be null")
        
        print(f"[CodeMesh] Ingesting stream '{stream_id}' with buffer {buffer_size}...")
        
        # Simulated payload processing
        records_processed = len(payload.get('data', [1, 2, 3, 4, 5]))
        print(f"[CodeMesh] Successfully processed {records_processed} records.")
        return True
        
    except Exception as e:
        print(f"[Error] Stream failure: {e}")
        return False

if __name__ == "__main__":
    test_payload = {"buffer": 2048, "data": ["packet_A", "packet_B", "packet_C"]}
    success = process_data_stream("Beta-Omega-9", test_payload)
    print(f"Execution finished with status: {success}")
`,
  },
  {
    id: "f2",
    name: "utils.py",
    language: "python",
    content: `import time
import logging

logger = logging.getLogger("codemesh.stream")

def get_optimal_buffer() -> int:
    """Calculates optimal buffer size based on system concurrency."""
    return 4096

def apply_transforms(data: dict, buffer_size: int) -> dict:
    start_ts = time.time()
    return {
        "buffer_used": buffer_size,
        "latency_ms": round((time.time() - start_ts) * 1000, 3)
    }
`,
  },
  {
    id: "f3",
    name: "config.json",
    language: "json",
    content: `{
  "workspace_id": "beta-omega-9",
  "engine_version": "2.4.1-stable",
  "max_concurrency": 16,
  "telemetry": true,
  "rag_index": {
    "files_indexed": 42,
    "vector_dim": 1536
  }
}
`,
  },
];

export default function WorkspaceIDE({ roomId = "Beta-Omega-9" }: WorkspaceIDEProps) {
  const [files, setFiles] = useState<WorkspaceFile[]>(defaultFiles);
  const [activeFileId, setActiveFileId] = useState<string>("f1");
  const [openTabIds, setOpenTabIds] = useState<string[]>(["f1", "f2"]);
  const [activeTabPanel, setActiveTabPanel] = useState<"terminal" | "output" | "problems">("terminal");
  const [activeActivity, setActiveActivity] = useState<"explorer" | "search" | "git" | "run" | "ai">("explorer");
  const [showAIPanel, setShowAIPanel] = useState(true);
  const [editorNotice, setEditorNotice] = useState<string | null>(null);

  // New File State
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [newFileName, setNewFileName] = useState("");

  // Terminal State
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    "user@codemesh:~/project$ python main.py",
    "[CodeMesh] Ingesting stream 'Beta-Omega-9' with buffer 2048...",
    "[CodeMesh] Successfully processed 3 records.",
    "Execution finished with status: True",
    "user@codemesh:~/project$ ",
  ]);
  const [terminalInput, setTerminalInput] = useState("");
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Members
  const [members] = useState<RoomMember[]>([
    {
      id: "m1",
      name: "You",
      initials: "YOU",
      avatarColor: "#4d8eff",
      status: "active",
      isHost: true,
      currentAction: "editing",
    },
    {
      id: "m2",
      name: "Alex",
      initials: "AL",
      avatarColor: "#adc6ff",
      status: "active",
      activeLine: 14,
      currentAction: "editing",
    },
    {
      id: "m3",
      name: "Sam",
      initials: "SJ",
      avatarColor: "#ffb786",
      status: "active",
      activeLine: 8,
      currentAction: "viewing",
    },
  ]);

  // AI Assistant State
  const [aiPrompt, setAiPrompt] = useState("");
  const [isAILoading, setIsAILoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [aiChat, setAiChat] = useState<AIChatMessage[]>([
    {
      id: "c1",
      role: "assistant",
      text: `Hello! I'm CodeMesh AI Assistant. I have indexed ${files.length} files in this workspace with real-time pgvector RAG memory. How can I assist you with ${roomId}?`,
      timestamp: "Just now",
    },
    {
      id: "c2",
      role: "user",
      text: "Can we optimize the buffer size allocation in main.py?",
      timestamp: "2m ago",
    },
    {
      id: "c3",
      role: "assistant",
      text: "Yes! Currently, buffer size defaults statically to 2048. We can import get_optimal_buffer() from utils.py for dynamic sizing under high concurrency:",
      codeSnippet: `from utils import get_optimal_buffer\n\n# Dynamic Buffer Allocation\nbuffer_size = payload.get('buffer', get_optimal_buffer())\nprint(f"[Optimized] Stream allocated {buffer_size} bytes.")`,
      timestamp: "1m ago",
    },
  ]);

  const activeFile = files.find((f) => f.id === activeFileId) || files[0];

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalHistory]);

  const handleEditorChange = (value: string | undefined) => {
    if (value === undefined) return;
    setFiles((prev) =>
      prev.map((f) => (f.id === activeFileId ? { ...f, content: value } : f))
    );
  };

  const handleOpenFile = (fileId: string) => {
    if (!openTabIds.includes(fileId)) {
      setOpenTabIds([...openTabIds, fileId]);
    }
    setActiveFileId(fileId);
  };

  const handleCloseTab = (fileId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextTabs = openTabIds.filter((id) => id !== fileId);
    if (nextTabs.length > 0) {
      setOpenTabIds(nextTabs);
      if (activeFileId === fileId) {
        setActiveFileId(nextTabs[0]);
      }
    }
  };

  const handleCreateFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;

    const name = newFileName.trim();
    const ext = name.split(".").pop() || "";
    let lang = "python";
    if (["js", "jsx", "ts", "tsx"].includes(ext)) lang = "typescript";
    if (["json"].includes(ext)) lang = "json";
    if (["rs"].includes(ext)) lang = "rust";
    if (["md"].includes(ext)) lang = "markdown";

    const newFile: WorkspaceFile = {
      id: "file_" + Math.random().toString(36).substring(2, 7),
      name,
      language: lang,
      content: `# ${name}\n\n# Created in CodeMesh Workspace\n`,
    };

    setFiles([...files, newFile]);
    setOpenTabIds([...openTabIds, newFile.id]);
    setActiveFileId(newFile.id);
    setIsCreatingFile(false);
    setNewFileName("");
    setEditorNotice(`Created ${name}`);
    setTimeout(() => setEditorNotice(null), 2500);
  };

  const handleDeleteFile = (fileId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (files.length <= 1) return;
    const filtered = files.filter((f) => f.id !== fileId);
    setFiles(filtered);
    const updatedTabs = openTabIds.filter((id) => id !== fileId);
    setOpenTabIds(updatedTabs.length > 0 ? updatedTabs : [filtered[0].id]);
    if (activeFileId === fileId) {
      setActiveFileId(updatedTabs[0] || filtered[0].id);
    }
  };

  // Run Code Command
  const handleRunActiveFile = () => {
    setActiveTabPanel("terminal");
    const timestamp = new Date().toLocaleTimeString();
    setTerminalHistory((prev) => [
      ...prev,
      `user@codemesh:~/project$ python ${activeFile.name}`,
      `[${timestamp}] Launching ${activeFile.name} in container sandbox...`,
      `[Output] Code execution completed successfully. (Return code: 0)`,
      `user@codemesh:~/project$ `,
    ]);
    setEditorNotice(`Executed ${activeFile.name}`);
    setTimeout(() => setEditorNotice(null), 2500);
  };

  // Handle Terminal Commands
  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = terminalInput.trim();
    if (!cmd) return;

    setTerminalInput("");
    const newLogs = [`user@codemesh:~/project$ ${cmd}`];

    if (cmd === "clear") {
      setTerminalHistory(["user@codemesh:~/project$ "]);
      return;
    } else if (cmd === "help") {
      newLogs.push(
        "Available commands in CodeMesh Cloud Shell:",
        "  python <file>   Execute Python script in isolated container",
        "  run             Run current active file",
        "  ls              List all workspace files",
        "  cat <file>      Display contents of a file",
        "  ai <prompt>     Ask CodeMesh RAG assistant via CLI",
        "  clear           Clear terminal window",
        "  share           Get workspace invite link"
      );
    } else if (cmd === "ls") {
      newLogs.push(files.map((f) => f.name).join("   "));
    } else if (cmd.startsWith("cat ")) {
      const targetName = cmd.replace("cat ", "").trim();
      const targetFile = files.find((f) => f.name === targetName);
      if (targetFile) {
        newLogs.push(targetFile.content);
      } else {
        newLogs.push(`cat: ${targetName}: No such file or directory`);
      }
    } else if (cmd.startsWith("python ") || cmd === "run") {
      const fileName = cmd === "run" ? activeFile.name : cmd.replace("python ", "").trim();
      newLogs.push(
        `[CodeMesh Runtime] Executing ${fileName}...`,
        `[Stream ${roomId}] Verified AST checksum & dependencies.`,
        `Program terminated with exit code 0.`
      );
    } else if (cmd.startsWith("ai ")) {
      const prompt = cmd.replace("ai ", "");
      newLogs.push(`[Gemini RAG] Query received: "${prompt}"`, `Analyzing codebase context...`);
      handleSendPromptText(prompt);
    } else if (cmd === "share") {
      navigator.clipboard.writeText(window.location.href);
      newLogs.push(`[Share] Workspace invite link copied to clipboard!`);
    } else {
      newLogs.push(`command not found: ${cmd}. Type 'help' for available commands.`);
    }

    newLogs.push("user@codemesh:~/project$ ");
    setTerminalHistory((prev) => [...prev, ...newLogs]);
  };

  // AI Prompt Handling
  const handleSendPromptText = async (promptText: string) => {
    if (!promptText.trim() || isAILoading) return;

    const userMessage: AIChatMessage = {
      id: "u_" + Date.now(),
      role: "user",
      text: promptText,
      timestamp: "Just now",
    };

    setAiChat((prev) => [...prev, userMessage]);
    setAiPrompt("");
    setIsAILoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptText,
          codeContext: activeFile.content,
          activeFile: activeFile.name,
          allFiles: files.map((f) => ({ name: f.name, content: f.content })),
        }),
      });

      const data = await res.json();
      const assistantMessage: AIChatMessage = {
        id: "a_" + Date.now(),
        role: "assistant",
        text: data.text || "Here is the recommended code implementation:",
        codeSnippet: data.codeSnippet,
        timestamp: "Just now",
      };

      setAiChat((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error(err);
      setAiChat((prev) => [
        ...prev,
        {
          id: "a_" + Date.now(),
          role: "assistant",
          text: `Analyzed ${activeFile.name}. Here is the optimized solution:`,
          codeSnippet: `from utils import get_optimal_buffer\n\nbuffer_size = get_optimal_buffer()`,
          timestamp: "Just now",
        },
      ]);
    } finally {
      setIsAILoading(false);
    }
  };

  const handleApplySnippet = (snippet: string) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === activeFileId
          ? { ...f, content: `${f.content}\n\n# Applied from CodeMesh AI:\n${snippet}\n` }
          : f
      )
    );
    setEditorNotice(`Appended AI patch to ${activeFile.name}!`);
    setTimeout(() => setEditorNotice(null), 3000);
  };

  const handleShareRoom = () => {
    navigator.clipboard.writeText(window.location.href);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.1 } });
    setEditorNotice("Invite link copied to clipboard!");
    setTimeout(() => setEditorNotice(null), 3000);
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#131313] text-[#e5e2e1]">
      {/* Top Navigation */}
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
              title="Explorer (Files & Members)"
            >
              <span className="material-symbols-outlined text-[20px]">folder_open</span>
            </button>

            <button
              onClick={handleRunActiveFile}
              className="w-full flex justify-center py-2.5 text-[#ffb786] hover:bg-[#201f1f] transition-colors"
              title="Run Active File"
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

            <button
              onClick={handleShareRoom}
              className="w-full flex justify-center py-2.5 text-[#adc6ff] hover:bg-[#201f1f] transition-colors"
              title="Share Invite Link"
            >
              <span className="material-symbols-outlined text-[20px]">share</span>
            </button>
          </div>

          <div className="mt-auto flex flex-col gap-3 w-full pb-2">
            <div
              className="w-7 h-7 rounded-full bg-[#4d8eff] flex items-center justify-center mx-auto text-xs font-bold text-white shadow"
              title="You (Online)"
            >
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
            <button
              onClick={() => setIsCreatingFile(!isCreatingFile)}
              className="p-1 rounded text-[#c2c6d6] hover:text-[#adc6ff] hover:bg-[#2a2a2a] transition-colors"
              title="New File"
            >
              <span className="material-symbols-outlined text-[17px]">note_add</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* New File Inline Input */}
            {isCreatingFile && (
              <form onSubmit={handleCreateFile} className="p-2 bg-[#201f1f] border-b border-[#424754]">
                <input
                  type="text"
                  placeholder="e.g. server.py"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  autoFocus
                  className="w-full bg-[#121212] border border-[#adc6ff] rounded px-2 py-1 font-code text-xs text-[#e5e2e1] focus:outline-none"
                />
              </form>
            )}

            {/* Project Files */}
            <div className="py-2">
              <div className="px-3 py-1 flex items-center gap-2 text-xs font-semibold text-[#e5e2e1]">
                <span className="material-symbols-outlined text-[16px] text-[#c2c6d6]">
                  expand_more
                </span>
                <span className="font-code text-xs">src/</span>
              </div>

              {files.map((file) => {
                const isSelected = activeFileId === file.id;
                const iconColor =
                  file.name.endsWith(".py")
                    ? "text-[#519aba]"
                    : file.name.endsWith(".json")
                    ? "text-[#cbcb41]"
                    : file.name.endsWith(".rs")
                    ? "text-[#ffb786]"
                    : "text-[#adc6ff]";

                return (
                  <div
                    key={file.id}
                    onClick={() => handleOpenFile(file.id)}
                    className={`pl-8 pr-3 py-1.5 flex items-center gap-2 cursor-pointer transition-colors text-xs font-code group ${
                      isSelected
                        ? "bg-[#201f1f] text-[#adc6ff] font-medium border-l-2 border-[#adc6ff]"
                        : "text-[#c2c6d6] hover:bg-[#2a2a2a] hover:text-[#e5e2e1]"
                    }`}
                  >
                    <span className={`material-symbols-outlined text-[16px] ${iconColor}`}>
                      description
                    </span>
                    <span className="flex-1 truncate">{file.name}</span>
                    {files.length > 1 && (
                      <button
                        onClick={(e) => handleDeleteFile(file.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-red-400 transition-opacity"
                        title="Delete file"
                      >
                        <span className="material-symbols-outlined text-[14px]">delete</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Room Members */}
            <div className="mt-4 border-t border-[#424754]/50 pt-2">
              <div className="px-3 py-1.5 flex items-center justify-between">
                <span className="font-code text-[11px] font-semibold text-[#c2c6d6] tracking-wider">
                  COLLABORATORS ({members.length})
                </span>
              </div>

              {members.map((m) => (
                <div
                  key={m.id}
                  className="px-3 py-1.5 flex items-center gap-3 hover:bg-[#201f1f] transition-colors"
                >
                  <div className="relative">
                    <div
                      className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold border"
                      style={{
                        backgroundColor: m.avatarColor,
                        borderColor: m.avatarColor,
                        color: m.initials === "YOU" ? "#ffffff" : "#00285d",
                      }}
                    >
                      {m.initials}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-[#181818]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-[#e5e2e1] font-medium leading-none">
                      {m.name} {m.isHost && "(Host)"}
                    </span>
                    {m.activeLine && (
                      <span className="text-[10px] text-[#8c909f] font-code">
                        line {m.activeLine}
                      </span>
                    )}
                  </div>
                  <span
                    className={`material-symbols-outlined text-[14px] ml-auto ${
                      m.currentAction === "editing" ? "text-[#adc6ff]" : "text-[#8c909f]"
                    }`}
                  >
                    {m.currentAction === "editing" ? "edit" : "visibility"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center Monaco Editor Area */}
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
            {openTabIds.map((tabId) => {
              const file = files.find((f) => f.id === tabId);
              if (!file) return null;
              const isActive = activeFileId === tabId;
              return (
                <div
                  key={tabId}
                  onClick={() => setActiveFileId(tabId)}
                  className={`px-4 py-2 border-r border-[#424754]/40 flex items-center gap-2 cursor-pointer transition-colors min-w-[130px] font-code text-xs ${
                    isActive
                      ? "bg-[#0a0a0a] border-t-2 border-t-[#adc6ff] text-[#adc6ff] font-medium"
                      : "text-[#c2c6d6] hover:bg-[#201f1f]"
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px] text-[#519aba]">
                    description
                  </span>
                  <span>{file.name}</span>
                  <button
                    onClick={(e) => handleCloseTab(tabId, e)}
                    className="ml-auto p-0.5 rounded hover:bg-[#353534] text-[#8c909f] hover:text-[#e5e2e1]"
                  >
                    <span className="material-symbols-outlined text-[13px]">close</span>
                  </button>
                </div>
              );
            })}

            {/* Run Button in Tab Bar */}
            <div className="ml-auto flex items-center pr-3">
              <button
                onClick={handleRunActiveFile}
                className="bg-[#001a42] border border-[#00285d] text-[#adc6ff] px-2.5 py-1 rounded font-code text-xs hover:bg-[#00285d] transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[15px]">play_arrow</span>
                <span>Run</span>
              </button>
            </div>
          </div>

          {/* Breadcrumbs */}
          <div className="px-4 py-1 bg-[#0a0a0a] flex items-center gap-1 border-b border-[#2d2d2d] shrink-0 text-[#8c909f] font-code text-xs">
            <span>CodeMesh</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span>src</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-[#e5e2e1]">{activeFile.name}</span>
          </div>

          {/* Monaco Editor Container */}
          <div className="flex-1 min-h-0 relative">
            <MonacoEditor
              height="100%"
              language={activeFile.language}
              value={activeFile.content}
              theme="vs-dark"
              onChange={handleEditorChange}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: "'JetBrains Mono', monospace",
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                cursorBlinking: "smooth",
                smoothScrolling: true,
                padding: { top: 12 },
              }}
            />
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
                <button
                  onClick={() => setTerminalHistory(["user@codemesh:~/project$ "])}
                  className="material-symbols-outlined text-[16px] text-[#8c909f] hover:text-[#adc6ff]"
                  title="Clear Terminal"
                >
                  delete
                </button>
              </div>
            </div>

            <div className="flex-1 p-3 font-code text-xs text-[#e5e2e1] overflow-y-auto leading-relaxed">
              {activeTabPanel === "terminal" && (
                <div>
                  {terminalHistory.map((line, idx) => (
                    <div key={idx} className="whitespace-pre-wrap">
                      {line.startsWith("user@codemesh") ? (
                        <span className="text-[#8c909f]">{line}</span>
                      ) : line.includes("[CodeMesh]") || line.includes("✓") ? (
                        <span className="text-[#adc6ff]">{line}</span>
                      ) : line.includes("[Error]") ? (
                        <span className="text-red-400">{line}</span>
                      ) : (
                        <span>{line}</span>
                      )}
                    </div>
                  ))}
                  <form onSubmit={handleTerminalSubmit} className="flex items-center gap-1 mt-1">
                    <span className="text-[#8c909f]">user@codemesh:~/project$</span>
                    <input
                      type="text"
                      value={terminalInput}
                      onChange={(e) => setTerminalInput(e.target.value)}
                      placeholder="type 'help' or 'run'..."
                      className="flex-1 bg-transparent border-none text-[#adc6ff] font-code text-xs focus:outline-none p-0"
                    />
                  </form>
                  <div ref={terminalEndRef} />
                </div>
              )}

              {activeTabPanel === "output" && (
                <div className="text-[#8c909f] space-y-1">
                  <div>[CodeMesh Realtime] Broadcast connected to channel: room_{roomId}</div>
                  <div>[Memory Graph] pgvector indexing active across {files.length} project files.</div>
                  <div>[Gemini Engine] Model &apos;gemini-2.0-flash&apos; ready for contextual AST queries.</div>
                </div>
              )}

              {activeTabPanel === "problems" && (
                <div className="text-[#8c909f]">No syntax errors or lint warnings found.</div>
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

            {/* AI Quick Prompts */}
            <div className="p-2.5 border-b border-[#424754]/40 bg-[#1c1b1b] flex flex-wrap gap-1.5">
              <button
                onClick={() => handleSendPromptText(`Explain the code in ${activeFile.name}`)}
                className="text-[10px] font-code bg-[#2a2a2a] hover:bg-[#353534] text-[#c2c6d6] px-2 py-0.5 rounded border border-[#424754]"
              >
                Explain Code
              </button>
              <button
                onClick={() => handleSendPromptText(`Optimize performance and concurrency in ${activeFile.name}`)}
                className="text-[10px] font-code bg-[#2a2a2a] hover:bg-[#353534] text-[#c2c6d6] px-2 py-0.5 rounded border border-[#424754]"
              >
                Optimize
              </button>
              <button
                onClick={() => handleSendPromptText(`Write unit tests for ${activeFile.name}`)}
                className="text-[10px] font-code bg-[#2a2a2a] hover:bg-[#353534] text-[#c2c6d6] px-2 py-0.5 rounded border border-[#424754]"
              >
                Generate Tests
              </button>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
              <div className="bg-[#201f1f] text-[#c2c6d6] p-2.5 rounded border border-[#424754]/50 text-xs">
                Context aware of <span className="font-code text-[#adc6ff]">{activeFile.name}</span>. RAG indexed {files.length} files in workspace.
              </div>

              {aiChat.map((msg, idx) => (
                <div
                  key={msg.id || idx}
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
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    {msg.codeSnippet && (
                      <div className="bg-[#0a0a0a] rounded border border-[#424754] p-2 mt-2 font-code text-[11px] overflow-x-auto whitespace-pre">
                        <code>{msg.codeSnippet}</code>
                      </div>
                    )}
                    {msg.codeSnippet && (
                      <div className="mt-2.5 flex gap-2">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(msg.codeSnippet || "");
                            setCopiedIndex(idx);
                            setTimeout(() => setCopiedIndex(null), 2000);
                          }}
                          className="flex items-center gap-1 text-[11px] border border-[#424754] px-2 py-1 rounded hover:bg-[#2a2a2a] transition-colors"
                        >
                          <span className="material-symbols-outlined text-[13px]">
                            {copiedIndex === idx ? "check" : "content_copy"}
                          </span>
                          {copiedIndex === idx ? "Copied" : "Copy"}
                        </button>
                        <button
                          onClick={() => handleApplySnippet(msg.codeSnippet!)}
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

              {isAILoading && (
                <div className="bg-[#121212] text-[#adc6ff] p-3 rounded-lg border-l-2 border-[#d0bcff] text-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#d0bcff] animate-ping" />
                  Generating Gemini RAG code response...
                </div>
              )}
            </div>

            {/* AI Prompt Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendPromptText(aiPrompt);
              }}
              className="p-3 border-t border-[#424754]/50 bg-[#121212]"
            >
              <div className="bg-[#131313] border border-[#424754] rounded focus-within:border-[#d0bcff] flex items-end p-2 transition-colors">
                <textarea
                  className="w-full bg-transparent border-none text-[#e5e2e1] text-xs placeholder-[#8c909f] resize-none focus:outline-none p-1"
                  placeholder="Ask about your code or architecture..."
                  rows={2}
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendPromptText(aiPrompt);
                    }
                  }}
                />
                <button
                  type="submit"
                  disabled={!aiPrompt.trim() || isAILoading}
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
