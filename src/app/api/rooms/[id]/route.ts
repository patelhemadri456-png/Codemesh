import { NextRequest, NextResponse } from "next/server";
import { generateTemplateFiles } from "@/lib/roomStorage";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const template = req.nextUrl.searchParams.get("template") || "python-ds";
  const files = generateTemplateFiles(template, id);

  return NextResponse.json({
    roomId: id,
    template,
    files,
  });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { files } = body;

  return NextResponse.json({
    success: true,
    roomId: id,
    filesCount: Array.isArray(files) ? files.length : 0,
    savedAt: new Date().toISOString(),
  });
}
