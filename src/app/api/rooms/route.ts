import { NextRequest, NextResponse } from "next/server";

// In-memory / cache store for rooms
const rooms = [
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
    membersCount: 3,
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
    membersCount: 2,
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
    membersCount: 4,
  },
];

export async function GET() {
  return NextResponse.json({ rooms });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, template } = body;

    const slug = title
      ? title.toLowerCase().replace(/[^a-z0-9]+/g, "-")
      : "room-" + Math.random().toString(36).substring(2, 8);

    const newRoom = {
      id: slug,
      title: title || "New Workspace",
      description: `Collaborative workspace built with ${template || "Standard"} template.`,
      template: template || "blank",
      tags: [{ name: template?.includes("Python") ? "Python" : "TypeScript", variant: "primary" as const }],
      activeAgo: "Just now",
      membersCount: 1,
    };

    rooms.unshift(newRoom);
    return NextResponse.json({ room: newRoom });
  } catch (error) {
    console.error("Rooms API error:", error);
    return NextResponse.json({ error: "Failed to create room" }, { status: 500 });
  }
}
