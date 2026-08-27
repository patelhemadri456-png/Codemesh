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
  avatarColor: string;
  initials: string;
  status: "active" | "idle" | "offline";
  isHost?: boolean;
  activeLine?: number;
  currentAction?: "editing" | "viewing" | "running";
}

export interface CollaborativeCursor {
  memberId: string;
  name: string;
  color: string;
  line: number;
  column: number;
}

export interface AIChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  text: string;
  codeSnippet?: string;
  timestamp: string;
  isStreaming?: boolean;
}

export interface WorkspaceProject {
  id: string;
  title: string;
  description: string;
  template: "blank" | "python-ds" | "nodejs" | "rust-worker";
  tags: { name: string; variant: "primary" | "neutral" }[];
  activeAgo: string;
  membersCount: number;
  files: WorkspaceFile[];
}
