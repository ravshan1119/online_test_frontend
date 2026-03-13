"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { LogOut, Shield, User } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 border-b border-surface-800/80 bg-surface-950/90 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/dashboard"
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
          {user ? (
            <>
              <div className="flex items-center gap-2.5 rounded-full border border-surface-700 bg-surface-800/60 py-1.5 pl-2 pr-4">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-600/20 text-brand-400">
                  <User size={14} />
                </div>
                <span className="hidden text-sm font-medium text-surface-300 sm:inline">
                  {user.first_name} {user.last_name}
                </span>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 rounded-lg border border-transparent px-3 py-2 text-sm font-medium text-surface-400 transition-all hover:border-danger/30 hover:bg-danger/10 hover:text-danger"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Chiqish</span>
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 rounded-lg border border-surface-700 px-3 py-2 text-sm font-medium text-surface-400 transition-all hover:border-brand-600/40 hover:text-brand-400"
            >
              Kirish
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
