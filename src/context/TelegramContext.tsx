"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

/* ---------- Telegram WebApp type stubs ---------- */
interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    user?: TelegramUser;
    query_id?: string;
  };
  ready: () => void;
  expand: () => void;
  close: () => void;
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  BackButton: {
    show: () => void;
    hide: () => void;
    onClick: (cb: () => void) => void;
    offClick: (cb: () => void) => void;
  };
  MainButton: {
    text: string;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    onClick: (cb: () => void) => void;
    offClick: (cb: () => void) => void;
    setText: (text: string) => void;
    showProgress: (leaveActive?: boolean) => void;
    hideProgress: () => void;
  };
  colorScheme: "light" | "dark";
  themeParams: Record<string, string>;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

/* ---------- Context ---------- */
interface TelegramContextValue {
  webApp: TelegramWebApp | null;
  user: TelegramUser | null;
  isTelegram: boolean;
}

const TelegramContext = createContext<TelegramContextValue>({
  webApp: null,
  user: null,
  isTelegram: false,
});

export function TelegramProvider({ children }: { children: ReactNode }) {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);

  useEffect(() => {
    const init = () => {
      try {
        const tg = window.Telegram?.WebApp;
        if (tg) {
          tg.ready();
          tg.expand();
          setWebApp(tg);
          return true;
        }
      } catch (e) {
        console.warn("Telegram WebApp init xatosi:", e);
      }
      return false;
    };

    // SDK allaqachon yuklangan bo'lsa — darhol ishga tushiramiz
    if (init()) return;

    // SDK hali yuklanmagan — har 100ms da tekshiramiz, 5 sekundgacha kutamiz
    let attempts = 0;
    const maxAttempts = 50;
    const interval = setInterval(() => {
      attempts++;
      if (init() || attempts >= maxAttempts) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const value: TelegramContextValue = {
    webApp,
    user: webApp?.initDataUnsafe?.user ?? null,
    isTelegram: !!webApp,
  };

  return (
    <TelegramContext.Provider value={value}>
      {children}
    </TelegramContext.Provider>
  );
}

export function useTelegram() {
  return useContext(TelegramContext);
}
