import { WorkspaceFile, WorkspaceProject } from "@/types/workspace";

const ROOM_FILES_PREFIX = "codemesh_room_files_";
const WORKSPACES_KEY = "codemesh_workspaces_list";

export function generateTemplateFiles(
  template: string = "python-ds",
  roomName: string = "workspace"
): WorkspaceFile[] {
  const norm = template.toLowerCase();

  if (norm.includes("rust")) {
    return [
      {
        id: "f_rs_main",
        name: "main.rs",
        language: "rust",
        isEntry: true,
        content: `use std::sync::Arc;
use tokio::sync::RwLock;

#[derive(Debug, Clone)]
pub struct StreamEvent {
    pub room_id: String,
    pub payload: String,
}

pub struct WorkspaceManager {
    pub active_room: String,
}

impl WorkspaceManager {
    pub fn new(room_id: &str) -> Self {
        println!("[CodeMesh Rust Engine] Initializing workspace for: {}", room_id);
        Self {
            active_room: room_id.to_string(),
        }
    }

    pub async fn dispatch_event(&self, event: StreamEvent) {
        println!("[Dispatch] Emitting event in room {}: {}", self.active_room, event.payload);
    }
}

#[tokio::main]
async fn main() {
    println!("--- CodeMesh Rust Worker Active ---");
    let manager = WorkspaceManager::new("${roomName}");
    let event = StreamEvent {
        room_id: "${roomName}".to_string(),
        payload: "AST Synchronized with pgvector".to_string(),
    };
    manager.dispatch_event(event).await;
    println!("Worker pipeline completed successfully.");
}
`,
      },
      {
        id: "f_rs_cargo",
        name: "Cargo.toml",
        language: "toml",
        content: `[package]
name = "${roomName}"
version = "0.1.0"
edition = "2021"

[dependencies]
tokio = { version = "1.38", features = ["full"] }
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
`,
      },
      {
        id: "f_rs_readme",
        name: "README.md",
        language: "markdown",
        content: `# ${roomName}

High-performance Rust distributed worker room in CodeMesh.
Run \`run\` or \`cargo run\` in the terminal to execute.
`,
      },
    ];
  }

  if (norm.includes("node") || norm.includes("typescript") || norm.includes("react")) {
    return [
      {
        id: "f_ts_index",
        name: "index.ts",
        language: "typescript",
        isEntry: true,
        content: `// CodeMesh Node.js / TypeScript Workspace
export interface UserPresence {
  userId: string;
  room: string;
  cursor: { line: number; col: number };
}

export function broadcastPresence(presence: UserPresence): string {
  const timestamp = new Date().toISOString();
  console.log(\`[\${timestamp}] Presence broadcast for user \${presence.userId} in room '\${presence.room}'\`);
  return \`Sync OK at \${timestamp}\`;
}

// Interactive Test Execution
console.log("=== Launching CodeMesh TypeScript App ===");
const currentPresence: UserPresence = {
  userId: "engineer_01",
  room: "${roomName}",
  cursor: { line: 12, col: 4 }
};

const status = broadcastPresence(currentPresence);
console.log("Status Result:", status);
`,
      },
      {
        id: "f_ts_package",
        name: "package.json",
        language: "json",
        content: `{
  "name": "${roomName}",
  "version": "1.0.0",
  "main": "index.ts",
  "scripts": {
    "start": "ts-node index.ts",
    "test": "vitest run"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.40.0"
  }
}
`,
      },
      {
        id: "f_ts_readme",
        name: "README.md",
        language: "markdown",
        content: `# ${roomName} - TypeScript API

Run \`node index.ts\` or click **Run** in the terminal to execute live in browser.
`,
      },
    ];
  }

  if (norm.includes("blank")) {
    return [
      {
        id: "f_blank_main",
        name: "main.py",
        language: "python",
        isEntry: true,
        content: `# CodeMesh Blank Workspace: ${roomName}
# Start writing your code below...

def greet():
    print("Welcome to your CodeMesh collaborative room: ${roomName}!")

if __name__ == "__main__":
    greet()
`,
      },
      {
        id: "f_blank_readme",
        name: "README.md",
        language: "markdown",
        content: `# ${roomName}

Clean slate workspace. Add new files using the '+' icon in the Explorer sidebar.
`,
      },
    ];
  }

  // Default: Python Data Science with Stream Engine
  return [
    {
      id: "f_py_main",
      name: "main.py",
      language: "python",
      isEntry: true,
      content: `import os
import sys
import time
from typing import List, Dict

# CodeMesh Stream Engine - Room: ${roomName}
def process_data_stream(stream_id: str, payload: Dict) -> bool:
    """
    Executes high-throughput stream processing with collaborative
    AST sync and automated pgvector RAG memory mapping.
    """
    try:
        buffer_size = payload.get('buffer', 2048)
        if not stream_id:
            raise ValueError("Stream ID cannot be null")
        
        print(f"[CodeMesh Engine] Ingesting stream '{stream_id}' with buffer size {buffer_size}...")
        
        # Simulated payload processing
        data_packets = payload.get('data', ['packet_01', 'packet_02', 'packet_03', 'packet_04'])
        print(f"[CodeMesh] Successfully processed {len(data_packets)} records.")
        return True
        
    except Exception as e:
        print(f"[Error] Stream failure: {e}")
        return False

if __name__ == "__main__":
    print("=== Launching CodeMesh Python Pipeline ===")
    test_payload = {
        "buffer": 2048,
        "data": ["alpha_tensor", "beta_vector", "gamma_matrix", "delta_embedding"]
    }
    success = process_data_stream("${roomName}", test_payload)
    print(f"Pipeline finished with status: {success}")
`,
    },
    {
      id: "f_py_utils",
      name: "utils.py",
      language: "python",
      content: `import time
import logging

logger = logging.getLogger("codemesh.stream")

def get_optimal_buffer() -> int:
    """Calculates dynamic buffer size based on room concurrency."""
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
      id: "f_py_config",
      name: "config.json",
      language: "json",
      content: `{
  "workspace_id": "${roomName}",
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
}

export function getRoomFiles(roomId: string, template?: string): WorkspaceFile[] {
  if (typeof window === "undefined") {
    return generateTemplateFiles(template, roomId);
  }

  try {
    const cached = localStorage.getItem(`${ROOM_FILES_PREFIX}${roomId}`);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Could not read room files from localStorage:", e);
  }

  const initial = generateTemplateFiles(template, roomId);
  saveRoomFiles(roomId, initial);
  return initial;
}

export function saveRoomFiles(roomId: string, files: WorkspaceFile[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${ROOM_FILES_PREFIX}${roomId}`, JSON.stringify(files));
  } catch (e) {
    console.error("Failed to save room files to localStorage:", e);
  }
}

export function getStoredWorkspaces(): WorkspaceProject[] {
  const defaults: WorkspaceProject[] = [
    {
      id: "compsci-101-final",
      title: "CompSci 101 Final",
      description: "Collaborative environment for final project algorithms and data structures.",
      template: "python-ds",
      tags: [
        { name: "Python", variant: "primary" },
        { name: "Jupyter", variant: "neutral" },
      ],
      activeAgo: "2h ago",
      membersCount: 2,
      files: [],
    },
    {
      id: "hackathon-app",
      title: "Hackathon App",
      description: "React Native mobile application prototype for the weekend hackathon.",
      template: "nodejs",
      tags: [
        { name: "TypeScript", variant: "primary" },
        { name: "React", variant: "neutral" },
      ],
      activeAgo: "1d ago",
      membersCount: 1,
      files: [],
    },
    {
      id: "distributed-stream-engine",
      title: "Distributed Stream Engine",
      description: "High-throughput event consumer with pgvector semantic similarity search pipeline.",
      template: "rust-worker",
      tags: [
        { name: "Rust", variant: "primary" },
        { name: "Tokio", variant: "neutral" },
      ],
      activeAgo: "Just now",
      membersCount: 3,
      files: [],
    },
  ];

  if (typeof window === "undefined") return defaults;

  try {
    const stored = localStorage.getItem(WORKSPACES_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Could not read workspaces from storage:", e);
  }

  saveStoredWorkspaces(defaults);
  return defaults;
}

export function saveStoredWorkspaces(workspaces: WorkspaceProject[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(WORKSPACES_KEY, JSON.stringify(workspaces));
  } catch (e) {
    console.error("Failed to save workspaces list:", e);
  }
}

export function addStoredWorkspace(workspace: WorkspaceProject): WorkspaceProject[] {
  const current = getStoredWorkspaces();
  const exists = current.some((w) => w.id === workspace.id);
  const updated = exists
    ? current.map((w) => (w.id === workspace.id ? workspace : w))
    : [workspace, ...current];
  saveStoredWorkspaces(updated);
  return updated;
}

export function deleteStoredWorkspace(workspaceId: string): WorkspaceProject[] {
  const current = getStoredWorkspaces();
  const updated = current.filter((w) => w.id !== workspaceId);
  saveStoredWorkspaces(updated);
  if (typeof window !== "undefined") {
    localStorage.removeItem(`${ROOM_FILES_PREFIX}${workspaceId}`);
  }
  return updated;
}
