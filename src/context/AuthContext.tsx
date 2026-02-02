"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

import api from "@/services/api";
import {
  clearTokens,
  getAccessToken,
  isAuthenticated as checkAuth,
  setTokens,
} from "@/services/auth";

import type {
  AuthTokens,
  LoginPayload,
  RegisterPayload,
  RegisterResponse,
  UserProfile,
} from "@/types";

/* ------------------------------------------------------------------ */
/*  Context shape                                                      */
/* ------------------------------------------------------------------ */

interface AuthContextValue {
  user: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  register: (data: RegisterPayload) => Promise<void>;
  login: (data: LoginPayload) => Promise<void>;
  logout: () => void;
  fetchProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  /* ---- fetch profile on mount if token exists ---- */
  const fetchProfile = useCallback(async () => {
    if (!checkAuth()) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.get<UserProfile>("/auth/profile/");
      setUser(data);
    } catch {
      clearTokens();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  /* ---- register ---- */
  const register = async (payload: RegisterPayload) => {
    const { data } = await api.post<RegisterResponse>(
      "/auth/register/",
      payload
    );
    setTokens(data.tokens);
    await fetchProfile();
    router.push("/dashboard");
  };

  /* ---- login ---- */
  const login = async (payload: LoginPayload) => {
    const { data } = await api.post<AuthTokens>("/auth/login/", payload);
    setTokens(data);
    await fetchProfile();
    router.push("/dashboard");
  };

  /* ---- logout ---- */
  const logout = () => {
    clearTokens();
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user && checkAuth(),
        register,
        login,
        logout,
        fetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}