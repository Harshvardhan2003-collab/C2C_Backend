import { useCallback, useEffect, useState } from "react";
import api, { authStorage } from "@/lib/api";

export type Role = "student" | "industry" | "faculty";

type User = {
  email?: string;
  name?: string;
  picture?: string;
  role: Role;
};

type StoredAuth = {
  isAuthenticated: boolean;
  user?: User | null;
};

const STORAGE_KEY = "auth:state";

function inferRoleByEmail(email: string): Role {
  const domain = email.split("@")[1]?.toLowerCase() || "";
  if (domain.includes("edu") || domain.includes("ac.")) return "student";
  if (domain.includes("university") || domain.includes("college") || domain.includes("faculty")) return "faculty";
  if (domain.includes("inc") || domain.includes("llc") || domain.includes("corp") || domain.includes("company") || domain.includes("tech")) return "industry";
  // Fallback default
  return "student";
}

export function useAuth() {
  const [state, setState] = useState<StoredAuth>({ isAuthenticated: false, user: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load local copy for immediate UI, then sync with backend
    (async () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) setState(JSON.parse(raw) as StoredAuth);
      } catch {
        // ignore
      }
      try {
        const res = await api.get<{ data?: { isAuthenticated: boolean; user?: User | null } }>(
          "/auth/check-auth"
        );
        const isAuthenticated = !!res?.data?.isAuthenticated;
        const user = (res?.data?.user as User | undefined) ?? null;
        persist({ isAuthenticated, user });
      } catch {
        // Not authenticated or server down
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const persist = useCallback((s: StoredAuth) => {
    setState(s);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    } catch {
      void 0;
    }
  }, []);

  const login = useCallback((role?: Role) => {
    if (role) {
      const user = state.user ? { ...state.user, role } : ({ role } as User);
      persist({ isAuthenticated: true, user });
    } else {
      persist({ isAuthenticated: true, user: state.user ?? null });
    }
  }, [persist, state.user]);

  // Apply a backend session (store token and user)
  const applySession = useCallback((user: User | null | undefined, accessToken?: string) => {
    if (accessToken) authStorage.setAccessToken(accessToken);
    persist({ isAuthenticated: !!user, user: user ?? null });
  }, [persist]);

  // Exchange Google ID token with backend for session
  const loginWithGoogleToken = useCallback(async (googleIdToken: string) => {
    const res = await api.post<{ data?: { user: User; accessToken: string } }>(
      "/auth/google-login",
      { googleToken: googleIdToken }
    );
    const user = res?.data?.user as User;
    const accessToken = res?.data?.accessToken as string | undefined;
    applySession(user, accessToken);
    return { user, accessToken };
  }, [applySession]);

  const logout = useCallback(() => {
    (async () => {
      try {
        await api.post("/auth/logout");
      } catch {
        // ignore
      } finally {
        authStorage.setAccessToken(undefined);
        persist({ isAuthenticated: false, user: null });
      }
    })();
  }, [persist]);

  return {
    isAuthenticated: state.isAuthenticated,
    user: state.user,
    loading,
    login,
    logout,
    applySession,
    loginWithGoogleToken,
  };
}
