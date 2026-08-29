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
import confetti from "canvas-confetti";

// Dynamically import Monaco Editor to prevent SSR issues
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center bg-[#0a0a0a] text-xs font-code text-[#8c909f]">
      <span className="w-2 h-2 rounded-full bg-[#adc6ff] animate-ping mr-2"></span>
      Initializing Monaco Cloud Environment...
    </div>
  ),
});

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
  const [user, setUser] = useState<UserSession | null>(null);

  // Editor Settings
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [fontSize, setFontSize] = useState<number>(14);
  const [tabSize, setTabSize] = useState<number>(2);
  const [wordWrap, setWordWrap] = useState<boolean>(true);

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

    setTerminalHistory([
      `user@codemesh:~/${roomId}$ # Workspace initialized`,
      `[CodeMesh Container] Active room: ${roomId}`,
      `Type 'run' or 'python <file>' to execute code. Type 'help' for commands.`,
      `user@codemesh:~/${roomId}$ `,
    ]);
  }, [roomId]);

  // Dynamic Members
  const members: RoomMember[] = [
    {
      id: "m_user",
      name: user?.isLoggedIn ? `@${user.handle}` : "You",
      initials: user?.initials || "YOU",
      avatarColor: user?.avatarColor || "#4d8eff",
      status: "active",
      isHost: true,
      currentAction: "editing",
    },
    {
      id: "m_alex",
      name: "Alex",
      initials: "AL",
      avatarColor: "#adc6ff",
      status: "active",
      activeLine: 12,
      currentAction: "editing",
    },
    {
      id: "m_sam",
      name: "Sarah J.",
      initials: "SJ",
      avatarColor: "#ffb786",
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
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.2 } });
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
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.1 } });
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
              className="w-6 h-6 rounded-full flex items-center justify-center mx-auto text-[10px] font-bold text-white shadow border border-[#424754]"
              style={{ backgroundColor: user?.avatarColor || "#4d8eff" }}
              title={user?.isLoggedIn ? `@${user.handle}` : "Guest User"}
            >
              {user?.initials || "YOU"}
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
                          className="w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold"
                          style={{
                            backgroundColor: m.avatarColor,
                            color: m.initials === "YOU" ? "#ffffff" : "#00285d",
                          }}
                        >
                          {m.initials}
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-green-500 rounded-full border border-[#181818]" />
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

            {/* Run & Save Status in Tab Bar */}
            <div className="ml-auto flex items-center gap-3 pr-3">
              <span className="text-[11px] font-code text-[#8c909f] flex items-center gap-1">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    saveStatus === "saved" ? "bg-green-400" : "bg-amber-400 animate-ping"
                  }`}
                />
                {saveStatus === "saved" ? "Saved" : "Saving..."}
              </span>
              <button
                onClick={handleRunActiveFile}
                className="bg-[#001a42] border border-[#00285d] text-[#adc6ff] px-2.5 py-1 rounded font-code text-xs font-semibold hover:bg-[#00285d] transition-colors flex items-center gap-1"
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
            <span>{roomId}</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-[#e5e2e1]">{activeFile?.name || "file"}</span>
          </div>

          {/* Monaco Editor Container */}
          <div className="flex-1 min-h-0 relative">
            {activeFile && (
              <MonacoEditor
                height="100%"
                language={activeFile.language}
                value={activeFile.content}
                theme="vs-dark"
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
            )}
          </div>

          {/* Bottom Terminal Panel */}
          <div className="h-44 bg-[#0a0a0a] border-t border-[#2d2d2d] flex flex-col shrink-0">
            <div className="bg-[#121212] px-4 flex items-center border-b border-[#2d2d2d] shrink-0">
              <button
                onClick={() => setActiveTabPanel("terminal")}
                className={`py-1.5 px-3 font-code text-xs transition-colors ${
                  activeTabPanel === "terminal"
                    ? "border-b-2 border-[#adc6ff] text-[#adc6ff] font-semibold"
                    : "text-[#8c909f] hover:text-[#e5e2e1]"
                }`}
              >
                TERMINAL
              </button>
              <button
                onClick={() => setActiveTabPanel("output")}
                className={`py-1.5 px-3 font-code text-xs transition-colors ${
                  activeTabPanel === "output"
                    ? "border-b-2 border-[#adc6ff] text-[#adc6ff] font-semibold"
                    : "text-[#8c909f] hover:text-[#e5e2e1]"
                }`}
              >
                OUTPUT
              </button>
              <button
                onClick={() => setActiveTabPanel("problems")}
                className={`py-1.5 px-3 font-code text-xs transition-colors ${
                  activeTabPanel === "problems"
                    ? "border-b-2 border-[#adc6ff] text-[#adc6ff] font-semibold"
                    : "text-[#8c909f] hover:text-[#e5e2e1]"
                }`}
              >
                PROBLEMS (0)
              </button>
              <div className="ml-auto flex gap-2">
                <button
                  onClick={() =>
                    setTerminalHistory((prev) => [
                      ...prev,
                      `user@codemesh:~/${roomId}$ # New Shell instance spawned`,
                      `user@codemesh:~/${roomId}$ `,
                    ])
                  }
                  className="material-symbols-outlined text-[16px] text-[#8c909f] hover:text-[#adc6ff]"
                  title="New Terminal"
                >
                  add
                </button>
                <button
                  onClick={() => setTerminalHistory([`user@codemesh:~/${roomId}$ `])}
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
                      ) : line.includes("[CodeMesh") || line.includes("✓") ? (
                        <span className="text-[#adc6ff]">{line}</span>
                      ) : line.includes("[Error]") || line.includes("[Runtime Exception]") ? (
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
                <div className="text-[#8c909f]">No syntax errors or lint warnings found.</div>
              )}
            </div>
          </div>
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
