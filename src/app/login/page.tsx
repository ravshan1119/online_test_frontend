"use client";

import { useState, useEffect, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Shield,
  LogIn,
  AlertCircle,
  Lock,
  KeyRound,
  UserPlus,
} from "lucide-react";
import { AxiosError } from "axios";

/* ---- Passport formatter: AB1234567 ---- */
function formatPassport(raw: string): string {
  const cleaned = raw.replace(/[^A-Za-z0-9]/g, "");
  let letters = "";
  let digits = "";

  for (const ch of cleaned) {
    if (letters.length < 2 && /[A-Za-z]/.test(ch)) {
      letters += ch.toUpperCase();
    } else if (letters.length === 2 && /[0-9]/.test(ch) && digits.length < 7) {
      digits += ch;
    }
  }

  return letters + digits;
}

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  const [passport, setPassport] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  /* Fix: redirect in useEffect instead of during render */
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) return null;

  const handlePassportChange = (value: string) => {
    setPassport(formatPassport(value));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!/^[A-Z]{2}\d{7}$/.test(passport)) {
      setError("Pasport formati noto'g'ri. Format: AB1234567");
      return;
    }

    setSubmitting(true);

    try {
      await login({
        passport_series_number: passport,
        password,
      });
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response?.data) {
        const data = err.response.data;
        setError(data.message || "Noto'g'ri ma'lumotlar.");
      } else {
        setError("Tarmoq xatosi. Qayta urinib ko'ring.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-10">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-600/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-brand-600/30 bg-brand-600/10 text-brand-400 shadow-lg shadow-brand-600/10">
            <Shield size={32} />
          </div>
          <h1 className="font-display text-2xl font-bold text-white">
            Cyber<span className="text-brand-400">Test</span> Platform
          </h1>
          <p className="mt-2 text-sm text-surface-400">
            Kiberxavfsizlik testlariga kirish
          </p>
        </div>

        {/* Register CTA - birinchi ko'rsatiladi */}
        <div className="mb-5 rounded-xl border border-brand-600/20 bg-brand-600/5 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-brand-600/20 text-brand-400">
              <UserPlus size={18} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-surface-200">
                Hali ro&apos;yxatdan o&apos;tmaganmisiz?
              </p>
              <p className="mt-0.5 text-xs text-surface-400">
                Testlarni yechish uchun avval ro&apos;yxatdan o&apos;ting
              </p>
              <Link
                href="/register"
                className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-brand-500 hover:shadow-md hover:shadow-brand-600/20"
              >
                <UserPlus size={14} />
                Ro&apos;yxatdan o&apos;tish
              </Link>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="relative mb-5 flex items-center">
          <div className="flex-1 border-t border-surface-800" />
          <span className="px-3 text-xs text-surface-500">
            yoki tizimga kiring
          </span>
          <div className="flex-1 border-t border-surface-800" />
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 flex items-start gap-2 rounded-xl border border-danger/30 bg-danger/10 p-4 text-sm text-danger">
            <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="card space-y-5">
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-surface-400">
              <KeyRound size={12} />
              Pasport seriya va raqam
            </label>
            <input
              type="text"
              className="input-field font-mono uppercase tracking-widest"
              placeholder="AB1234567"
              value={passport}
              onChange={(e) => handlePassportChange(e.target.value)}
              maxLength={9}
              required
              autoFocus
            />
            <p className="mt-1 font-mono text-[10px] text-surface-500">
              Format: AA0000000 (2 harf + 7 raqam)
            </p>
          </div>

          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-surface-400">
              <Lock size={12} />
              Parol
            </label>
            <input
              type="password"
              className="input-field"
              placeholder="Parolingizni kiriting"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Kirish...
              </span>
            ) : (
              <>
                <LogIn size={18} />
                Kirish
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
