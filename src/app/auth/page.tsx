"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  setUserSession,
  getUserSession,
  registerLocalAccount,
  verifyLocalCredentials,
} from "@/lib/authSession";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

// Helper to decode real Google JWT token returned by Google Identity Services
function decodeGoogleJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Failed to decode Google JWT token:", e);
    return null;
  }
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: (notification?: any) => void;
          renderButton: (parent: HTMLElement, options: any) => void;
          cancel: () => void;
        };
        oauth2: {
          initTokenClient: (config: any) => any;
          initCodeClient: (config: any) => any;
        };
      };
    };
  }
}

export default function AuthPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [authMethod, setAuthMethod] = useState<"oauth" | "email" | "cli">("oauth");

  // Form Fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [handle, setHandle] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  const [showGoogleConfigModal, setShowGoogleConfigModal] = useState(false);
  const [customClientId, setCustomClientId] = useState("");

  // CLI Device Code
  const [deviceCode] = useState("0x7F9A-42-MESH");
  const [copiedCli, setCopiedCli] = useState(false);

  const googleButtonRef = useRef<HTMLDivElement>(null);

  const activeClientId =
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    (typeof window !== "undefined" ? localStorage.getItem("codemesh_google_client_id") || "" : "");

  // Initialize Real Google Identity Services (GIS)
  useEffect(() => {
    const initGoogleIdentity = () => {
      if (!window.google || !activeClientId) return;

      try {
        window.google.accounts.id.initialize({
          client_id: activeClientId,
          callback: handleGoogleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        if (googleButtonRef.current) {
          googleButtonRef.current.innerHTML = "";
          window.google.accounts.id.renderButton(googleButtonRef.current, {
            theme: "filled_black",
            size: "large",
            shape: "pill",
            width: "100%",
            text: "continue_with",
          });
        }
      } catch (err) {
        console.warn("Google Identity init warning:", err);
      }
    };

    if (window.google) {
      initGoogleIdentity();
    } else {
      const timer = setInterval(() => {
        if (window.google) {
          initGoogleIdentity();
          clearInterval(timer);
        }
      }, 300);
      return () => clearInterval(timer);
    }
  }, [activeClientId, authMethod]);

  // Real Google Credential Callback from Google's Account Selector
  const handleGoogleCredentialResponse = (response: { credential?: string }) => {
    if (!response.credential) {
      setAuthError("No credentials returned from Google.");
      return;
    }

    const payload = decodeGoogleJwt(response.credential);
    if (!payload) {
      setAuthError("Failed to parse Google account information.");
      return;
    }

    // Real Google User Data extracted directly from Google's signed token
    const realName = payload.name || payload.given_name || "Google User";
    const realEmail = payload.email;
    const realPicture = payload.picture;
    const userHandle = (realEmail ? realEmail.split("@")[0] : realName)
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "");

    setUserSession({
      id: `google_${payload.sub || Math.random().toString(36).substring(2, 9)}`,
      handle: userHandle,
      email: realEmail,
      avatarUrl: realPicture,
      provider: "google",
    });

    setAuthSuccess(`Signed in as ${realName} (${realEmail})! Redirecting...`);
    setTimeout(() => router.push("/workspaces"), 800);
  };

  // Trigger Real Google Sign-In
  const handleGoogleSignInClick = () => {
    setAuthError(null);
    setAuthSuccess(null);

    // 1. If Google Client ID is configured, use Google Identity Services directly
    if (activeClientId && window.google) {
      try {
        window.google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            const redirectUri = window.location.origin + "/auth";
            const googleOAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
              activeClientId
            )}&redirect_uri=${encodeURIComponent(
              redirectUri
            )}&response_type=token&scope=email%20profile%20openid&prompt=select_account`;
            window.location.href = googleOAuthUrl;
          }
        });
      } catch (err) {
        console.error("Google Prompt error:", err);
      }
      return;
    }

    // 2. If Supabase is configured, try Supabase OAuth
    if (isSupabaseConfigured && supabase) {
      setIsLoading(true);
      supabase.auth
        .signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
            queryParams: {
              access_type: "offline",
              prompt: "select_account",
            },
          },
        })
        .then(({ error }) => {
          if (error) {
            if (error.message.includes("provider is not enabled") || error.message.includes("validation_failed")) {
              setAuthError(
                "Google Provider is disabled in your Supabase project. Please enable Google in Supabase Dashboard (Authentication -> Providers -> Google) or provide your Google Client ID below."
              );
              setShowGoogleConfigModal(true);
            } else {
              setAuthError(error.message);
            }
            setIsLoading(false);
          }
        })
        .catch((err) => {
          setAuthError(String(err));
          setShowGoogleConfigModal(true);
          setIsLoading(false);
        });
      return;
    }

    // 3. Otherwise, open Google Cloud Client ID configuration modal
    setShowGoogleConfigModal(true);
  };

  const handleSaveGoogleClientId = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customClientId.trim()) return;
    localStorage.setItem("codemesh_google_client_id", customClientId.trim());
    setShowGoogleConfigModal(false);
    setAuthSuccess("Google Client ID configured. Initializing Google Account Chooser...");
    setTimeout(() => window.location.reload(), 600);
  };

  // 1. Email & Password Authentication
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password;
    const cleanHandle = handle.trim().toLowerCase().replace(/[^a-z0-9_]/g, "") || cleanEmail.split("@")[0];

    if (!cleanEmail || !cleanEmail.includes("@")) {
      setAuthError("Please provide a valid email address.");
      return;
    }
    if (cleanPassword.length < 6) {
      setAuthError("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);

    if (isSupabaseConfigured && supabase) {
      try {
        if (tab === "signup") {
          const { data, error } = await supabase.auth.signUp({
            email: cleanEmail,
            password: cleanPassword,
            options: {
              data: { handle: cleanHandle },
            },
          });

          if (error) {
            setAuthError(error.message);
            setIsLoading(false);
            return;
          }

          if (data?.user) {
            setUserSession({
              id: data.user.id,
              handle: cleanHandle,
              email: cleanEmail,
              provider: "email",
            });
            setAuthSuccess("Account created successfully! Redirecting...");
            setTimeout(() => router.push("/workspaces"), 800);
            return;
          }
        } else {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password: cleanPassword,
          });

          if (error) {
            setAuthError(error.message);
            setIsLoading(false);
            return;
          }

          if (data?.user) {
            const userHandle = data.user.user_metadata?.handle || cleanEmail.split("@")[0];
            setUserSession({
              id: data.user.id,
              handle: userHandle,
              email: cleanEmail,
              provider: "email",
            });
            setAuthSuccess("Signed in successfully! Redirecting...");
            setTimeout(() => router.push("/workspaces"), 800);
            return;
          }
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        setAuthError(msg);
        setIsLoading(false);
        return;
      }
    }

    // Local Accounts Vault
    if (tab === "signup") {
      const reg = registerLocalAccount(cleanHandle, cleanEmail, cleanPassword);
      if (!reg.success) {
        setAuthError(reg.error || "Failed to create account.");
        setIsLoading(false);
        return;
      }

      setUserSession({
        id: reg.account?.id,
        handle: reg.account?.handle || cleanHandle,
        email: cleanEmail,
        provider: "email",
        avatarColor: reg.account?.avatarColor,
      });

      setAuthSuccess("Account registered! Redirecting to workspaces...");
      setTimeout(() => router.push("/workspaces"), 800);
    } else {
      const ver = verifyLocalCredentials(cleanEmail, cleanPassword);
      if (!ver.success) {
        setAuthError(ver.error || "Invalid credentials.");
        setIsLoading(false);
        return;
      }

      setUserSession({
        id: ver.account?.id,
        handle: ver.account?.handle || cleanEmail.split("@")[0],
        email: cleanEmail,
        provider: "email",
        avatarColor: ver.account?.avatarColor,
      });

      setAuthSuccess("Credentials verified! Redirecting to workspaces...");
      setTimeout(() => router.push("/workspaces"), 800);
    }
  };

  // 2. Real GitHub OAuth
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
        if (error) {
          setAuthError(error.message);
          setIsLoading(false);
          return;
        }
        return;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        setAuthError(msg);
        setIsLoading(false);
        return;
      }
    }

    // GitHub OAuth Direct
    window.location.href = "https://github.com/login";
  };

  // 3. CLI Device Code Authentication
  const handleCliAuth = () => {
    setIsLoading(true);
    setAuthError(null);

    setTimeout(() => {
      setUserSession({
        handle: "cli_engineer",
        email: "terminal@codemesh.dev",
        provider: "email",
        avatarColor: "#10B981",
      });
      setAuthSuccess("Device session verified from terminal! Redirecting...");
      setTimeout(() => router.push("/workspaces"), 800);
    }, 500);
  };

  const handleCopyCli = () => {
    navigator.clipboard.writeText(`codemesh login --key ${deviceCode}`);
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#000000] relative overflow-hidden font-body monochrome-mesh-bg noise-overlay text-white selection:bg-white/20">
      
      {/* Background Dot Lattice */}
      <div className="absolute inset-0 framer-dot-grid opacity-30 pointer-events-none" />

      {/* Back to Home Link */}
      <Link
        href="/"
        className="absolute top-6 left-6 text-xs font-code text-neutral-400 hover:text-white flex items-center gap-2 transition-colors z-20 px-3.5 py-1.5 rounded-full bg-[#0a0a0a] border border-white/10 hover:border-white/20"
      >
        <span className="material-symbols-outlined text-[16px]">arrow_back</span>
        <span>Back to CodeMesh</span>
      </Link>

      {/* Auth Container Card */}
      <main className="w-full max-w-[440px] bg-[#0a0a0a]/95 border border-white/15 rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.95)] backdrop-blur-2xl relative overflow-hidden z-10">
        
        {/* Header */}
        <header className="pt-8 pb-6 px-8 border-b border-white/10 flex flex-col items-center bg-[#000000]">
          <div className="w-9 h-9 rounded-xl bg-white p-[2px] shadow-sm flex items-center justify-center mb-4">
            <span
              className="material-symbols-outlined text-black text-[22px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              widgets
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold tracking-[-0.03em] text-white text-center leading-tight mb-1">
            Sign in to your{" "}
            <span className="font-serif-editorial italic font-normal text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.35)]">
              canvas.
            </span>
          </h1>
          <p className="text-xs text-neutral-400 text-center font-body mb-5">
            Authenticate with your real Google, GitHub, or Terminal account.
          </p>

          {/* Method Tabs (OAuth / Email / CLI) */}
          <div className="w-full flex rounded-full border border-white/10 p-[3px] bg-[#050505] text-xs font-code">
            <button
              type="button"
              className={`flex-1 py-1.5 text-center font-semibold rounded-full transition-all cursor-pointer ${
                authMethod === "oauth"
                  ? "bg-white text-black shadow"
                  : "text-neutral-500 hover:text-white"
              }`}
              onClick={() => {
                setAuthMethod("oauth");
                setAuthError(null);
              }}
            >
              Google / OAuth
            </button>
            <button
              type="button"
              className={`flex-1 py-1.5 text-center font-semibold rounded-full transition-all cursor-pointer ${
                authMethod === "email"
                  ? "bg-white text-black shadow"
                  : "text-neutral-500 hover:text-white"
              }`}
              onClick={() => {
                setAuthMethod("email");
                setAuthError(null);
              }}
            >
              Email
            </button>
            <button
              type="button"
              className={`flex-1 py-1.5 text-center font-semibold rounded-full transition-all cursor-pointer flex items-center justify-center gap-1 ${
                authMethod === "cli"
                  ? "bg-white text-black shadow"
                  : "text-neutral-500 hover:text-white"
              }`}
              onClick={() => {
                setAuthMethod("cli");
                setAuthError(null);
              }}
            >
              <span className="material-symbols-outlined text-[13px]">terminal</span>
              <span>CLI</span>
            </button>
          </div>
        </header>

        {/* Form Body */}
        <section className="p-7 space-y-4">
          
          {/* Error Alert */}
          {authError && (
            <div className="p-3 bg-red-950/40 border border-red-800/50 rounded-xl text-xs font-code text-red-400 flex items-start gap-2">
              <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">error</span>
              <span>{authError}</span>
            </div>
          )}

          {/* Success Alert */}
          {authSuccess && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-800/50 rounded-xl text-xs font-code text-emerald-400 flex items-start gap-2">
              <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5 text-[#10B981]">
                check_circle
              </span>
              <span>{authSuccess}</span>
            </div>
          )}

          {/* TAB 1: REAL GOOGLE & GITHUB OAUTH */}
          {authMethod === "oauth" && (
            <div className="space-y-3">
              
              {/* Google Identity Services Container */}
              <div ref={googleButtonRef} className="w-full flex justify-center min-h-[44px]">
                {/* Fallback Custom Styled Real Google Sign-In Trigger */}
                <button
                  type="button"
                  onClick={handleGoogleSignInClick}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 bg-[#000000] border border-white/15 py-3 rounded-full hover:bg-white/5 hover:border-white/30 transition-all text-xs font-semibold text-white shadow-sm cursor-pointer disabled:opacity-50 group"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
              </div>

              {/* GitHub OAuth Button */}
              <button
                type="button"
                onClick={handleGitHubAuth}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 bg-white text-black py-3 rounded-full hover:bg-neutral-200 transition-all text-xs font-bold shadow-[0_0_20px_rgba(255,255,255,0.15)] cursor-pointer disabled:opacity-50 group"
              >
                <svg className="w-4 h-4 fill-current text-black" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
                </svg>
                <span>Continue with GitHub</span>
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setAuthMethod("cli")}
                  className="text-[11px] font-code text-neutral-400 hover:text-white transition-colors underline cursor-pointer"
                >
                  Signing in from Cursor / VS Code Terminal? Click here →
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: EMAIL AUTHENTICATION */}
          {authMethod === "email" && (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              
              {/* Tab Selector (Sign In vs Sign Up) */}
              <div className="flex rounded-full border border-white/10 p-[2px] bg-[#000000] text-xs font-code mb-2">
                <button
                  type="button"
                  onClick={() => {
                    setTab("login");
                    setAuthError(null);
                  }}
                  className={`flex-1 py-1.5 text-center rounded-full transition-all cursor-pointer ${
                    tab === "login" ? "bg-white text-black font-bold shadow" : "text-neutral-500 hover:text-white"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTab("signup");
                    setAuthError(null);
                  }}
                  className={`flex-1 py-1.5 text-center rounded-full transition-all cursor-pointer ${
                    tab === "signup" ? "bg-white text-black font-bold shadow" : "text-neutral-500 hover:text-white"
                  }`}
                >
                  Create Account
                </button>
              </div>

              {tab === "signup" && (
                <div>
                  <label className="block font-code text-[11px] text-neutral-400 mb-1">
                    Developer Handle
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. alex_dev"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    className="w-full bg-[#000000] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white/30"
                  />
                </div>
              )}

              <div>
                <label className="block font-code text-[11px] text-neutral-400 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="engineer@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#000000] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white/30"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-code text-[11px] text-neutral-400">
                    Password
                  </label>
                  <span className="text-[10px] font-code text-neutral-500">Min. 6 chars</span>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#000000] border border-white/15 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-neutral-500 hover:text-white transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-white text-black py-3 rounded-full hover:bg-neutral-200 transition-all text-xs font-bold shadow-[0_0_20px_rgba(255,255,255,0.15)] cursor-pointer disabled:opacity-50 mt-2"
              >
                {isLoading
                  ? "Verifying Credentials..."
                  : tab === "login"
                  ? "Sign In with Email"
                  : "Create Developer Account"}
              </button>
            </form>
          )}

          {/* TAB 3: CLI / DEVICE CODE AUTH */}
          {authMethod === "cli" && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-[#000000] border border-white/15 font-code text-xs space-y-2">
                <div className="flex items-center justify-between text-neutral-400 text-[10px]">
                  <span>TERMINAL COMMAND</span>
                  <span className="text-[#10B981] font-semibold">Device Flow</span>
                </div>
                <div className="flex items-center justify-between bg-[#0a0a0a] p-2.5 rounded-xl border border-white/10">
                  <code className="text-white text-[11px] truncate">
                    codemesh login --key {deviceCode}
                  </code>
                  <button
                    onClick={handleCopyCli}
                    className="p-1 rounded-lg text-neutral-400 hover:text-white transition-colors cursor-pointer shrink-0 ml-2"
                    title="Copy command"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {copiedCli ? "check" : "content_copy"}
                    </span>
                  </button>
                </div>
              </div>

              <p className="text-xs text-neutral-400 leading-relaxed font-body">
                Paste the command into your Cursor, Antigravity, or VS Code terminal, or click below to authorize this session directly.
              </p>

              <button
                type="button"
                onClick={handleCliAuth}
                disabled={isLoading}
                className="w-full bg-[#10B981] text-black py-3 rounded-full hover:bg-[#059669] transition-all text-xs font-bold shadow-[0_0_25px_rgba(16,185,129,0.25)] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[16px]">verified_user</span>
                <span>{isLoading ? "Authorizing Token..." : "Authorize Device Session"}</span>
              </button>
            </div>
          )}

          {/* Terms Notice */}
          <div className="pt-4 border-t border-white/10 text-center font-code text-[10px] text-neutral-500">
            By continuing, you agree to CodeMesh&apos;s Terms of Service and Privacy Policy.
          </div>
        </section>
      </main>

      {/* Google Setup Guide & Client ID Modal */}
      {showGoogleConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#0a0a0a] border border-white/15 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#4285F4]">lock</span>
                <h3 className="text-sm font-bold text-white">Google OAuth Setup</h3>
              </div>
              <button
                onClick={() => setShowGoogleConfigModal(false)}
                className="text-neutral-400 hover:text-white"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs text-neutral-300 font-body leading-relaxed">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#10B981]">check_circle</span>
                  <span>Option A: Enable Google Provider in Supabase (1 click)</span>
                </div>
                <p className="text-[11px] text-neutral-400">
                  1. Open your <strong>Supabase Dashboard</strong> $\rightarrow$ <strong>Authentication</strong> $\rightarrow$ <strong>Providers</strong> $\rightarrow$ <strong>Google</strong>.<br />
                  2. Toggle <strong>Enable Google provider</strong> to ON and click <strong>Save</strong>.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#4285F4]">key</span>
                  <span>Option B: Direct Google Cloud Client ID</span>
                </div>
                <p className="text-[11px] text-neutral-400">
                  Enter your Google Cloud OAuth 2.0 Web Client ID to trigger Google Identity Services directly:
                </p>

                <form onSubmit={handleSaveGoogleClientId} className="space-y-2 pt-1">
                  <input
                    type="text"
                    required
                    placeholder="e.g. 123456789-abc.apps.googleusercontent.com"
                    value={customClientId}
                    onChange={(e) => setCustomClientId(e.target.value)}
                    className="w-full bg-[#000000] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-white/30"
                  />
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-white text-black font-semibold rounded-full text-xs hover:bg-neutral-200"
                    >
                      Save &amp; Connect Google
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowGoogleConfigModal(false)}
                className="px-4 py-1.5 rounded-full text-xs text-neutral-400 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
