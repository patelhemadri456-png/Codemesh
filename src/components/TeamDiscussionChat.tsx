"use client";

import { useState, useEffect, useRef } from "react";
import { TeamChatMessage, TeamChatCodeRef, RoomMember } from "@/types/workspace";
import { getUserSession } from "@/lib/authSession";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

interface TeamDiscussionChatProps {
  roomId: string;
  activeFileName?: string;
  activeCodeSelection?: string;
  members: RoomMember[];
  onOpenCodeRef?: (fileName: string) => void;
}

const STORAGE_PREFIX = "codemesh_team_chat_";

const initialSampleMessages: Record<string, TeamChatMessage[]> = {
  default: [
    {
      id: "msg-1",
      roomId: "demo",
      senderId: "sarah_j",
      senderName: "Sarah J.",
      senderColor: "#ffb786",
      content: "Hey team! I just mounted the distributed token stream. Let's make sure the buffer scaling handles > 10k concurrent clients.",
      timestamp: "10:14 AM",
      reactions: [
        { emoji: "🚀", count: 2, users: ["Alex", "YOU"] },
        { emoji: "👍", count: 1, users: ["YOU"] },
      ],
    },
    {
      id: "msg-2",
      roomId: "demo",
      senderId: "alex_m",
      senderName: "Alex M.",
      senderColor: "#adc6ff",
      content: "Checking the Redis pipeline now. Should we apply the DashMap patch that Gemini RAG recommended?",
      timestamp: "10:16 AM",
      codeRef: {
        fileName: "src/utils.py",
        lines: "L12-L18",
        snippet: "def get_optimal_buffer():\n    return max(4096, multiprocessing.cpu_count() * 1024)",
      },
      reactions: [
        { emoji: "🔥", count: 3, users: ["Sarah J.", "YOU", "Alex M."] },
      ],
    },
  ],
};

