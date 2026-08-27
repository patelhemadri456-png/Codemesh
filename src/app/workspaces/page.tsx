"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import CreateRoomModal from "@/components/CreateRoomModal";
import JoinRoomModal from "@/components/JoinRoomModal";
import { WorkspaceProject } from "@/types/workspace";
import {
  getStoredWorkspaces,
  deleteStoredWorkspace,
  addStoredWorkspace,
} from "@/lib/roomStorage";

export default function WorkspacesPage() {
  const [workspaces, setWorkspaces] = useState<WorkspaceProject[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    setWorkspaces(getStoredWorkspaces());
  }, []);

  const handleDeleteRoom = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = deleteStoredWorkspace(id);
    setWorkspaces(updated);
    setNotice(`Deleted room "${id}"`);
    setTimeout(() => setNotice(null), 2500);
  };

  const handleRoomCreated = (newRoom: unknown) => {
    const created = newRoom as WorkspaceProject;
    if (created?.id) {
      const updated = addStoredWorkspace(created);
      setWorkspaces(updated);
    }
  };

  const filteredWorkspaces = workspaces.filter(
    (w) =>
      w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.tags.some((t) => t.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="bg-[#131313] text-[#e5e2e1] min-h-screen flex flex-col">
      <Navbar variant="dashboard" />

      <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto mt-4">
          {/* Notification Banner */}
          {notice && (
            <div className="mb-4 bg-[#201f1f] border border-[#adc6ff] text-[#adc6ff] px-4 py-2 rounded-md text-xs font-code flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">info</span>
              <span>{notice}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="font-headline text-2xl md:text-3xl font-bold text-[#e5e2e1] mb-1">
                Workspaces
              </h1>
              <p className="text-sm text-[#c2c6d6]">
                Select a project or create a new room to start collaborating with your team in real time.
              </p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => setShowJoinModal(true)}
                className="px-4 py-2 border border-[#424754] text-[#e5e2e1] rounded text-sm font-medium hover:bg-[#201f1f] transition-colors flex items-center justify-center gap-2 flex-1 sm:flex-none"
              >
                <span className="material-symbols-outlined text-[18px] text-[#adc6ff]">
                  group_add
                </span>
                Join Room
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-[#adc6ff] text-[#002e6a] rounded text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#d8e2ff] transition-all shadow-[0_0_15px_rgba(173,198,255,0.25)] flex-1 sm:flex-none"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                New Workspace
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="mb-6 max-w-md">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-[#8c909f]">
                search
              </span>
              <input
                type="text"
                placeholder="Search workspaces by name, stack, or tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1c1b1b] border border-[#424754] rounded-md pl-10 pr-4 py-2 font-code text-xs text-[#e5e2e1] focus:border-[#adc6ff] focus:outline-none transition-colors placeholder:text-[#8c909f]"
              />
            </div>
          </div>

          {/* Bento Grid for Workspaces */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredWorkspaces.map((ws) => (
              <Link
                key={ws.id}
                href={`/workspace/${ws.id}`}
                className="bg-[#201f1f] pane-border rounded-lg flex flex-col hover:border-[#adc6ff] transition-colors cursor-pointer group overflow-hidden shadow-lg"
              >
                <div className="p-4 border-b border-[#2d2d2d] flex justify-between items-center bg-[#1c1b1b]">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#adc6ff] text-[20px]">
                      folder_open
                    </span>
                    <span className="font-code text-xs font-semibold text-[#e5e2e1]">
                      {ws.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-1.5">
                      {Array.from({ length: ws.membersCount || 2 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-6 h-6 rounded-full border border-[#201f1f] flex items-center justify-center text-[9px] font-bold ${
                            i === 0
                              ? "bg-[#4d8eff] text-white"
                              : i === 1
                              ? "bg-[#ffb786] text-[#502400]"
                              : "bg-[#d0bcff] text-[#3c0091]"
                          }`}
                        >
                          {i === 0 ? "YOU" : i === 1 ? "AL" : "SJ"}
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={(e) => handleDeleteRoom(ws.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 text-[#8c909f] transition-opacity"
                      title="Delete room"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-[#c2c6d6] leading-relaxed mb-4">
                    {ws.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {ws.tags?.map((t, i) => (
                      <span
                        key={i}
                        className={`px-2 py-0.5 rounded font-code text-[11px] border ${
                          t.variant === "primary"
                            ? "bg-[#001a42] text-[#adc6ff] border-[#00285d]"
                            : "bg-[#2a2a2a] text-[#c2c6d6] border-[#353534]"
                        }`}
                      >
                        {t.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="px-4 py-2.5 border-t border-[#2d2d2d] bg-[#121212] flex justify-between items-center group-hover:bg-[#181818] transition-colors">
                  <span className="font-code text-[11px] text-[#8c909f]">
                    Last active: {ws.activeAgo || "Just now"}
                  </span>
                  <span className="material-symbols-outlined text-[16px] text-[#adc6ff] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
                    arrow_forward
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {filteredWorkspaces.length === 0 && (
            <div className="text-center py-16 bg-[#1c1b1b] rounded-lg border border-[#424754]/50 p-6">
              <span className="material-symbols-outlined text-4xl text-[#8c909f] mb-2">
                folder_off
              </span>
              <p className="font-code text-sm text-[#c2c6d6]">
                No workspaces match &quot;{searchQuery}&quot;
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="mt-3 text-xs text-[#adc6ff] underline font-code"
              >
                Clear Search Filter
              </button>
            </div>
          )}
        </div>
      </main>

      {showCreateModal && (
        <CreateRoomModal
          onClose={() => setShowCreateModal(false)}
          onCreated={handleRoomCreated}
        />
      )}
      {showJoinModal && (
        <JoinRoomModal onClose={() => setShowJoinModal(false)} />
      )}
    </div>
  );
}
