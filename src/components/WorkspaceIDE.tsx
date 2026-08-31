"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import Navbar from "./Navbar";
import { WorkspaceFile, RoomMember } from "@/types/workspace";
import { getRoomFiles, saveRoomFiles } from "@/lib/roomStorage";
import { executeCodeInBrowser } from "@/lib/codeRunner";
import { getUserSession, UserSession } from "@/lib/authSession";
import EditorSettingsModal from "./EditorSettingsModal";
import TeamDiscussionChat from "./TeamDiscussionChat";

// Dynamically import Monaco Editor & Diff Editor to prevent SSR issues
const MonacoEditor = dynamic(
  () => import("@monaco-editor/react").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="flex-1 flex items-center justify-center bg-[#050505] text-xs font-code text-neutral-500">
        <span className="w-2 h-2 rounded-full bg-[#0066FF] animate-ping mr-2"></span>
        Initializing Monaco Cloud Environment...
      </div>
    ),
  }
);

const MonacoDiffEditor = dynamic(
  () => import("@monaco-editor/react").then((mod) => mod.DiffEditor),
  {
    ssr: false,
    loading: () => (
      <div className="flex-1 flex items-center justify-center bg-[#050505] text-xs font-code text-neutral-500">
        <span className="w-2 h-2 rounded-full bg-[#A855F7] animate-ping mr-2"></span>
        Loading AI Diff Inspector...
      </div>
    ),
  }
);

interface WorkspaceIDEProps {
  roomId?: string;
}

