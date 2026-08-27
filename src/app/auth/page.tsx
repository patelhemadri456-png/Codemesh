"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setUserSession } from "@/lib/authSession";
import confetti from "canvas-confetti";

export default function AuthPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [handle, setHandle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const userHandle = handle.trim() || email.split("@")[0] || "engineer";
    setUserSession({
      handle: userHandle,
      email: email.trim() || `${userHandle}@codemesh.dev`,
    });

    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    setTimeout(() => {
      router.push("/workspaces");
    }, 400);
  };

  const handleGitHubAuth = () => {
    setUserSession({
      handle: "octocat_dev",
      email: "octocat@github.com",
      avatarColor: "#adc6ff",
    });
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    router.push("/workspaces");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#131313] relative overflow-hidden">
      {/* Subtle Dot Grid Background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: "radial-gradient(#2d2d2d 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Back to Home Link */}
      <Link
        href="/"
        className="absolute top-6 left-6 text-xs font-code text-[#8c909f] hover:text-[#adc6ff] flex items-center gap-1.5 transition-colors z-20"
      >
        <span className="material-symbols-outlined text-[16px]">arrow_back</span>
        <span>Back to CodeMesh</span>
      </Link>

      {/* Auth Container Card */}
      <main className="w-full max-w-[420px] bg-[#1c1b1b] border border-[#424754] rounded-lg shadow-2xl relative overflow-hidden z-10">
        {/* Top subtle accent line */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-[#adc6ff] opacity-80" />

        {/* Header */}
        <header className="pt-8 pb-6 px-8 border-b border-[#424754]/50 flex flex-col items-center bg-[#201f1f]">
          <div className="flex items-center gap-2 mb-5">
            <span
              className="material-symbols-outlined text-[#adc6ff] text-[28px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              terminal
            </span>
            <h1 className="font-headline text-2xl font-bold text-[#adc6ff] tracking-tight">
              CodeMesh
            </h1>
          </div>

          <div className="w-full flex rounded border border-[#424754] p-[3px] bg-[#131313]">
            <button
              type="button"
              className={`flex-1 py-1.5 text-center font-code text-xs font-semibold rounded transition-colors ${
                tab === "login"
                  ? "bg-[#353534] text-[#e5e2e1]"
                  : "text-[#c2c6d6] hover:text-[#e5e2e1]"
              }`}
              onClick={() => setTab("login")}
            >
              LOGIN
            </button>
            <button
              type="button"
              className={`flex-1 py-1.5 text-center font-code text-xs font-semibold rounded transition-colors ${
                tab === "signup"
                  ? "bg-[#353534] text-[#e5e2e1]"
                  : "text-[#c2c6d6] hover:text-[#e5e2e1]"
              }`}
              onClick={() => setTab("signup")}
            >
              SIGN UP
            </button>
          </div>
        </header>

        {/* Login Form */}
        {tab === "login" && (
          <section className="p-8 pb-9">
            <h2 className="font-headline text-lg font-semibold text-[#e5e2e1] mb-6">
              Access Workspace
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block font-code text-xs text-[#c2c6d6] mb-1.5 uppercase tracking-wider">
                  Email address
                </label>
                <input
                  type="email"
                  required
                  placeholder="engineer@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#131313] border border-[#424754] text-[#e5e2e1] font-code text-xs p-2.5 rounded focus:border-[#adc6ff] focus:outline-none transition-colors placeholder:text-[#8c909f]"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block font-code text-xs text-[#c2c6d6] uppercase tracking-wider">
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-xs text-[#adc6ff] hover:underline"
                  >
                    Reset
                  </a>
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#131313] border border-[#424754] text-[#e5e2e1] font-code text-xs p-2.5 rounded focus:border-[#adc6ff] focus:outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 w-full bg-[#adc6ff] text-[#002e6a] font-code text-xs font-bold py-3 rounded hover:bg-[#d8e2ff] transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(173,198,255,0.2)]"
              >
                <span>{isLoading ? "AUTHENTICATING..." : "AUTHENTICATE"}</span>
                <span className="material-symbols-outlined text-[16px]">
                  arrow_forward
                </span>
              </button>
            </form>

            <div className="mt-6 flex items-center gap-3">
              <div className="h-px bg-[#424754] flex-1"></div>
              <span className="font-code text-[10px] text-[#8c909f] uppercase tracking-wider">
                OR CONTINUE WITH
              </span>
              <div className="h-px bg-[#424754] flex-1"></div>
            </div>

            <div className="mt-5">
              <button
                type="button"
                onClick={handleGitHubAuth}
                className="w-full flex items-center justify-center gap-3 bg-[#131313] border border-[#424754] py-2.5 rounded hover:bg-[#201f1f] transition-colors text-xs font-medium text-[#e5e2e1]"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
                </svg>
                GitHub
              </button>
            </div>
          </section>
        )}

        {/* Sign Up Form */}
        {tab === "signup" && (
          <section className="p-8 pb-9">
            <h2 className="font-headline text-lg font-semibold text-[#e5e2e1] mb-6">
              Initialize Account
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block font-code text-xs text-[#c2c6d6] mb-1.5 uppercase tracking-wider">
                  Developer Handle
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. alex_code"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  className="w-full bg-[#131313] border border-[#424754] text-[#e5e2e1] font-code text-xs p-2.5 rounded focus:border-[#adc6ff] focus:outline-none transition-colors placeholder:text-[#8c909f]"
                />
              </div>

              <div>
                <label className="block font-code text-xs text-[#c2c6d6] mb-1.5 uppercase tracking-wider">
                  Email address
                </label>
                <input
                  type="email"
                  required
                  placeholder="engineer@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#131313] border border-[#424754] text-[#e5e2e1] font-code text-xs p-2.5 rounded focus:border-[#adc6ff] focus:outline-none transition-colors placeholder:text-[#8c909f]"
                />
              </div>

              <div>
                <label className="block font-code text-xs text-[#c2c6d6] mb-1.5 uppercase tracking-wider">
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#131313] border border-[#424754] text-[#e5e2e1] font-code text-xs p-2.5 rounded focus:border-[#adc6ff] focus:outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 w-full bg-[#adc6ff] text-[#002e6a] font-code text-xs font-bold py-3 rounded hover:bg-[#d8e2ff] transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(173,198,255,0.2)]"
              >
                <span>{isLoading ? "PROVISIONING..." : "PROVISION WORKSPACE"}</span>
                <span className="material-symbols-outlined text-[16px]">
                  add_box
                </span>
              </button>
            </form>

            <p className="mt-5 text-center text-xs text-[#8c909f] leading-relaxed">
              By provisioning, you agree to our{" "}
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
        )}

        {/* Footer info inside card */}
        <footer className="bg-[#131313] border-t border-[#424754]/50 py-3 px-8 flex justify-between items-center text-xs font-code text-[#8c909f]">
          <span>v2.4.1-stable</span>
          <span className="flex items-center gap-1.5 text-[#adc6ff]">
            <span className="w-2 h-2 rounded-full bg-[#adc6ff] inline-block animate-pulse"></span>
            Systems Operational
          </span>
        </footer>
      </main>
    </div>
  );
}
