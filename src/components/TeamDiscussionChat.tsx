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
  const [user, setUser] = useState(getUserSession());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync logged in user session
  useEffect(() => {
    setUser(getUserSession());
    const handleAuth = () => setUser(getUserSession());
    window.addEventListener("codemesh:auth_change", handleAuth);
    return () => window.removeEventListener("codemesh:auth_change", handleAuth);
  }, []);

  // Load chat history & subscribe to Supabase Realtime channel
  useEffect(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}${roomId}`);
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch {
        setMessages(initialSampleMessages.default);
      }
    } else {
      const initial = initialSampleMessages[roomId] || initialSampleMessages.default;
      setMessages(initial);
      localStorage.setItem(`${STORAGE_PREFIX}${roomId}`, JSON.stringify(initial));
    }

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

    const senderHandle = user.isLoggedIn ? user.handle : "YOU";

    const newMsg: TeamChatMessage = {
      id: `msg-${Date.now()}`,
      roomId,
      senderId: user.id || "guest",
      senderName: senderHandle,
      senderColor: user.avatarColor || "#0066FF",
      senderAvatarUrl: user.avatarUrl,
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

  const handleReaction = (messageId: string, emoji: string) => {
    const userHandle = user.isLoggedIn ? user.handle : "YOU";

    const updated = messages.map((m) => {
      if (m.id !== messageId) return m;

      const currentReactions = m.reactions || [];
      const existingReactionIndex = currentReactions.findIndex((r) => r.emoji === emoji);

      let newReactions: any[];
      if (existingReactionIndex > -1) {
        const reaction = currentReactions[existingReactionIndex];
        const userHasReacted = reaction.users.includes(userHandle);

        if (userHasReacted) {
          const nextUsers = reaction.users.filter((u) => u !== userHandle);
          if (nextUsers.length === 0) {
            newReactions = currentReactions.filter((r) => r.emoji !== emoji);
          } else {
            newReactions = currentReactions.map((r, i) =>
              i === existingReactionIndex ? { ...r, count: r.count - 1, users: nextUsers } : r
            );
          }
        } else {
          newReactions = currentReactions.map((r, i) =>
            i === existingReactionIndex
              ? { ...r, count: r.count + 1, users: [...r.users, userHandle] }
              : r
          );
        }
      } else {
        newReactions = [...currentReactions, { emoji, count: 1, users: [userHandle] }];
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
    <div className="flex flex-col h-full bg-[#0a0a0a] text-white font-body border-l border-white/10">
      {/* Header Info */}
      <div className="p-3 border-b border-white/10 bg-[#000000] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-white text-[18px]">
            forum
          </span>
          <div>
            <div className="font-code text-xs font-bold text-white flex items-center gap-1.5">
              <span>#room-discussion</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
            </div>
            <div className="text-[10px] text-neutral-500 font-code">
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
              className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white border border-black shadow overflow-hidden"
              style={{ backgroundColor: m.avatarColor || "#0066FF" }}
            >
              {m.avatarUrl ? (
                <img src={m.avatarUrl} alt={m.name} className="w-full h-full object-cover" />
              ) : (
                m.initials || m.name.slice(0, 1)
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 font-body text-xs">
        {messages.map((msg) => {
          const isMe = msg.senderName === user.handle || msg.senderId === user.id || msg.senderName === "YOU";

          return (
            <div
              key={msg.id}
              className={`flex flex-col group ${isMe ? "items-end" : "items-start"}`}
            >
              {/* Sender & Timestamp */}
              <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-neutral-500">
                <div
                  className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white overflow-hidden shrink-0"
                  style={{ backgroundColor: msg.senderColor }}
                >
                  {msg.senderAvatarUrl ? (
                    <img src={msg.senderAvatarUrl} alt={msg.senderName} className="w-full h-full object-cover" />
                  ) : (
                    msg.senderName.slice(0, 1).toUpperCase()
                  )}
                </div>
                <span className="font-bold text-neutral-300">@{msg.senderName}</span>
                <span>• {msg.timestamp}</span>
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[88%] p-3 rounded-2xl border relative shadow-sm ${
                  isMe
                    ? "bg-white/10 border-white/20 text-white rounded-br-none"
                    : "bg-[#050505] border-white/10 text-neutral-200 rounded-bl-none"
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>

                {/* Attached Code Reference */}
                {msg.codeRef && (
                  <div
                    onClick={() => onOpenCodeRef && onOpenCodeRef(msg.codeRef!.fileName)}
                    className="mt-2 p-2 rounded-xl bg-[#000000] border border-white/15 cursor-pointer hover:border-white/30 transition-colors"
                  >
                    <div className="flex items-center justify-between text-[10px] text-white mb-1 font-bold">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px] text-[#0066FF]">code</span>
                        {msg.codeRef.fileName}
                      </span>
                      <span className="text-neutral-500 font-code">{msg.codeRef.lines}</span>
                    </div>
                    {msg.codeRef.snippet && (
                      <pre className="text-[10px] text-neutral-400 overflow-x-auto whitespace-pre font-code">
                        <code>{msg.codeRef.snippet}</code>
                      </pre>
                    )}
                  </div>
                )}

                {/* Reactions list */}
                {msg.reactions && msg.reactions.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {msg.reactions.map((reaction, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleReaction(msg.id, reaction.emoji)}
                        className={`text-[10px] px-2 py-0.5 rounded-full border flex items-center gap-1 transition-all ${
                          reaction.users.includes(user.handle)
                            ? "bg-white/15 border-white/30 text-white font-bold"
                            : "bg-[#000000] border-white/10 text-neutral-400 hover:text-white"
                        }`}
                      >
                        <span>{reaction.emoji}</span>
                        <span>{reaction.count}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="p-3 border-t border-white/10 bg-[#000000] space-y-2">
        {attachedCode && (
          <div className="flex items-center justify-between bg-[#0a0a0a] border border-white/15 rounded-xl px-2.5 py-1.5 text-[10px] text-neutral-300">
            <span className="flex items-center gap-1 font-code text-white">
              <span className="material-symbols-outlined text-[14px] text-[#0066FF]">code</span>
              {attachedCode.fileName} ({attachedCode.lines})
            </span>
            <button
              type="button"
              onClick={() => setAttachedCode(null)}
              className="text-neutral-500 hover:text-white"
            >
              <span className="material-symbols-outlined text-[14px]">close</span>
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Type a message or discuss code..."
            value={inputContent}
            onChange={(e) => setInputContent(e.target.value)}
            className="flex-1 bg-[#050505] border border-white/15 rounded-full px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white/30"
          />
          <button
            type="button"
            onClick={handleAttachActiveCode}
            title="Attach active file snippet"
            className="p-2 rounded-full border border-white/10 hover:border-white/25 text-neutral-400 hover:text-white bg-white/5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">attachment</span>
          </button>
          <button
            type="submit"
            disabled={!inputContent.trim() && !attachedCode}
            className="px-3.5 py-2 rounded-full bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-all cursor-pointer disabled:opacity-40"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
