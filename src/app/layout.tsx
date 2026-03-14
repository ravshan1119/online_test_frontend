"use client";

import Script from "next/script";
import { TelegramProvider } from "@/context/TelegramContext";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz">
      <head>
        <title>CyberTest Platform</title>
        <meta
          name="description"
          content="Kiberxavfsizlik bo'yicha online test platformasi"
        />
      </head>
      <body className="cyber-bg">
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
        <TelegramProvider>{children}</TelegramProvider>
      </body>
    </html>
  );
}
