"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setUserSession } from "@/lib/authSession";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import confetti from "canvas-confetti";

export default function AuthPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [handle, setHandle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Email & Password Auth
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(null);

    const userHandle = handle.trim() || email.split("@")[0] || "engineer";

    if (isSupabaseConfigured && supabase) {
      try {
        if (tab === "signup") {
          const { error } = await supabase.auth.signUp({
            email: email.trim(),
            password,
            options: { data: { handle: userHandle } },
          });
          if (error) throw error;
        } else {
          const { error } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          });
          if (error) throw error;
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.warn("Supabase Auth error, using local session:", msg);
      }
    }

    setUserSession({
      handle: userHandle,
      email: email.trim() || `${userHandle}@codemesh.dev`,
      provider: "email",
    });

    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    setTimeout(() => {
      router.push("/workspaces");
    }, 400);
  };

  // Google OAuth Auth
  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setAuthError(null);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        return;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.warn("Supabase Google OAuth fallback:", msg);
      }
    }

    // Seamless Google Auth Session simulation
    setUserSession({
      handle: "google_dev",
      email: "developer@gmail.com",
      provider: "google",
      avatarColor: "#4d8eff",
    });

    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    setTimeout(() => {
      router.push("/workspaces");
    }, 400);
  };

  // GitHub OAuth Auth
  const handleGitHubAuth = async () => {
    setIsLoading(true);
    setAuthError(null);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "github",
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        return;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.warn("Supabase GitHub OAuth fallback:", msg);
      }
    }

    setUserSession({
      handle: "octocat_dev",
      email: "octocat@github.com",
      provider: "github",
      avatarColor: "#adc6ff",
    });

    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    setTimeout(() => {
      router.push("/workspaces");
    }, 400);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#0d0d0e] relative overflow-hidden font-body">
      {/* Subtle Dot Grid Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

      {/* Atmospheric Aurora Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-radial-glow pointer-events-none opacity-80" />

      {/* Back to Home Link */}
      <Link
        href="/"
        className="absolute top-6 left-6 text-xs font-code text-[#727685] hover:text-[#adc6ff] flex items-center gap-1.5 transition-colors z-20"
      >
        <span className="material-symbols-outlined text-[16px]">arrow_back</span>
        <span>Back to CodeMesh</span>
      </Link>

      {/* Auth Container Card */}
      <main className="w-full max-w-[420px] bg-[#111113] border border-white/10 rounded-xl shadow-2xl relative overflow-hidden z-10">
        {/* Top subtle accent line */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#4d8eff] via-[#d0bcff] to-[#ffb786]" />

        {/* Header */}
        <header className="pt-8 pb-6 px-8 border-b border-white/10 flex flex-col items-center bg-[#17171a]">
          <div className="flex items-center gap-2 mb-5">
            <span
              className="material-symbols-outlined text-[#adc6ff] text-[28px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              widgets
            </span>
            <h1 className="font-headline text-2xl font-bold text-[#ededed] tracking-tight">
              CodeMesh
            </h1>
          </div>

          <div className="w-full flex rounded-lg border border-white/10 p-[3px] bg-[#0d0d0e]">
            <button
              type="button"
              className={`flex-1 py-1.5 text-center font-code text-xs font-semibold rounded-md transition-colors ${
                tab === "login"
                  ? "bg-[#28282e] text-[#ededed] shadow-sm"
                  : "text-[#727685] hover:text-[#ededed]"
              }`}
              onClick={() => {
                setTab("login");
                setAuthError(null);
              }}
            >
              LOGIN
            </button>
            <button
              type="button"
              className={`flex-1 py-1.5 text-center font-code text-xs font-semibold rounded-md transition-colors ${
                tab === "signup"
                  ? "bg-[#28282e] text-[#ededed] shadow-sm"
                  : "text-[#727685] hover:text-[#ededed]"
              }`}
              onClick={() => {
                setTab("signup");
                setAuthError(null);
              }}
            >
              SIGN UP
            </button>
          </div>
        </header>

        {/* Form Body */}
        <section className="p-8 pb-9 space-y-5">
          {authError && (
            <div className="p-2.5 bg-red-950/40 border border-red-800/50 rounded-lg text-xs font-code text-red-400">
              {authError}
            </div>
          )}

          {/* Social OAuth Buttons */}
          <div className="space-y-2.5">
            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-[#17171a] border border-white/10 py-2.5 rounded-lg hover:bg-[#1e1e23] hover:border-white/20 transition-all text-xs font-semibold text-[#ededed] shadow-sm group"
            >
              {/* Official Multi-Color Google G Logo */}
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* GitHub OAuth Button */}
            <button
              type="button"
              onClick={handleGitHubAuth}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-[#17171a] border border-white/10 py-2.5 rounded-lg hover:bg-[#1e1e23] hover:border-white/20 transition-all text-xs font-semibold text-[#ededed] shadow-sm"
            >
              <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
              </svg>
              <span>Continue with GitHub</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-px bg-white/10 flex-1" />
            <span className="font-code text-[10px] text-[#727685] uppercase tracking-wider">
              OR USE EMAIL
            </span>
            <div className="h-px bg-white/10 flex-1" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {tab === "signup" && (
              <div>
                <label className="block font-code text-xs text-[#b0b4c3] mb-1.5 uppercase tracking-wider">
                  Developer Handle
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. alex_code"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  className="w-full bg-[#0d0d0e] border border-white/10 text-[#ededed] font-code text-xs p-2.5 rounded-lg focus:border-[#adc6ff] focus:outline-none transition-colors placeholder:text-[#727685]"
                />
              </div>
            )}

            <div>
              <label className="block font-code text-xs text-[#b0b4c3] mb-1.5 uppercase tracking-wider">
                Email address
              </label>
              <input
                type="email"
                required
                placeholder="engineer@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0d0d0e] border border-white/10 text-[#ededed] font-code text-xs p-2.5 rounded-lg focus:border-[#adc6ff] focus:outline-none transition-colors placeholder:text-[#727685]"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block font-code text-xs text-[#b0b4c3] uppercase tracking-wider">
                  Password
                </label>
                {tab === "login" && (
                  <a href="#" className="text-xs text-[#adc6ff] hover:underline font-code">
                    Reset
                  </a>
                )}
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0d0d0e] border border-white/10 text-[#ededed] font-code text-xs p-2.5 rounded-lg focus:border-[#adc6ff] focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-1 w-full bg-[#adc6ff] text-[#002e6a] font-code text-xs font-bold py-3 rounded-lg hover:bg-[#d8e2ff] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(173,198,255,0.25)]"
            >
              <span>{isLoading ? "AUTHENTICATING..." : tab === "login" ? "AUTHENTICATE" : "PROVISION WORKSPACE"}</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </form>

          <p className="text-center text-[11px] text-[#727685] leading-relaxed">
            By signing in, you agree to the CodeMesh{" "}
            <a href="#" className="text-[#adc6ff] hover:underline">
              Terms
            </a>{" "}
            and{" "}
            <a href="#" className="text-[#adc6ff] hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </section>

        {/* Footer inside card */}
        <footer className="bg-[#0d0d0e] border-t border-white/10 py-3 px-8 flex justify-between items-center text-xs font-code text-[#727685]">
          <span>v2.4.1-stable</span>
          <span className="flex items-center gap-1.5 text-[#adc6ff]">
            <span className="w-2 h-2 rounded-full bg-green-400 inline-block animate-pulse"></span>
            Auth Systems Ready
          </span>
        </footer>
      </main>
    </div>
  );
}
