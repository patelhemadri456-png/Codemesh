import { NextRequest, NextResponse } from "next/server";
import { generateCodeAssistance } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, codeContext, activeFile, allFiles } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const result = await generateCodeAssistance({
      prompt,
      codeContext,
      activeFile,
      allFiles,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("AI chat route error:", error);
    return NextResponse.json(
      {
        text: "Error generating response. Using local fallback cache.",
        codeSnippet: `// Local fallback patch\nexport const buffer = 4096;`,
      },
      { status: 500 }
    );
  }
}
