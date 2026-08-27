import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code && isSupabaseConfigured && supabase) {
    try {
      await supabase.auth.exchangeCodeForSession(code);
    } catch (e) {
      console.error("Error exchanging OAuth code:", e);
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL("/workspaces", request.url));
}
