export interface WorkspaceFile {
  id: string;
  name: string;
  language: string;
  content: string;
  isEntry?: boolean;
}

export interface RoomMember {
  id: string;
  name: string;
  color?: string;
  avatarColor?: string;
  initials?: string;
  status?: string;
  cursor?: { line: number; col: number };
  activeFile?: string;
  activeLine?: number;
  currentAction?: string;
  isHost?: boolean;
}

export interface AIChatMessage {
  id: string;
  sender?: "user" | "ai" | "system";
  role?: "user" | "ai" | "assistant" | "system";
  text: string;
  timestamp: string;
  codeSnippet?: string;
}

export interface TeamChatCodeRef {
  fileName: string;
  lines?: string;
  snippet?: string;
}

export interface TeamChatReaction {
  emoji: string;
  count: number;
  users: string[];
}

export interface TeamChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  senderColor: string;
  content: string;
  codeRef?: TeamChatCodeRef;
  timestamp: string;
  reactions?: TeamChatReaction[];
}

export interface WorkspaceProject {
  id: string;
  title: string;
  description: string;
  membersCount: number;
  activeAgo: string;
  tags: { name: string; variant: "primary" | "default" | "neutral" }[];
  template?: string;
  files?: WorkspaceFile[];
}
