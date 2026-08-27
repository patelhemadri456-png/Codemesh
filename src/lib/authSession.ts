export interface UserSession {
  id: string;
  handle: string;
  email: string;
  avatarColor: string;
  avatarUrl?: string;
  provider?: "google" | "github" | "email";
  initials: string;
  isLoggedIn: boolean;
  createdAt: string;
}

const STORAGE_KEY = "codemesh_user_session";

const defaultGuestUser: UserSession = {
  id: "guest_user",
  handle: "engineer",
  email: "engineer@company.com",
  avatarColor: "#4d8eff",
  provider: "email",
  initials: "YOU",
  isLoggedIn: false,
  createdAt: new Date().toISOString(),
};

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
    handle,
    initials,
    avatarColor: user.avatarColor || colors[colorIndex],
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
