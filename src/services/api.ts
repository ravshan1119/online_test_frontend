/* ------------------------------------------------------------------ */
/*  Axios API client with JWT interceptors & automatic token refresh   */
/* ------------------------------------------------------------------ */

import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from "./auth";

import type { AuthTokens } from "@/types";

/* ---- base instance ---- */
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://reliable-zachariah-spangly.ngrok-free.dev/api/v1",
  headers: { "Content-Type": "application/json" },
  timeout: 15_000,
});

/* ---- request interceptor: attach Bearer token ---- */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ---- response interceptor: refresh on 401 ---- */
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach((prom) => {
    if (token) prom.resolve(token);
    else prom.reject(error);
  });
  failedQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    /* Only attempt refresh on 401, and only once per request */
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    /* Don't try to refresh if the failing request IS the refresh call */
    if (originalRequest.url?.includes("/auth/token/refresh")) {
      clearTokens();
      if (typeof window !== "undefined") window.location.href = "/login";
      return Promise.reject(error);
    }

    if (isRefreshing) {
      /* Queue concurrent requests while refreshing */
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(api(originalRequest));
          },
          reject: (err: unknown) => reject(err),
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const refresh = getRefreshToken();
    if (!refresh) {
      clearTokens();
      if (typeof window !== "undefined") window.location.href = "/login";
      return Promise.reject(error);
    }

    try {
      const { data } = await axios.post<AuthTokens>(
        `${api.defaults.baseURL}/auth/token/refresh/`,
        { refresh }
      );
      setTokens(data);
      processQueue(null, data.access);

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${data.access}`;
      }
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      clearTokens();
      if (typeof window !== "undefined") window.location.href = "/login";
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;