/* ------------------------------------------------------------------ */
/*  JWT token helpers (client-side only)                               */
/*                                                                     */
/*  Tokens are stored in localStorage.                                 */
/*  For httpOnly cookie auth, you'd proxy requests through a           */
/*  Next.js API route — this is the simpler SPA-friendly approach.     */
/* ------------------------------------------------------------------ */

import type { AuthTokens } from "@/types";

const ACCESS_KEY = "access_token";
const REFRESH_KEY = "refresh_token";

/* ---- helpers to guard SSR ---- */
const isBrowser = () => typeof window !== "undefined";

/* ---- getters ---- */
export function getAccessToken(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(REFRESH_KEY);
}

/* ---- setters ---- */
export function setTokens(tokens: AuthTokens): void {
  if (!isBrowser()) return;
  localStorage.setItem(ACCESS_KEY, tokens.access);
  localStorage.setItem(REFRESH_KEY, tokens.refresh);
}

/* ---- clear ---- */
export function clearTokens(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

/* ---- check ---- */
export function isAuthenticated(): boolean {
  return !!getAccessToken();
}

/* ---- parse JWT payload (no verification — just decode) ---- */
export function parseJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const base64 = token.split(".")[1];
    const json = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = parseJwtPayload(token);
  if (!payload || typeof payload.exp !== "number") return true;
  return Date.now() >= payload.exp * 1000;
}