export default function TeamDiscussionChat({
  roomId,
  activeFileName,
  activeCodeSelection,
  members,
  onOpenCodeRef,
}: TeamDiscussionChatProps) {
  const [messages, setMessages] = useState<TeamChatMessage[]>([]);
  const [inputContent, setInputContent] = useState("");
  const [attachedCode, setAttachedCode] = useState<TeamChatCodeRef | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const user = getUserSession();

  // Load per-room messages from storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_PREFIX}${roomId}`);
      if (stored) {
        setMessages(JSON.parse(stored));
      } else {
        const defaults = initialSampleMessages[roomId] || initialSampleMessages.default;
        setMessages(defaults);
        localStorage.setItem(`${STORAGE_PREFIX}${roomId}`, JSON.stringify(defaults));
      }
    } catch {
      setMessages(initialSampleMessages.default);
    }
  }, [roomId]);

  // Supabase Realtime & Tab-to-Tab Synchronization
  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      const channel = supabase.channel(`room-chat:${roomId}`, {
        config: { broadcast: { self: false } },
      });

      channel
        .on("broadcast", { event: "chat:message" }, ({ payload }) => {
          setMessages((prev) => {
            if (prev.some((m) => m.id === payload.id)) return prev;
            const updated = [...prev, payload];
            localStorage.setItem(`${STORAGE_PREFIX}${roomId}`, JSON.stringify(updated));
            return updated;
          });
        })
        .on("broadcast", { event: "chat:reaction" }, ({ payload }) => {
          setMessages((prev) => {
            const updated = prev.map((m) =>
              m.id === payload.messageId ? { ...m, reactions: payload.reactions } : m
            );
            localStorage.setItem(`${STORAGE_PREFIX}${roomId}`, JSON.stringify(updated));
            return updated;
          });
        })
        .subscribe();

      return () => {
        if (supabase) {
          supabase.removeChannel(channel);
        }
      };
    }

    // Storage event for local cross-tab sync
    const handleStorage = (e: StorageEvent) => {
      if (e.key === `${STORAGE_PREFIX}${roomId}` && e.newValue) {
        try {
          setMessages(JSON.parse(e.newValue));
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [roomId]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const saveAndBroadcast = (updated: TeamChatMessage[], newMsg?: TeamChatMessage) => {
    setMessages(updated);
    try {
      localStorage.setItem(`${STORAGE_PREFIX}${roomId}`, JSON.stringify(updated));
    } catch (e) {
      console.warn("Failed to persist team chat:", e);
    }

    if (isSupabaseConfigured && supabase && newMsg) {
      const channel = supabase.channel(`room-chat:${roomId}`);
      channel.send({
        type: "broadcast",
        event: "chat:message",
        payload: newMsg,
      });
    }
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputContent.trim() && !attachedCode) return;

    const newMsg: TeamChatMessage = {
      id: `msg-${Date.now()}`,
      roomId,
      senderId: user.id || "guest",
      senderName: user.handle || "YOU",
      senderColor: user.avatarColor || "#4d8eff",
      content: inputContent.trim(),
      codeRef: attachedCode || undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      reactions: [],
    };

    const updated = [...messages, newMsg];
    saveAndBroadcast(updated, newMsg);
    setInputContent("");
    setAttachedCode(null);
  };

  const handleAddReaction = (messageId: string, emoji: string) => {
    const updated = messages.map((m) => {
      if (m.id !== messageId) return m;
      const currentReactions = m.reactions || [];
      const existing = currentReactions.find((r) => r.emoji === emoji);

      let newReactions;
      if (existing) {
        if (existing.users.includes(user.handle)) {
          // Remove reaction
          newReactions = currentReactions
            .map((r) =>
              r.emoji === emoji
                ? { ...r, count: r.count - 1, users: r.users.filter((u) => u !== user.handle) }
                : r
            )
            .filter((r) => r.count > 0);
        } else {
          // Add user to reaction
          newReactions = currentReactions.map((r) =>
            r.emoji === emoji
              ? { ...r, count: r.count + 1, users: [...r.users, user.handle] }
              : r
          );
        }
      } else {
        newReactions = [...currentReactions, { emoji, count: 1, users: [user.handle] }];
      }

      return { ...m, reactions: newReactions };
    });

    setMessages(updated);
    localStorage.setItem(`${STORAGE_PREFIX}${roomId}`, JSON.stringify(updated));
    setShowEmojiPicker(null);

    if (isSupabaseConfigured && supabase) {
      const msg = updated.find((m) => m.id === messageId);
      if (msg) {
        const channel = supabase.channel(`room-chat:${roomId}`);
        channel.send({
          type: "broadcast",
          event: "chat:reaction",
          payload: { messageId, reactions: msg.reactions },
        });
      }
    }
  };

  const handleAttachActiveCode = () => {
    if (!activeFileName) return;
    setAttachedCode({
      fileName: activeFileName,
      lines: activeCodeSelection ? "Selection" : "Whole File",
      snippet: activeCodeSelection ? activeCodeSelection.slice(0, 180) : undefined,
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#111113] text-[#ededed] font-body">
      {/* Header Info */}
      <div className="p-3 border-b border-white/10 bg-[#17171a] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#adc6ff] text-[18px]">
            forum
          </span>
          <div>
            <div className="font-code text-xs font-bold text-[#ededed] flex items-center gap-1.5">
              <span>#room-discussion</span>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
            </div>
            <div className="text-[10px] text-[#727685] font-code">
              {members.length} members connected in real-time
            </div>
          </div>
        </div>

        {/* Quick Collaborator Avatars */}
        <div className="flex -space-x-1.5">
          {members.map((m, i) => (
            <div
              key={i}
              title={m.name}
              className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white border border-[#17171a] shadow"
              style={{ backgroundColor: m.color }}
            >
              {m.name.slice(0, 2).toUpperCase()}
            </div>
          ))}
        </div>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 font-code text-xs">
        {messages.map((msg) => {
          const isMe = msg.senderName === user.handle || msg.senderId === user.id;

          return (
            <div
              key={msg.id}
              className={`flex flex-col group ${isMe ? "items-end" : "items-start"}`}
            >
              {/* Sender & Timestamp */}
              <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-[#727685]">
                <div
                  className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold text-white"
                  style={{ backgroundColor: msg.senderColor }}
                >
                  {msg.senderName.slice(0, 1).toUpperCase()}
                </div>
                <span className="font-bold text-[#b0b4c3]">{msg.senderName}</span>
                <span>&bull; {msg.timestamp}</span>
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[88%] p-2.5 rounded-xl border relative shadow-sm ${
                  isMe
                    ? "bg-[#1e1e23] border-[#adc6ff]/40 text-[#ededed]"
                    : "bg-[#17171a] border-white/10 text-[#ededed]"
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>

                {/* Attached Code Reference */}
                {msg.codeRef && (
                  <div
                    onClick={() => onOpenCodeRef && onOpenCodeRef(msg.codeRef!.fileName)}
                    className="mt-2 p-2 rounded-lg bg-[#080809] border border-white/10 cursor-pointer hover:border-[#adc6ff]/50 transition-colors"
                  >
                    <div className="flex items-center justify-between text-[10px] text-[#adc6ff] mb-1 font-bold">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">code</span>
                        {msg.codeRef.fileName}
                      </span>
                      <span className="text-[#727685]">{msg.codeRef.lines}</span>
                    </div>
                    {msg.codeRef.snippet && (
                      <pre className="text-[10px] text-[#b0b4c3] overflow-x-auto whitespace-pre">
                        <code>{msg.codeRef.snippet}</code>
                      </pre>
                    )}
                  </div>
                )}

                {/* Reactions list */}
                {msg.reactions && msg.reactions.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5 pt-1 border-t border-white/5">
                    {msg.reactions.map((r, rIdx) => (
                      <button
                        key={rIdx}
                        onClick={() => handleAddReaction(msg.id, r.emoji)}
                        className={`text-[10px] px-1.5 py-0.5 rounded-full border flex items-center gap-1 transition-colors ${
                          r.users.includes(user.handle)
                            ? "bg-[#001a42] border-[#00285d] text-[#adc6ff]"
                            : "bg-[#0d0d0e] border-white/10 text-[#b0b4c3]"
                        }`}
                      >
                        <span>{r.emoji}</span>
                        <span>{r.count}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Action Hover Emoji Trigger */}
                <div className="absolute -top-2.5 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#111113] border border-white/15 rounded-lg px-1.5 py-0.5 flex gap-1 shadow-lg">
                  {["👍", "🚀", "🔥", "👀"].map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => handleAddReaction(msg.id, emoji)}
                      className="hover:scale-125 transition-transform text-xs"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-white/10 bg-[#17171a] space-y-2">
        {/* Attached Code Chip */}
        {attachedCode && (
          <div className="flex items-center justify-between px-2.5 py-1 rounded bg-[#080809] border border-[#adc6ff]/40 text-[11px] font-code text-[#adc6ff]">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">attachment</span>
              Referencing {attachedCode.fileName} ({attachedCode.lines})
            </span>
            <button
              onClick={() => setAttachedCode(null)}
              className="text-[#727685] hover:text-red-400"
            >
              <span className="material-symbols-outlined text-[14px]">close</span>
            </button>
          </div>
        )}

        {/* Quick Action Bar */}
        <div className="flex items-center gap-2 text-[11px] font-code text-[#727685]">
          <button
            type="button"
            onClick={handleAttachActiveCode}
            disabled={!activeFileName}
            className="flex items-center gap-1 hover:text-[#adc6ff] transition-colors disabled:opacity-40"
            title="Attach active file code snippet"
          >
            <span className="material-symbols-outlined text-[15px]">code_blocks</span>
            <span>Attach @{activeFileName || "file"}</span>
          </button>
          <span>&bull;</span>
          <button
            type="button"
            onClick={() => setInputContent((prev) => `${prev} @Sarah `)}
            className="hover:text-[#adc6ff]"
          >
            @Sarah
          </button>
          <button
            type="button"
            onClick={() => setInputContent((prev) => `${prev} @Alex `)}
            className="hover:text-[#adc6ff]"
          >
            @Alex
          </button>
          <button
            type="button"
            onClick={() => setInputContent((prev) => `${prev} @all `)}
            className="hover:text-[#adc6ff]"
          >
            @all
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            placeholder="Discuss with team... (Press Enter to send)"
            value={inputContent}
            onChange={(e) => setInputContent(e.target.value)}
            className="flex-1 bg-[#080809] border border-white/10 rounded-lg px-3 py-2 text-xs font-code text-[#ededed] focus:border-[#adc6ff] focus:outline-none transition-colors placeholder:text-[#727685]"
          />
          <button
            type="submit"
            className="bg-[#adc6ff] text-[#002e6a] p-2 rounded-lg hover:bg-[#d8e2ff] transition-all flex items-center justify-center font-bold shadow-[0_0_12px_rgba(173,198,255,0.2)]"
          >
            <span className="material-symbols-outlined text-[16px]">send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
