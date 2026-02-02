"use client";

import { useState, useEffect, useCallback, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Shield, UserPlus, AlertCircle, RefreshCw } from "lucide-react";
import type { RegisterPayload } from "@/types";
import { AxiosError } from "axios";

/* ---- Simple math captcha generator ---- */
function generateCaptcha() {
  const ops = ["+", "-"] as const;
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a: number, b: number, answer: number;

  if (op === "+") {
    a = Math.floor(Math.random() * 50) + 1;
    b = Math.floor(Math.random() * 50) + 1;
    answer = a + b;
  } else {
    a = Math.floor(Math.random() * 50) + 10;
    b = Math.floor(Math.random() * a);
    answer = a - b;
  }

  return { question: `${a} ${op} ${b} = ?`, answer };
}

/* ---- Passport formatter: AB1234567 ---- */
function formatPassport(raw: string): string {
  // Remove anything that's not a letter or digit
  const cleaned = raw.replace(/[^A-Za-z0-9]/g, "");

  // First 2 chars = letters only, rest = digits only, max 9 total
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

export default function RegisterPage() {
  const { register, isAuthenticated } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState<RegisterPayload>({
    first_name: "",
    last_name: "",
    middle_name: "",
    passport_series_number: "",
    workplace: "",
    position: "",
    password: "",
    password_confirm: "",
  });

  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);

  /* Captcha state */
  const [captcha, setCaptcha] = useState(() => generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaError, setCaptchaError] = useState("");

  const refreshCaptcha = useCallback(() => {
    setCaptcha(generateCaptcha());
    setCaptchaInput("");
    setCaptchaError("");
  }, []);

  /* Fix: redirect in useEffect instead of during render */
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) return null;

  const handleChange = (field: keyof RegisterPayload, value: string) => {
    if (field === "passport_series_number") {
      value = formatPassport(value);
    }
    setForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: [] }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setCaptchaError("");

    /* Validate passport format */
    if (!/^[A-Z]{2}\d{7}$/.test(form.passport_series_number)) {
      setFieldErrors((prev) => ({
        ...prev,
        passport_series_number: ["Format: AB1234567 (2 harf + 7 raqam)"],
      }));
      return;
    }

    /* Validate captcha */
    if (Number(captchaInput) !== captcha.answer) {
      setCaptchaError("Noto'g'ri javob. Qayta urinib ko'ring.");
      refreshCaptcha();
      return;
    }

    setSubmitting(true);

    try {
      await register(form);
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response?.data) {
        const data = err.response.data;
        if (data.details) {
          setFieldErrors(data.details);
        } else {
          setError(data.message || "Ro'yxatdan o'tish muvaffaqiyatsiz.");
        }
      } else {
        setError("Tarmoq xatosi. Qayta urinib ko'ring.");
      }
      refreshCaptcha();
    } finally {
      setSubmitting(false);
    }
  };

  const fieldDef: {
    key: keyof RegisterPayload;
    label: string;
    type?: string;
    placeholder: string;
    maxLength?: number;
  }[] = [
    { key: "first_name", label: "Ism", placeholder: "Ravshan" },
    { key: "last_name", label: "Familiya", placeholder: "Allamurotov" },
    {
      key: "middle_name",
      label: "Otasining ismi",
      placeholder: "Bekzod",
    },
    {
      key: "passport_series_number",
      label: "Pasport seriya va raqam",
      placeholder: "AB1234567",
      maxLength: 9,
    },
    { key: "workplace", label: "Ish joyi", placeholder: "Tashkilot nomi" },
    { key: "position", label: "Lavozim", placeholder: "Mutaxassis" },
    {
      key: "password",
      label: "Parol",
      type: "password",
      placeholder: "Kamida 8 ta belgi",
    },
    {
      key: "password_confirm",
      label: "Parolni tasdiqlash",
      type: "password",
      placeholder: "Parolni qayta kiriting",
    },
  ];

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-10">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-600/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg animate-slide-up">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-brand-600/30 bg-brand-600/10 text-brand-400 shadow-lg shadow-brand-600/10">
            <Shield size={32} />
          </div>
          <h1 className="font-display text-2xl font-bold text-white">
            Ro&apos;yxatdan o&apos;tish
          </h1>
          <p className="mt-2 text-sm text-surface-400">
            Kiberxavfsizlik testlarini boshlash uchun ro&apos;yxatdan
            o&apos;ting
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 flex items-start gap-2 rounded-xl border border-danger/30 bg-danger/10 p-4 text-sm text-danger">
            <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="card space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {fieldDef.map(({ key, label, type, placeholder, maxLength }) => (
              <div
                key={key}
                className={
                  key === "passport_series_number" ||
                  key === "workplace" ||
                  key === "position"
                    ? "sm:col-span-2"
                    : ""
                }
              >
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-surface-400">
                  {label}
                </label>
                <input
                  type={type || "text"}
                  className={`input-field ${
                    key === "passport_series_number"
                      ? "font-mono uppercase tracking-widest"
                      : ""
                  } ${
                    fieldErrors[key]?.length
                      ? "border-danger focus:border-danger focus:ring-danger/20"
                      : ""
                  }`}
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={(e) => handleChange(key, e.target.value)}
                  maxLength={maxLength}
                  required
                />
                {key === "passport_series_number" && (
                  <p className="mt-1 font-mono text-[10px] text-surface-500">
                    Format: AA0000000 (2 harf + 7 raqam)
                  </p>
                )}
                {fieldErrors[key]?.map((msg, i) => (
                  <p key={i} className="mt-1 text-xs text-danger">
                    {msg}
                  </p>
                ))}
              </div>
            ))}
          </div>

          {/* Captcha */}
          <div className="rounded-xl border border-surface-700 bg-surface-800/50 p-4">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-surface-400">
                Xavfsizlik tekshiruvi
              </label>
              <button
                type="button"
                onClick={refreshCaptcha}
                className="flex items-center gap-1 text-xs text-surface-500 transition-colors hover:text-brand-400"
              >
                <RefreshCw size={12} />
                Yangilash
              </button>
            </div>

            <div className="mb-3 flex items-center justify-center rounded-lg border border-surface-600 bg-surface-900 py-3">
              <span className="select-none font-mono text-xl font-bold tracking-wider text-brand-400">
                {captcha.question}
              </span>
            </div>

            <input
              type="number"
              className={`input-field font-mono text-center text-lg ${
                captchaError
                  ? "border-danger focus:border-danger focus:ring-danger/20"
                  : ""
              }`}
              placeholder="Javobni kiriting"
              value={captchaInput}
              onChange={(e) => {
                setCaptchaInput(e.target.value);
                setCaptchaError("");
              }}
              required
            />
            {captchaError && (
              <p className="mt-1.5 flex items-center gap-1 text-xs text-danger">
                <AlertCircle size={12} />
                {captchaError}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary mt-2 w-full"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Ro&apos;yxatdan o&apos;tilmoqda...
              </span>
            ) : (
              <>
                <UserPlus size={18} />
                Ro&apos;yxatdan o&apos;tish
              </>
            )}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-surface-500">
          Akkauntingiz bormi?{" "}
          <Link
            href="/login"
            className="font-semibold text-brand-400 hover:text-brand-300"
          >
            Kirish
          </Link>
        </p>
      </div>
    </div>
  );
}
