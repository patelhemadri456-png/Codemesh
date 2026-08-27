"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface CreateRoomModalProps {
  onClose: () => void;
}

export default function CreateRoomModal({ onClose }: CreateRoomModalProps) {
  const router = useRouter();
  const [roomName, setRoomName] = useState("");
  const [template, setTemplate] = useState("Blank Workspace");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = roomName.trim()
      ? roomName.trim().toLowerCase().replace(/\s+/g, "-")
      : "workspace-" + Math.random().toString(36).substring(2, 8);
    onClose();
    router.push(`/workspace/${slug}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[#131313]/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-[#2a2a2a] pane-border rounded-lg w-full max-w-md shadow-2xl flex flex-col z-10 overflow-hidden">
        <div className="border-t-2 border-[#adc6ff] absolute top-0 left-0 right-0 pointer-events-none" />
        <div className="p-4 border-b border-[#424754] flex justify-between items-center bg-[#201f1f]">
          <h2 className="font-headline text-lg font-semibold text-[#e5e2e1] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#adc6ff] text-[20px]">
              add_circle
            </span>
            Create Room
          </h2>
          <button
            className="text-[#c2c6d6] hover:text-[#e5e2e1] transition-colors p-1"
            onClick={onClose}
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleCreate} className="p-5 flex flex-col gap-4">
          <div>
            <label className="block font-code text-xs text-[#c2c6d6] mb-2 uppercase tracking-wider">
              Room Name
            </label>
            <input
              className="w-full bg-[#121212] border border-[#424754] rounded px-3 py-2 font-code text-sm text-[#e5e2e1] focus:border-[#adc6ff] focus:outline-none transition-colors placeholder:text-[#8c909f]"
              placeholder="e.g., project-apollo"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              autoFocus
            />
          </div>

          <div>
            <label className="block font-code text-xs text-[#c2c6d6] mb-2 uppercase tracking-wider">
              Template
            </label>
            <select
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              className="w-full bg-[#121212] border border-[#424754] rounded px-3 py-2 font-code text-sm text-[#e5e2e1] focus:border-[#adc6ff] focus:outline-none transition-colors"
            >
              <option value="Blank Workspace">Blank Workspace</option>
              <option value="Node.js Starter">Node.js Starter</option>
              <option value="Python Data Science">Python Data Science</option>
              <option value="Rust Distributed Worker">Rust Distributed Worker</option>
            </select>
          </div>

          <div className="pt-3 border-t border-[#424754]/50 flex justify-end gap-3">
            <button
              type="button"
              className="px-4 py-2 text-[#c2c6d6] text-sm hover:text-[#e5e2e1] transition-colors"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#adc6ff] text-[#002e6a] rounded text-sm font-semibold hover:bg-[#d8e2ff] transition-colors flex items-center gap-1.5 shadow-[0_0_12px_rgba(173,198,255,0.2)]"
            >
              <span>Create</span>
              <span className="material-symbols-outlined text-[16px]">
                arrow_forward
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
