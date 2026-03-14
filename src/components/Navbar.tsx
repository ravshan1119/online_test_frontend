"use client";

import Link from "next/link";
import { Shield, ShieldCheck } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-surface-800/80 bg-surface-950/90 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-display text-xl font-bold text-white transition-colors hover:text-brand-400"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white shadow-md shadow-brand-600/20">
            <Shield size={20} />
          </div>
          <span className="hidden sm:inline">
            Cyber<span className="text-brand-400">Test</span>
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <Link
            href="/verify"
            className="flex items-center gap-1.5 rounded-lg border border-surface-700 px-3 py-2 text-sm font-medium text-surface-400 transition-all hover:border-brand-600/40 hover:text-brand-400"
          >
            <ShieldCheck size={16} />
            <span className="hidden sm:inline">Sertifikat tekshirish</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
