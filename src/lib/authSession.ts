export type AppTheme = "dark" | "light";

export interface UserSession {
  id: string;
  handle: string;
  email: string;
  avatarColor: string;
  avatarUrl?: string;
  provider?: "google" | "github" | "email";
  theme?: AppTheme;
  initials: string;
  isLoggedIn: boolean;
  createdAt: string;
}

export interface StoredAccount {
  id: string;
  handle: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  avatarColor: string;
}

const STORAGE_KEY = "codemesh_user_session";
const THEME_STORAGE_KEY = "codemesh_theme_preference";
const ACCOUNTS_STORAGE_KEY = "codemesh_registered_accounts";

const defaultGuestUser: UserSession = {
  id: "guest_user",
  handle: "engineer",
  email: "engineer@company.com",
  avatarColor: "#4d8eff",
  provider: "email",
  theme: "dark",
  initials: "YOU",
  isLoggedIn: false,
  createdAt: new Date().toISOString(),
};

export function getThemePreference(): AppTheme {
  if (typeof window === "undefined") return "dark";
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as AppTheme;
    if (saved === "light" || saved === "dark") return saved;
  } catch (e) {
    console.warn("Could not read theme preference:", e);
  }
  return "dark";
}

export function setThemePreference(theme: AppTheme): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
    }
    window.dispatchEvent(new CustomEvent("codemesh:theme_change", { detail: { theme } }));
  } catch (e) {
    console.error("Could not set theme preference:", e);
  }
}

export function getUserSession(): UserSession {
  if (typeof window === "undefined") return defaultGuestUser;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.warn("Could not parse user session:", e);
  }
  return defaultGuestUser;
}

export function setUserSession(user: Partial<UserSession>): UserSession {
  if (typeof window === "undefined") return defaultGuestUser;
  const current = getUserSession();
  const handle = user.handle || current.handle || "developer";
  const initials = handle.slice(0, 2).toUpperCase();

  const colors = ["#4d8eff", "#adc6ff", "#d0bcff", "#ffb786", "#df7412", "#005ac2"];
  const colorIndex = Math.abs(
    handle.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length
  );

  const updated: UserSession = {
    ...current,
    ...user,
    id: user.id || current.id || `usr_${Math.random().toString(36).substring(2, 9)}`,
    handle,
    initials,
    avatarColor: user.avatarColor || colors[colorIndex],
    theme: user.theme || current.theme || "dark",
    isLoggedIn: true,
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("codemesh:auth_change"));
  } catch (e) {
    console.error("Failed to save user session:", e);
  }

  return updated;
}

export function logoutUser(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event("codemesh:auth_change"));
  } catch (e) {
    console.error("Failed to logout user:", e);
  }
}

// ----------------------------------------------------
// Real Local Accounts Store (for actual verification)
// ----------------------------------------------------

export function getRegisteredAccounts(): StoredAccount[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("Could not load accounts:", e);
  }
  return [];
}

export function registerLocalAccount(
  handle: string,
  email: string,
  password: string
): { success: boolean; error?: string; account?: StoredAccount } {
  if (typeof window === "undefined") return { success: false, error: "Window unavailable" };

  const accounts = getRegisteredAccounts();
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedHandle = handle.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");

  if (accounts.some((acc) => acc.email.toLowerCase() === normalizedEmail)) {
    return { success: false, error: "An account with this email already exists. Please sign in." };
  }

  const colors = ["#4d8eff", "#0066ff", "#10b981", "#ff7e33", "#a855f7"];
  const colorIndex = Math.abs(normalizedHandle.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % colors.length);

  const newAccount: StoredAccount = {
    id: `usr_${Math.random().toString(36).substring(2, 9)}`,
    handle: normalizedHandle || "engineer",
    email: normalizedEmail,
    passwordHash: btoa(password), // standard client encoding
    createdAt: new Date().toISOString(),
    avatarColor: colors[colorIndex],
  };

  accounts.push(newAccount);
  try {
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
  } catch (e) {
    return { success: false, error: "Storage quota exceeded" };
  }

  return { success: true, account: newAccount };
}

export function verifyLocalCredentials(
  email: string,
  password: string
): { success: boolean; error?: string; account?: StoredAccount } {
  const accounts = getRegisteredAccounts();
  const normalizedEmail = email.trim().toLowerCase();
  const account = accounts.find((acc) => acc.email.toLowerCase() === normalizedEmail);

  if (!account) {
    return { success: false, error: "No account found with this email. Please create an account." };
  }

  if (account.passwordHash !== btoa(password)) {
    return { success: false, error: "Incorrect password. Please try again." };
  }

  return { success: true, account };
}
