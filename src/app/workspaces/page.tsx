"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import CreateRoomModal from "@/components/CreateRoomModal";
import JoinRoomModal from "@/components/JoinRoomModal";

interface WorkspaceCardData {
  id: string;
  title: string;
  description: string;
  tags: { name: string; variant: "primary" | "neutral" }[];
  activeAgo: string;
  members: string[];
}

const initialWorkspaces: WorkspaceCardData[] = [
  {
    id: "compsci-101-final",
    title: "CompSci 101 Final",
    description:
      "Collaborative environment for final project algorithms and data structures.",
    tags: [
      { name: "Python", variant: "primary" },
      { name: "Jupyter", variant: "neutral" },
    ],
    activeAgo: "2h ago",
    members: ["SJ", "AL"],
  },
  {
    id: "hackathon-app",
    title: "Hackathon App",
    description:
      "React Native mobile application prototype for the weekend hackathon.",
    tags: [
      { name: "TypeScript", variant: "primary" },
      { name: "React", variant: "neutral" },
    ],
    activeAgo: "1d ago",
    members: ["MK"],
  },
  {
    id: "distributed-worker",
    title: "Distributed Stream Engine",
    description:
      "High-throughput event consumer with pgvector semantic similarity search pipeline.",
    tags: [
      { name: "Rust", variant: "primary" },
      { name: "Tokio", variant: "neutral" },
    ],
    activeAgo: "Just now",
    members: ["YOU", "AL", "SJ"],
  },
];

export default function WorkspacesPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  return (
    <div className="bg-[#131313] text-[#e5e2e1] min-h-screen flex flex-col">
      <Navbar variant="dashboard" />

      <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto mt-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="font-headline text-2xl md:text-3xl font-bold text-[#e5e2e1] mb-1">
                Workspaces
              </h1>
              <p className="text-sm text-[#c2c6d6]">
                Select a project or create a new room to start collaborating in real time.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowJoinModal(true)}
                className="px-4 py-2 border border-[#424754] text-[#e5e2e1] rounded text-sm font-medium hover:bg-[#201f1f] transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px] text-[#adc6ff]">
                  group_add
                </span>
                Join Room
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-[#adc6ff] text-[#002e6a] rounded text-sm font-semibold flex items-center gap-2 hover:bg-[#d8e2ff] transition-all shadow-[0_0_15px_rgba(173,198,255,0.25)]"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                New Workspace
              </button>
            </div>
          </div>

          {/* Bento Grid for Workspaces */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {initialWorkspaces.map((ws) => (
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
                  <div className="flex -space-x-1.5">
                    {ws.members.map((m, i) => (
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
                        {m}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-[#c2c6d6] leading-relaxed mb-4">
                    {ws.description}
                  </p>
                  <div className="flex gap-2">
                    {ws.tags.map((t, i) => (
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
                    Last active: {ws.activeAgo}
                  </span>
                  <span className="material-symbols-outlined text-[16px] text-[#adc6ff] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
                    arrow_forward
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      {showCreateModal && (
        <CreateRoomModal onClose={() => setShowCreateModal(false)} />
      )}
      {showJoinModal && (
        <JoinRoomModal onClose={() => setShowJoinModal(false)} />
      )}
    </div>
  );
}
