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
    // SDK afterInteractive bilan yuklanadi, biroz kechikish kerak
    const init = () => {
      try {
        const tg = window.Telegram?.WebApp;
        if (tg && tg.initData) {
          tg.ready();
          tg.expand();
          setWebApp(tg);
        }
      } catch {
        // Telegram ichida emas — xato bermaydi
      }
    };

    // SDK hali yuklanmagan bo'lsa kutamiz
    if (window.Telegram?.WebApp) {
      init();
    } else {
      const timer = setTimeout(init, 500);
      return () => clearTimeout(timer);
    }
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
