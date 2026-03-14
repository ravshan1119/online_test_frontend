"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import LoadingSpinner from "@/components/LoadingSpinner";
import api from "@/services/api";
import type { Test } from "@/types";
import {
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  Lock,
  Zap,
  MapPin,
} from "lucide-react";

const SLOGANS = [
  {
    icon: Zap,
    text: "Kiber-hujum qurboniga aylanmang, bilimingizni hoziroq sinang!",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10 border-yellow-400/20",
  },
  {
    icon: MapPin,
    text: "Jizzax ahli uchun maxsus: Kiber-xavfsizlik bo'yicha onlayn imtihon.",
    color: "text-brand-400",
    bg: "bg-brand-600/10 border-brand-600/20",
  },
  {
    icon: Lock,
    text: "Sizning parolingiz haqiqatan ham mustahkammi? Testda tekshirib ko'ring.",
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
  },
];

export default function HomePage() {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeSlogan, setActiveSlogan] = useState(0);

  useEffect(() => {
    async function fetchTests() {
      try {
        const { data } = await api.get<Test[]>("/tests/");
        setTests(data);
      } catch {
        setError("Testlarni yuklashda xatolik. Qayta urinib ko'ring.");
      } finally {
        setLoading(false);
      }
    }
    fetchTests();
  }, []);

  /* Rotate slogans every 3.5s */
  useEffect(() => {
    const timer = setInterval(
      () => setActiveSlogan((p) => (p + 1) % SLOGANS.length),
      3500
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* ── Hero / Slogans ── */}
        <div className="mb-10 overflow-hidden rounded-2xl border border-surface-800 bg-gradient-to-br from-surface-900 via-surface-900 to-brand-600/5 p-6 sm:p-8">
          {/* Badge */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-600/30 bg-brand-600/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-400">
            <ShieldCheck size={13} />
            Kiberxavfsizlik platformasi
          </div>

          <h1 className="font-display text-2xl font-bold leading-snug text-white sm:text-3xl">
            Bilimingizni sinab ko&apos;ring —{" "}
            <span className="text-brand-400">hoziroq!</span>
          </h1>

          {/* Rotating slogan */}
          <div className="mt-6 min-h-[64px]">
            {SLOGANS.map((s, i) => {
              const Icon = s.icon;
              return (
                <div
                  key={i}
                  className={`flex items-start gap-3 rounded-xl border p-4 transition-all duration-500 ${s.bg} ${
                    activeSlogan === i
                      ? "opacity-100 translate-y-0"
                      : "absolute opacity-0 pointer-events-none -translate-y-2"
                  }`}
                  style={{
                    position: activeSlogan === i ? "relative" : "absolute",
                  }}
                >
                  <Icon size={20} className={`mt-0.5 flex-shrink-0 ${s.color}`} />
                  <p className={`text-sm font-medium leading-relaxed ${s.color}`}>
                    {s.text}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Slogan dots */}
          <div className="mt-4 flex items-center gap-2">
            {SLOGANS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveSlogan(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeSlogan === i
                    ? "w-6 bg-brand-400"
                    : "w-1.5 bg-surface-600 hover:bg-surface-500"
                }`}
              />
            ))}
          </div>
        </div>

        {/* ── Section heading ── */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-white">
            Mavjud testlar
          </h2>
          {!loading && !error && tests.length > 0 && (
            <span className="rounded-full border border-surface-700 bg-surface-800/50 px-3 py-1 font-mono text-xs font-medium text-surface-400">
              {tests.length} ta test
            </span>
          )}
        </div>

        {/* ── Loading ── */}
        {loading && (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" label="Testlar yuklanmoqda..." />
          </div>
        )}

        {/* ── Error ── */}
        {error && (
          <div className="flex items-start gap-2 rounded-xl border border-danger/30 bg-danger/10 p-4 text-sm text-danger">
            <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* ── Test cards ── */}
        {!loading && !error && tests.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tests.map((test, idx) => (
              <div
                key={test.id}
                className="group relative overflow-hidden rounded-2xl border border-surface-800 bg-surface-900/80 p-5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-600/40 hover:shadow-lg hover:shadow-brand-600/5"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                {/* Accent bar */}
                <div className="absolute left-0 top-0 h-full w-1 rounded-l-2xl bg-gradient-to-b from-brand-400 to-brand-700" />

                <div className="pl-3">
                  {/* Number badge */}
                  <div className="mb-3 inline-flex items-center gap-1.5 rounded-lg border border-surface-700 bg-surface-800/60 px-2.5 py-1 font-mono text-xs font-bold text-surface-400">
                    #{String(idx + 1).padStart(2, "0")}
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-base font-bold leading-snug text-white">
                    {test.title}
                  </h3>

                  {/* Description */}
                  {test.description && (
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-surface-400">
                      {test.description}
                    </p>
                  )}

                  {/* Meta */}
                  <div className="mt-4 flex items-center justify-between">
                    <span className="rounded-full border border-brand-600/20 bg-brand-600/10 px-2.5 py-1 font-mono text-xs font-semibold text-brand-400">
                      {test.question_count} ta savol
                    </span>
                    <ShieldCheck size={16} className="text-surface-600" />
                  </div>

                  {/* CTA */}
                  <Link
                    href={`/test/${test.id}`}
                    className="btn-primary mt-4 w-full text-sm"
                  >
                    Testni boshlash
                    <ArrowRight
                      size={15}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Empty state ── */}
        {!loading && !error && tests.length === 0 && (
          <div className="rounded-2xl border border-surface-800 bg-surface-900/50 py-20 text-center">
            <ShieldCheck size={44} className="mx-auto mb-4 text-surface-700" />
            <h3 className="font-display text-base font-semibold text-surface-400">
              Hozircha testlar mavjud emas
            </h3>
            <p className="mt-1 text-sm text-surface-600">
              Keyinroq qaytib ko&apos;ring.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
