"use client";

import { AuthProvider } from "@/context/AuthContext";
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
        <AuthProvider>{children}</AuthProvider>
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-yellow-500 text-black text-center py-2 text-sm font-semibold shadow-lg">
          ⚠ Sayt test rejimida ishlamoqda
        </div>
      </body>
    </html>
  );
}