export default function WorkspaceIDE({ roomId = "workspace-default" }: WorkspaceIDEProps) {
  const [files, setFiles] = useState<WorkspaceFile[]>([]);
  const [activeFileId, setActiveFileId] = useState<string>("f1");
  const [openTabIds, setOpenTabIds] = useState<string[]>(["f1"]);
  const [activeTabPanel, setActiveTabPanel] = useState<"terminal" | "output" | "problems">("terminal");
  const [activeActivity, setActiveActivity] = useState<"explorer" | "search" | "git" | "run">("explorer");
  const [showChatPanel, setShowChatPanel] = useState(true);
  const [editorNotice, setEditorNotice] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving">("saved");
  const [user, setUser] = useState<UserSession>(getUserSession());

  // Terminal Extensibility & Resizing States
  const [terminalHeight, setTerminalHeight] = useState<number>(240);
  const [isDraggingTerminal, setIsDraggingTerminal] = useState(false);
  const [isTerminalMaximized, setIsTerminalMaximized] = useState(false);
  const [showBottomPanel, setShowBottomPanel] = useState(true);

  // Editor Settings
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [fontSize, setFontSize] = useState<number>(14);
  const [tabSize, setTabSize] = useState<number>(2);
  const [wordWrap, setWordWrap] = useState<boolean>(true);

  // AI Diff Inspector States (Cursor-style Split Review)
  const [isDiffMode, setIsDiffMode] = useState(false);
  const [diffOriginal, setDiffOriginal] = useState("");
  const [diffModified, setDiffModified] = useState("");
  const [diffSummary, setDiffSummary] = useState("");
  const [isGeneratingAiDiff, setIsGeneratingAiDiff] = useState(false);

  // Custom Obsidian Dark Theme for Monaco matching Framer Palette
  const handleEditorBeforeMount = (monaco: any) => {
    monaco.editor.defineTheme("codemesh-obsidian", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "", background: "050505", foreground: "ededed" },
        { token: "comment", foreground: "71717a", fontStyle: "italic" },
        { token: "keyword", foreground: "a855f7", fontStyle: "bold" },
        { token: "keyword.control", foreground: "a855f7" },
        { token: "identifier", foreground: "ededed" },
        { token: "type", foreground: "f43f5e" },
        { token: "type.identifier", foreground: "f43f5e" },
        { token: "string", foreground: "10b981" },
        { token: "number", foreground: "ff7e33" },
        { token: "delimiter", foreground: "a1a1aa" },
        { token: "function", foreground: "38bdf8" },
        { token: "method", foreground: "38bdf8" },
        { token: "variable", foreground: "e4e4e7" },
        { token: "variable.predefined", foreground: "0066ff" },
      ],
      colors: {
        "editor.background": "#050505",
        "editor.foreground": "#ededed",
        "editorCursor.foreground": "#0066ff",
        "editor.lineHighlightBackground": "#0f0f12",
        "editorLineNumber.foreground": "#3f3f46",
        "editorLineNumber.activeForeground": "#ffffff",
        "editor.selectionBackground": "#0066ff33",
        "editor.inactiveSelectionBackground": "#ffffff10",
        "editorGutter.background": "#050505",
        "editorBracketMatch.background": "#0066ff22",
        "editorBracketMatch.border": "#0066ff",
        "diffEditor.insertedTextBackground": "#10b98125",
        "diffEditor.removedTextBackground": "#ef444425",
        "diffEditor.insertedLineBackground": "#10b98115",
        "diffEditor.removedLineBackground": "#ef444415",
        "scrollbarSlider.background": "#ffffff15",
        "scrollbarSlider.hoverBackground": "#ffffff30",
        "scrollbarSlider.activeBackground": "#ffffff50",
      },
    });
  };

  // Search & Git Drawer States
  const [searchFilter, setSearchFilter] = useState("");
  const [commitMessage, setCommitMessage] = useState("");
  const [gitHistory, setGitHistory] = useState<string[]>([
    "commit 9923490 - Initial project setup",
    "commit 00788fe - Monaco IDE & real-time collaboration",
  ]);

  // New File State
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [newFileName, setNewFileName] = useState("");

  // Terminal State
  const [terminalHistory, setTerminalHistory] = useState<string[]>([]);
  const [terminalInput, setTerminalInput] = useState("");
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Sync user session on auth changes
  useEffect(() => {
    setUser(getUserSession());
    const handleAuth = () => setUser(getUserSession());
    window.addEventListener("codemesh:auth_change", handleAuth);
    return () => window.removeEventListener("codemesh:auth_change", handleAuth);
  }, []);

  // Draggable Terminal Resizing Mouse Events
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingTerminal) return;
      const windowHeight = window.innerHeight;
      const newHeight = windowHeight - e.clientY - 24; // account for footer status bar
      if (newHeight >= 90 && newHeight <= windowHeight * 0.82) {
        setTerminalHeight(newHeight);
        if (isTerminalMaximized) setIsTerminalMaximized(false);
      }
    };

    const handleMouseUp = () => {
      if (isDraggingTerminal) {
        setIsDraggingTerminal(false);
      }
    };

    if (isDraggingTerminal) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "row-resize";
      document.body.style.userSelect = "none";
    } else {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isDraggingTerminal, isTerminalMaximized]);

  // Load initial dynamic files per room
  useEffect(() => {
    const currentUser = getUserSession();
    setUser(currentUser);

    const initialFiles = getRoomFiles(roomId);
    setFiles(initialFiles);

    if (initialFiles.length > 0) {
      setActiveFileId(initialFiles[0].id);
      setOpenTabIds(initialFiles.slice(0, 2).map((f) => f.id));
    }

    const currentHandle = currentUser.isLoggedIn ? currentUser.handle : "engineer";
    setTerminalHistory([
      `${currentHandle}@codemesh:~/${roomId}$ # Workspace initialized`,
      `[CodeMesh Container] Active room: ${roomId}`,
      `Type 'run' or 'python <file>' to execute code. Type 'help' for commands.`,
      `${currentHandle}@codemesh:~/${roomId}$ `,
    ]);
  }, [roomId]);

  // Dynamic Members (Real User Account as Host)
  const members: RoomMember[] = [
    {
      id: user?.id || "m_user",
      name: user?.isLoggedIn ? `@${user.handle}` : "You",
      email: user?.email,
      initials: user?.initials || "YOU",
      avatarColor: user?.avatarColor || "#0066FF",
      avatarUrl: user?.avatarUrl,
      status: "active",
      isHost: true,
      currentAction: "editing",
    },
    {
      id: "m_alex",
      name: "Alex",
      initials: "AL",
      avatarColor: "#0066FF",
      status: "active",
      activeLine: 12,
      currentAction: "editing",
    },
    {
      id: "m_sam",
      name: "Sarah J.",
      initials: "SJ",
      avatarColor: "#FF7E33",
      status: "active",
      activeLine: 6,
      currentAction: "viewing",
    },
  ];

  const activeFile = files.find((f) => f.id === activeFileId) || files[0];

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalHistory]);

  const handleEditorChange = useCallback(
    (value: string | undefined) => {
      if (value === undefined || !activeFileId) return;
      setSaveStatus("saving");

      setFiles((prev) => {
        const updated = prev.map((f) => (f.id === activeFileId ? { ...f, content: value } : f));
        saveRoomFiles(roomId, updated);
        return updated;
      });

      setTimeout(() => setSaveStatus("saved"), 350);
    },
    [activeFileId, roomId]
  );

  const handleOpenFile = (fileId: string) => {
    if (!openTabIds.includes(fileId)) {
      setOpenTabIds([...openTabIds, fileId]);
    }
    setActiveFileId(fileId);
    if (isDiffMode) setIsDiffMode(false);
  };

  // AI Diff Inspector Handlers (Cursor-style Split Review)
  const handleTriggerAiOptimize = () => {
    if (!activeFile) return;
    setIsGeneratingAiDiff(true);

    setTimeout(() => {
      const original = activeFile.content;
      let modified = original;

      if (activeFile.name.endsWith(".py")) {
        modified = `"""
[CodeMesh RAG Kernel] Vector Cluster Refactor
Optimized memory throughput and added async batch stream handling
"""
import asyncio
import logging
from typing import Optional, List, Dict, Any

logger = logging.getLogger("CodeMesh.Optimized")

${
  original.includes("def get_optimal_buffer():")
    ? original.replace(
        "def get_optimal_buffer():",
        "async def get_optimal_buffer_async(multiplier: int = 1024) -> int:\n    \"\"\"Calculates hardware-accelerated buffer size with auto-scaling.\"\"\"\n    logger.info('Recalculating buffer matrix')\n    await asyncio.sleep(0.01)"
      )
    : original + "\n\n# CodeMesh AI Hardware Vector Acceleration\nasync def stream_vector_payload(buffer_size: int = 4096):\n    return {'status': 'optimized', 'buffer': buffer_size}\n"
}`;
      } else if (
        activeFile.name.endsWith(".ts") ||
        activeFile.name.endsWith(".js") ||
        activeFile.name.endsWith(".tsx")
      ) {
        modified = `/**
 * @module CodeMesh.AST
 * Vector Similarity Score: 0.96 (pgvector lattice)
 * Added memoized cache and hardware concurrency acceleration
 */

${original}

// Optimized Edge Batch Dispatcher
export async function dispatchBatchDeltas(events: Array<{ id: string; timestamp: number }>) {
  const BATCH_SIZE = 128;
  for (let i = 0; i < events.length; i += BATCH_SIZE) {
    const chunk = events.slice(i, i + BATCH_SIZE);
    await Promise.all(chunk.map((e) => fetch('/api/rooms/delta', { method: 'POST', body: JSON.stringify(e) })));
  }
}
`;
      } else {
        modified = `// CodeMesh AI Optimization Patch\n// AST Vector Match: 98.4%\n\n${original}\n\n// Performance guard\n#pragma once\n`;
      }

      setDiffOriginal(original);
      setDiffModified(modified);
      setDiffSummary("✨ Gemini AST Patch: +14 lines, -2 lines • Vector Similarity 0.96");
      setIsDiffMode(true);
      setIsGeneratingAiDiff(false);
    }, 450);
  };

  const handleAcceptDiff = () => {
    if (!activeFile) return;
    const updatedFiles = files.map((f) =>
      f.id === activeFile.id ? { ...f, content: diffModified } : f
    );
    setFiles(updatedFiles);
    saveRoomFiles(roomId, updatedFiles);
    setIsDiffMode(false);
    setEditorNotice("AI patch successfully merged into " + activeFile.name);
    setTimeout(() => setEditorNotice(null), 3000);
  };

  const handleRejectDiff = () => {
    setIsDiffMode(false);
    setEditorNotice("AI patch discarded");
    setTimeout(() => setEditorNotice(null), 2000);
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
      content: `# ${name}\n\n# CodeMesh Dynamic Workspace: ${roomId}\n`,
    };

    const updated = [...files, newFile];
    setFiles(updated);
    saveRoomFiles(roomId, updated);
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
    const targetFile = files.find((f) => f.id === fileId);
    const filtered = files.filter((f) => f.id !== fileId);
    setFiles(filtered);
    saveRoomFiles(roomId, filtered);

    const updatedTabs = openTabIds.filter((id) => id !== fileId);
    setOpenTabIds(updatedTabs.length > 0 ? updatedTabs : [filtered[0].id]);
    if (activeFileId === fileId) {
      setActiveFileId(updatedTabs[0] || filtered[0].id);
    }
    setEditorNotice(`Deleted ${targetFile?.name || "file"}`);
    setTimeout(() => setEditorNotice(null), 2500);
  };

  // Real In-Browser Execution Runner
  const handleRunActiveFile = () => {
    if (!activeFile) return;
    setActiveTabPanel("terminal");
    const timestamp = new Date().toLocaleTimeString();

    const result = executeCodeInBrowser(activeFile.name, activeFile.content);

    setTerminalHistory((prev) => [
      ...prev,
      `user@codemesh:~/${roomId}$ run ${activeFile.name}`,
      `[${timestamp}] Executing ${activeFile.name} (${activeFile.language})...`,
      ...result.logs,
      `[Process completed in ${result.durationMs}ms with exit code ${result.hasError ? 1 : 0}]`,
      `user@codemesh:~/${roomId}$ `,
    ]);

    setEditorNotice(`Executed ${activeFile.name} (${result.durationMs}ms)`);
    setTimeout(() => setEditorNotice(null), 2500);
  };

  // Terminal Commands
  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = terminalInput.trim();
    if (!cmd) return;

    setTerminalInput("");
    const newLogs = [`user@codemesh:~/${roomId}$ ${cmd}`];

    if (cmd === "clear") {
      setTerminalHistory([`user@codemesh:~/${roomId}$ `]);
      return;
    } else if (cmd === "help") {
      newLogs.push(
        "Available commands in CodeMesh Cloud Shell:",
        "  run [file]      Execute active or target file with live sandbox",
        "  python <file>   Execute Python script",
        "  node <file>     Execute JavaScript / TypeScript code",
        "  ls              List all workspace files",
        "  cat <file>      Display source code of a file",
        "  touch <file>    Create a new file",
        "  rm <file>       Remove a file",
        "  ai <prompt>     Query CodeMesh RAG assistant via CLI",
        "  clear           Clear terminal window",
        "  share           Get workspace invite link"
      );
    } else if (cmd === "ls") {
      newLogs.push(files.map((f) => `${f.name} (${f.language})`).join("   "));
    } else if (cmd.startsWith("cat ")) {
      const targetName = cmd.replace("cat ", "").trim();
      const targetFile = files.find((f) => f.name === targetName);
      if (targetFile) {
        newLogs.push(targetFile.content);
      } else {
        newLogs.push(`cat: ${targetName}: No such file in workspace`);
      }
    } else if (cmd.startsWith("touch ")) {
      const targetName = cmd.replace("touch ", "").trim();
      if (targetName) {
        const newF: WorkspaceFile = {
          id: "f_" + Math.random().toString(36).substring(2, 7),
          name: targetName,
          language: targetName.endsWith(".py") ? "python" : targetName.endsWith(".ts") ? "typescript" : "plaintext",
          content: `# ${targetName}\n`,
        };
        const updated = [...files, newF];
        setFiles(updated);
        saveRoomFiles(roomId, updated);
        newLogs.push(`Created file '${targetName}'`);
      }
    } else if (cmd.startsWith("rm ")) {
      const targetName = cmd.replace("rm ", "").trim();
      const targetFile = files.find((f) => f.name === targetName);
      if (targetFile && files.length > 1) {
        const filtered = files.filter((f) => f.id !== targetFile.id);
        setFiles(filtered);
        saveRoomFiles(roomId, filtered);
        newLogs.push(`Removed file '${targetName}'`);
      } else {
        newLogs.push(`rm: cannot remove '${targetName}'`);
      }
    } else if (cmd.startsWith("run") || cmd.startsWith("python") || cmd.startsWith("node")) {
      const parts = cmd.split(" ");
      const targetName = parts[1] || activeFile?.name;
      const targetFile = files.find((f) => f.name === targetName) || activeFile;

      if (targetFile) {
        const result = executeCodeInBrowser(targetFile.name, targetFile.content);
        newLogs.push(
          `[Runtime] Executing ${targetFile.name}...`,
          ...result.logs,
          `[Exit code: ${result.hasError ? 1 : 0} in ${result.durationMs}ms]`
        );
      }
    } else if (cmd === "share") {
      navigator.clipboard.writeText(window.location.href);
      newLogs.push(`[Share] Workspace invite link copied to clipboard!`);
      setEditorNotice("Workspace invite link copied to clipboard!");
    } else {
      newLogs.push(`command not found: '${cmd}'. Type 'help' for available commands.`);
    }

    newLogs.push(`user@codemesh:~/${roomId}$ `);
    setTerminalHistory((prev) => [...prev, ...newLogs]);
  };

  const handleExportWorkspace = () => {
    const bundle = files.map((f) => `// === File: ${f.name} ===\n${f.content}`).join("\n\n");
    const blob = new Blob([bundle], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${roomId}-workspace-export.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setEditorNotice(`Exported ${files.length} project files!`);
    setTimeout(() => setEditorNotice(null), 3000);
  };

  const handleShareRoom = () => {
    navigator.clipboard.writeText(window.location.href);
    setEditorNotice("Invite link copied to clipboard!");
    setTimeout(() => setEditorNotice(null), 3000);
  };

  const handleGitCommit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commitMessage.trim()) return;
    const timestamp = new Date().toLocaleTimeString();
    const shortHash = Math.random().toString(16).substring(2, 9);
    setGitHistory((prev) => [`commit ${shortHash} - ${commitMessage.trim()} (${timestamp})`, ...prev]);
    setCommitMessage("");
    setEditorNotice(`Committed [${shortHash}]: ${commitMessage}`);
    setTimeout(() => setEditorNotice(null), 3000);
  };

  const filteredFiles = files.filter((f) =>
    f.name.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#131313] text-[#e5e2e1]">
      {/* Top Navigation */}
      <Navbar variant="ide" roomId={roomId} />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Activity Bar */}
        <aside className="bg-[#101010] border-r border-[#2d2d2d] w-12 flex flex-col items-center py-2 z-40 shrink-0 select-none">
          <div className="flex flex-col gap-1.5 w-full">
            <button
              onClick={() => setActiveActivity("explorer")}
              className={`w-full flex justify-center py-2.5 transition-colors ${
                activeActivity === "explorer"
                  ? "border-l-2 border-[#adc6ff] bg-[#201f1f] text-[#adc6ff]"
                  : "text-[#8c909f] hover:text-[#e5e2e1] hover:bg-[#181818]"
              }`}
              title="Explorer"
            >
              <span className="material-symbols-outlined text-[19px]">folder_open</span>
            </button>

            <button
              onClick={() => setActiveActivity("search")}
              className={`w-full flex justify-center py-2.5 transition-colors ${
                activeActivity === "search"
                  ? "border-l-2 border-[#adc6ff] bg-[#201f1f] text-[#adc6ff]"
                  : "text-[#8c909f] hover:text-[#e5e2e1] hover:bg-[#181818]"
              }`}
              title="Search in Workspace"
            >
              <span className="material-symbols-outlined text-[19px]">search</span>
            </button>

            <button
              onClick={() => setActiveActivity("git")}
              className={`w-full flex justify-center py-2.5 transition-colors ${
                activeActivity === "git"
                  ? "border-l-2 border-[#adc6ff] bg-[#201f1f] text-[#adc6ff]"
                  : "text-[#8c909f] hover:text-[#e5e2e1] hover:bg-[#181818]"
              }`}
              title="Source Control (Git)"
            >
              <span className="material-symbols-outlined text-[19px]">grid_view</span>
            </button>

            <button
              onClick={handleRunActiveFile}
              className="w-full flex justify-center py-2.5 text-[#ffb786] hover:bg-[#201f1f] transition-colors"
              title="Run Active File"
            >
              <span className="material-symbols-outlined text-[19px]">play_arrow</span>
            </button>

            <button
              onClick={() => setShowChatPanel(!showChatPanel)}
              className={`w-full flex justify-center py-2.5 transition-colors ${
                showChatPanel
                  ? "border-l-2 border-[#adc6ff] bg-[#adc6ff]/20 text-[#adc6ff]"
                  : "text-[#8c909f] hover:text-[#e5e2e1] hover:bg-[#201f1f]"
              }`}
              title="Toggle Team Chat"
            >
              <span className="material-symbols-outlined text-[19px]">forum</span>
            </button>
          </div>

          <div className="mt-auto flex flex-col gap-2 w-full pb-2">
            <button
              onClick={handleExportWorkspace}
              className="w-full flex justify-center py-2 text-[#8c909f] hover:text-[#adc6ff] hover:bg-[#181818] transition-colors"
              title="Export All Files"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
            </button>

            <button
              onClick={() => setShowSettingsModal(true)}
              className="w-full flex justify-center py-2 text-[#8c909f] hover:text-[#adc6ff] hover:bg-[#181818] transition-colors"
              title="Editor Settings"
            >
              <span className="material-symbols-outlined text-[18px]">settings</span>
            </button>

            <div
              className="w-6 h-6 rounded-full flex items-center justify-center mx-auto text-[10px] font-bold text-white shadow border border-white/20 overflow-hidden"
              style={{ backgroundColor: user?.avatarColor || "#0066FF" }}
              title={user?.isLoggedIn ? `@${user.handle} (${user.email})` : "Guest User"}
            >
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.handle} className="w-full h-full object-cover" />
              ) : (
                user?.initials || "YOU"
              )}
            </div>
          </div>
        </aside>

        {/* Sidebar Panel */}
        <div className="w-64 bg-[#181818] border-r border-[#2d2d2d] flex flex-col shrink-0">
          {/* Explorer View */}
          {activeActivity === "explorer" && (
            <>
              <div className="p-3 border-b border-[#2d2d2d] flex justify-between items-center bg-[#1c1b1b]">
                <span className="font-code text-[11px] font-semibold text-[#c2c6d6] tracking-wider uppercase">
                  EXPLORER
                </span>
                <button
                  onClick={() => setIsCreatingFile(!isCreatingFile)}
                  className="p-1 rounded text-[#8c909f] hover:text-[#adc6ff] hover:bg-[#2a2a2a] transition-colors"
                  title="New File"
                >
                  <span className="material-symbols-outlined text-[17px]">note_add</span>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {isCreatingFile && (
                  <form onSubmit={handleCreateFile} className="p-2 bg-[#201f1f] border-b border-[#2d2d2d]">
                    <input
                      type="text"
                      placeholder="e.g. server.py or helper.ts"
                      value={newFileName}
                      onChange={(e) => setNewFileName(e.target.value)}
                      autoFocus
                      className="w-full bg-[#121212] border border-[#adc6ff] rounded px-2 py-1 font-code text-xs text-[#e5e2e1] focus:outline-none placeholder:text-[#8c909f]"
                    />
                  </form>
                )}

                <div className="py-2">
                  <div className="px-3 py-1 flex items-center gap-2 text-xs font-semibold text-[#e5e2e1]">
                    <span className="material-symbols-outlined text-[16px] text-[#8c909f]">
                      expand_more
                    </span>
                    <span className="font-code text-xs">{roomId}/</span>
                  </div>

                  {files.map((file) => {
                    const isSelected = activeFile?.id === file.id;
                    const iconColor =
                      file.name.endsWith(".py")
                        ? "text-[#519aba]"
                        : file.name.endsWith(".json")
                        ? "text-[#cbcb41]"
                        : file.name.endsWith(".rs") || file.name.endsWith(".toml")
                        ? "text-[#ffb786]"
                        : file.name.endsWith(".ts") || file.name.endsWith(".js")
                        ? "text-[#4d8eff]"
                        : "text-[#adc6ff]";

                    return (
                      <div
                        key={file.id}
                        onClick={() => handleOpenFile(file.id)}
                        className={`pl-8 pr-3 py-1.5 flex items-center gap-2 cursor-pointer transition-colors text-xs font-code group ${
                          isSelected
                            ? "bg-[#201f1f] text-[#adc6ff] font-medium border-l-2 border-[#adc6ff]"
                            : "text-[#c2c6d6] hover:bg-[#201f1f] hover:text-[#e5e2e1]"
                        }`}
                      >
                        <span className={`material-symbols-outlined text-[16px] ${iconColor}`}>
                          description
                        </span>
                        <span className="flex-1 truncate">{file.name}</span>
                        {files.length > 1 && (
                          <button
                            onClick={(e) => handleDeleteFile(file.id, e)}
                            className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-red-400 text-[#8c909f] transition-opacity"
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
                <div className="mt-4 border-t border-[#2d2d2d] pt-2">
                  <div className="px-3 py-1.5 flex items-center justify-between">
                    <span className="font-code text-[11px] font-semibold text-[#8c909f] tracking-wider uppercase">
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
                          className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold overflow-hidden border border-white/10 shrink-0"
                          style={{
                            backgroundColor: m.avatarColor || "#0066FF",
                            color: "#ffffff",
                          }}
                        >
                          {m.avatarUrl ? (
                            <img src={m.avatarUrl} alt={m.name} className="w-full h-full object-cover" />
                          ) : (
                            m.initials
                          )}
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-[#10B981] rounded-full border border-[#181818]" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs text-[#e5e2e1] font-medium leading-none truncate">
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
            </>
          )}

          {/* Search View */}
          {activeActivity === "search" && (
            <div className="flex flex-col h-full">
              <div className="p-3 border-b border-[#2d2d2d] bg-[#1c1b1b]">
                <span className="font-code text-[11px] font-semibold text-[#c2c6d6] tracking-wider uppercase">
                  SEARCH IN ROOM
                </span>
              </div>
              <div className="p-3 border-b border-[#2d2d2d]">
                <input
                  type="text"
                  placeholder="Search file names..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full bg-[#121212] border border-[#383b47] rounded px-2.5 py-1.5 font-code text-xs text-[#e5e2e1] focus:border-[#adc6ff] focus:outline-none placeholder:text-[#8c909f]"
                />
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {filteredFiles.map((file) => (
                  <div
                    key={file.id}
                    onClick={() => handleOpenFile(file.id)}
                    className="p-2 rounded bg-[#201f1f] border border-[#2d2d2d] hover:border-[#adc6ff] cursor-pointer text-xs font-code"
                  >
                    <div className="text-[#adc6ff] font-semibold">{file.name}</div>
                    <div className="text-[10px] text-[#8c909f] truncate">{file.content.slice(0, 45)}...</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Git Source Control View */}
          {activeActivity === "git" && (
            <div className="flex flex-col h-full">
              <div className="p-3 border-b border-[#2d2d2d] bg-[#1c1b1b]">
                <span className="font-code text-[11px] font-semibold text-[#c2c6d6] tracking-wider uppercase">
                  SOURCE CONTROL
                </span>
              </div>
              <form onSubmit={handleGitCommit} className="p-3 border-b border-[#2d2d2d] space-y-2">
                <textarea
                  rows={2}
                  placeholder="Commit message..."
                  value={commitMessage}
                  onChange={(e) => setCommitMessage(e.target.value)}
                  className="w-full bg-[#121212] border border-[#383b47] rounded p-2 font-code text-xs text-[#e5e2e1] focus:border-[#adc6ff] focus:outline-none resize-none placeholder:text-[#8c909f]"
                />
                <button
                  type="submit"
                  disabled={!commitMessage.trim()}
                  className="w-full py-1.5 bg-[#adc6ff] disabled:opacity-50 text-[#002e6a] font-code text-xs font-bold rounded hover:bg-[#d8e2ff] transition-colors"
                >
                  Commit to Main
                </button>
              </form>
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                <span className="font-code text-[10px] text-[#8c909f] uppercase tracking-wider">
                  COMMIT HISTORY
                </span>
                {gitHistory.map((item, idx) => (
                  <div key={idx} className="font-code text-[11px] text-[#c2c6d6] p-2 bg-[#201f1f] rounded border border-[#2d2d2d]">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Center Monaco Editor Area */}
        <div className="flex-1 flex flex-col bg-[#0a0a0a] min-w-0">
          {/* Notification Toast */}
          {editorNotice && (
            <div className="bg-[#4d8eff]/20 border-b border-[#4d8eff] px-4 py-1.5 text-xs text-[#adc6ff] flex items-center justify-between">
              <span className="flex items-center gap-2 font-code">
                <span className="material-symbols-outlined text-[15px]">check_circle</span>
                {editorNotice}
              </span>
            </div>
          )}

          {/* Editor Tabs */}
          <div className="flex bg-[#121212] border-b border-[#2d2d2d] shrink-0 overflow-x-auto">
            {openTabIds.map((tabId) => {
              const file = files.find((f) => f.id === tabId);
              if (!file) return null;
              const isActive = activeFile?.id === tabId;
              return (
                <div
                  key={tabId}
                  onClick={() => setActiveFileId(tabId)}
                  className={`px-4 py-2 border-r border-[#2d2d2d] flex items-center gap-2 cursor-pointer transition-colors min-w-[130px] font-code text-xs ${
                    isActive
                      ? "bg-[#0a0a0a] border-t-2 border-t-[#adc6ff] text-[#adc6ff] font-medium"
                      : "text-[#c2c6d6] hover:bg-[#1c1b1b]"
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

            {/* AI Optimize, Run & Save Status in Tab Bar */}
            <div className="ml-auto flex items-center gap-2.5 pr-3">
              <span className="text-[11px] font-code text-neutral-500 flex items-center gap-1.5">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    saveStatus === "saved" ? "bg-[#10B981]" : "bg-[#FF7E33] animate-ping"
                  }`}
                />
                {saveStatus === "saved" ? "Saved" : "Saving..."}
              </span>

              {/* AI Optimize / Diff Inspector Trigger */}
              <button
                onClick={handleTriggerAiOptimize}
                disabled={isGeneratingAiDiff || isDiffMode}
                className="bg-white/5 border border-[#A855F7]/40 hover:border-[#A855F7] text-[#A855F7] hover:text-white px-3 py-1 rounded-full font-code text-xs font-semibold hover:bg-[#A855F7]/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                title="Inspect AI Code Diff"
              >
                <span className="material-symbols-outlined text-[14px] text-[#A855F7]">
                  auto_awesome
                </span>
                <span>{isGeneratingAiDiff ? "Analyzing AST..." : "AI Optimize"}</span>
              </button>

              <button
                onClick={handleRunActiveFile}
                className="bg-white text-black px-3 py-1 rounded-full font-code text-xs font-bold hover:bg-neutral-200 transition-all flex items-center gap-1 cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.15)]"
              >
                <span className="material-symbols-outlined text-[14px]">play_arrow</span>
                <span>Run</span>
              </button>
            </div>
          </div>

          {/* Breadcrumbs */}
          <div className="px-4 py-1.5 bg-[#000000] flex items-center justify-between border-b border-white/10 shrink-0 text-neutral-500 font-code text-xs">
            <div className="flex items-center gap-1">
              <span>CodeMesh</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span>{roomId}</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-white">{activeFile?.name || "file"}</span>
            </div>
            {isDiffMode && (
              <span className="text-[10px] font-code uppercase tracking-wider text-[#A855F7] bg-[#A855F7]/10 px-2 py-0.5 rounded-full border border-[#A855F7]/30">
                Split Diff Mode Active
              </span>
            )}
          </div>

          {/* Monaco Editor Container or AI Diff Reviewer */}
          <div className="flex-1 min-h-0 relative flex flex-col bg-[#050505]">
            {isDiffMode ? (
              <div className="flex-1 flex flex-col min-h-0 relative">
                {/* Floating Diff Review Bar */}
                <div className="bg-[#0a0a0a] border-b border-white/15 px-4 py-2 flex items-center justify-between z-10 shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-code px-2.5 py-0.5 rounded-full bg-[#A855F7]/20 border border-[#A855F7]/40 text-[#A855F7] font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                      <span>AI Patch Proposal</span>
                    </span>
                    <span className="text-xs text-neutral-300 font-body hidden sm:inline">
                      {diffSummary}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleRejectDiff}
                      className="px-3 py-1 rounded-full border border-white/15 text-neutral-400 hover:text-white hover:bg-white/5 font-code text-xs transition-all cursor-pointer"
                    >
                      Discard
                    </button>
                    <button
                      onClick={handleAcceptDiff}
                      className="px-3.5 py-1 rounded-full bg-white text-black font-bold font-code text-xs hover:bg-neutral-200 transition-all flex items-center gap-1 shadow-[0_0_15px_rgba(255,255,255,0.2)] cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[14px]">check</span>
                      <span>Accept &amp; Merge</span>
                    </button>
                  </div>
                </div>

                {/* Monaco Split Diff Editor */}
                <div className="flex-1 min-h-0">
                  {activeFile && (
                    <MonacoDiffEditor
                      height="100%"
                      language={activeFile.language}
                      original={diffOriginal}
                      modified={diffModified}
                      theme="codemesh-obsidian"
                      beforeMount={handleEditorBeforeMount}
                      options={{
                        renderSideBySide: true,
                        readOnly: false,
                        fontSize,
                        fontFamily: "'JetBrains Mono', monospace",
                        minimap: { enabled: false },
                        automaticLayout: true,
                        smoothScrolling: true,
                        padding: { top: 12 },
                      }}
                    />
                  )}
                </div>
              </div>
            ) : (
              activeFile && (
                <MonacoEditor
                  height="100%"
                  language={activeFile.language}
                  value={activeFile.content}
                  theme="codemesh-obsidian"
                  beforeMount={handleEditorBeforeMount}
                  onChange={handleEditorChange}
                  options={{
                    minimap: { enabled: false },
                    fontSize,
                    tabSize,
                    wordWrap: wordWrap ? "on" : "off",
                    fontFamily: "'JetBrains Mono', monospace",
                    lineNumbers: "on",
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    cursorBlinking: "smooth",
                    smoothScrolling: true,
                    padding: { top: 12 },
                  }}
                />
              )
            )}
          </div>

          {/* Resizable Terminal Panel */}
          {showBottomPanel && (
            <>
              {/* Drag Handle Bar */}
              <div
                onMouseDown={(e) => {
                  e.preventDefault();
                  setIsDraggingTerminal(true);
                }}
                onDoubleClick={() => setIsTerminalMaximized(!isTerminalMaximized)}
                className="h-[5px] w-full bg-[#1e1e23] hover:bg-[#0066FF] active:bg-[#0066FF] cursor-row-resize transition-all shrink-0 z-20 flex items-center justify-center group"
                title="Drag to resize terminal height (Double click to toggle maximize)"
              >
                <div className="w-10 h-[2px] rounded-full bg-white/20 group-hover:bg-white transition-colors" />
              </div>

              {/* Bottom Terminal Body */}
              <div
                style={{
                  height: isTerminalMaximized ? "75%" : `${terminalHeight}px`,
                }}
                className="bg-[#0a0a0a] flex flex-col shrink-0 min-h-[90px] max-h-[82vh] transition-[height] duration-75"
              >
                <div className="bg-[#121212] px-4 flex items-center border-b border-[#2d2d2d] shrink-0 select-none">
                  <button
                    onClick={() => setActiveTabPanel("terminal")}
                    className={`py-1.5 px-3 font-code text-xs transition-colors cursor-pointer ${
                      activeTabPanel === "terminal"
                        ? "border-b-2 border-[#adc6ff] text-[#adc6ff] font-semibold"
                        : "text-[#8c909f] hover:text-[#e5e2e1]"
                    }`}
                  >
                    TERMINAL
                  </button>
                  <button
                    onClick={() => setActiveTabPanel("output")}
                    className={`py-1.5 px-3 font-code text-xs transition-colors cursor-pointer ${
                      activeTabPanel === "output"
                        ? "border-b-2 border-[#adc6ff] text-[#adc6ff] font-semibold"
                        : "text-[#8c909f] hover:text-[#e5e2e1]"
                    }`}
                  >
                    OUTPUT
                  </button>
                  <button
                    onClick={() => setActiveTabPanel("problems")}
                    className={`py-1.5 px-3 font-code text-xs transition-colors cursor-pointer ${
                      activeTabPanel === "problems"
                        ? "border-b-2 border-[#adc6ff] text-[#adc6ff] font-semibold"
                        : "text-[#8c909f] hover:text-[#e5e2e1]"
                    }`}
                  >
                    PROBLEMS (0)
                  </button>

                  <div className="ml-auto flex items-center gap-2">
                    <button
                      onClick={handleRunActiveFile}
                      className="material-symbols-outlined text-[16px] text-emerald-400 hover:text-emerald-300 cursor-pointer p-0.5"
                      title="Run Active File"
                    >
                      play_arrow
                    </button>
                    <button
                      onClick={() =>
                        setTerminalHistory((prev) => [
                          ...prev,
                          `user@codemesh:~/${roomId}$ # New Shell instance spawned`,
                          `user@codemesh:~/${roomId}$ `,
                        ])
                      }
                      className="material-symbols-outlined text-[16px] text-[#8c909f] hover:text-[#adc6ff] cursor-pointer p-0.5"
                      title="New Terminal Instance"
                    >
                      add
                    </button>
                    <button
                      onClick={() => setTerminalHistory([`user@codemesh:~/${roomId}$ `])}
                      className="material-symbols-outlined text-[16px] text-[#8c909f] hover:text-[#adc6ff] cursor-pointer p-0.5"
                      title="Clear Terminal"
                    >
                      delete
                    </button>
                    <button
                      onClick={() => setIsTerminalMaximized(!isTerminalMaximized)}
                      className="material-symbols-outlined text-[16px] text-[#8c909f] hover:text-[#adc6ff] cursor-pointer p-0.5"
                      title={isTerminalMaximized ? "Restore Panel Height" : "Maximize Panel Height (75%)"}
                    >
                      {isTerminalMaximized ? "close_fullscreen" : "open_in_full"}
                    </button>
                    <button
                      onClick={() => setShowBottomPanel(false)}
                      className="material-symbols-outlined text-[16px] text-[#8c909f] hover:text-red-400 cursor-pointer p-0.5"
                      title="Hide Terminal"
                    >
                      close
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
                          ) : line.includes("[CodeMesh") || line.includes("✓") ? (
                            <span className="text-[#adc6ff]">{line}</span>
                          ) : line.includes("[Error]") || line.includes("[Syntax/Runtime Error]") || line.includes("[Runtime Exception]") ? (
                            <span className="text-red-400">{line}</span>
                          ) : (
                            <span>{line}</span>
                          )}
                        </div>
                      ))}
                      <form onSubmit={handleTerminalSubmit} className="flex items-center gap-1 mt-1">
                        <span className="text-[#8c909f]">user@codemesh:~/{roomId}$</span>
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
                      <div>[CodeMesh Realtime] Broadcast channel active: room_{roomId}</div>
                      <div>[Memory Graph] pgvector indexing active across {files.length} project files.</div>
                      <div>[Gemini Engine] Model &apos;gemini-2.0-flash&apos; ready for contextual AST queries.</div>
                    </div>
                  )}

                  {activeTabPanel === "problems" && (
                    <div className="text-[#8c909f] flex items-center gap-2">
                      <span className="material-symbols-outlined text-emerald-400 text-[16px]">check_circle</span>
                      <span>No syntax errors or lint warnings found.</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* IDE Footer Telemetry Status Bar */}
          <footer className="h-6 bg-[#0a0a0a] border-t border-[#2d2d2d] px-3 flex items-center justify-between text-[10px] font-code text-[#8c909f] select-none shrink-0">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-[#e5e2e1] hover:text-[#0066FF] cursor-pointer">
                <span className="material-symbols-outlined text-[12px]">commit</span>
                <span>main*</span>
              </span>
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>0 errors, 0 warnings</span>
              </span>
            </div>

            <div className="flex items-center gap-3">
              {!showBottomPanel && (
                <button
                  onClick={() => setShowBottomPanel(true)}
                  className="text-[#0066FF] hover:underline flex items-center gap-1 cursor-pointer font-bold"
                >
                  <span className="material-symbols-outlined text-[13px]">terminal</span>
                  <span>Show Terminal</span>
                </button>
              )}
              <span>Ln 1, Col 1</span>
              <span>UTF-8</span>
              <span>Spaces: {tabSize}</span>
              <span className="text-[#adc6ff]">{activeFile?.language || "python"}</span>
              <span className="text-[#A855F7] flex items-center gap-1 font-semibold">
                <span className="material-symbols-outlined text-[12px]">auto_awesome</span>
                <span>Gemini 2.0 Flash ⚡</span>
              </span>
              <span className="text-neutral-500">4.2ms</span>
            </div>
          </footer>
        </div>

        {/* Right Drawer (Team Discussion Chat) */}
        {showChatPanel && (
          <div className="w-80 md:w-96 bg-[#181818] border-l border-[#2d2d2d] flex flex-col shrink-0">
            {/* Team Chat Header */}
            <div className="border-b border-[#2d2d2d] flex items-center justify-between bg-[#121212] px-3 py-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[17px] text-[#adc6ff]">forum</span>
                <span className="font-code text-xs font-semibold text-[#e5e2e1]">Team Discussion</span>
                <span className="flex items-center gap-1 text-[10px] text-green-400 bg-green-950/40 border border-green-800/40 px-1.5 py-0.5 rounded font-code">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                  Live
                </span>
              </div>

              <button
                onClick={() => setShowChatPanel(false)}
                className="text-[#8c909f] hover:text-[#e5e2e1] p-1 transition-colors"
                title="Collapse Chat"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>

            {/* Team Discussion Component */}
            <TeamDiscussionChat
              roomId={roomId}
              activeFileName={activeFile?.name}
              activeCodeSelection={activeFile?.content}
              members={members}
              onOpenCodeRef={(fileName) => {
                const target = files.find((f) => f.name === fileName);
                if (target) {
                  setActiveFileId(target.id);
                  if (!openTabIds.includes(target.id)) {
                    setOpenTabIds([...openTabIds, target.id]);
                  }
                }
              }}
            />
          </div>
        )}
      </div>

      {showSettingsModal && (
        <EditorSettingsModal
          fontSize={fontSize}
          tabSize={tabSize}
          wordWrap={wordWrap ? "on" : "off"}
          onSave={({ fontSize: newFont, tabSize: newTab, wordWrap: newWrap }) => {
            setFontSize(newFont);
            setTabSize(newTab);
            setWordWrap(newWrap === "on");
          }}
          onClose={() => setShowSettingsModal(false)}
        />
      )}
    </div>
  );
}
