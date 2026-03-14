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
  Terminal,
} from "lucide-react";

export default function HomePage() {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600/20 text-brand-400">
              <Terminal size={22} />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold text-white">
                Mavjud Testlar
              </h1>
              <p className="mt-0.5 text-sm text-surface-400">
                Kiberxavfsizlik bo&apos;yicha testni tanlang va boshlang
              </p>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" label="Testlar yuklanmoqda..." />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2 rounded-xl border border-danger/30 bg-danger/10 p-4 text-sm text-danger">
            <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Test cards */}
        {!loading && !error && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tests.map((test, idx) => (
              <div
                key={test.id}
                className="card group relative overflow-hidden transition-all duration-300 hover:border-brand-600/40 hover:shadow-lg hover:shadow-brand-600/5"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                {/* Accent bar */}
                <div className="absolute left-0 top-0 h-full w-1 bg-brand-600" />

                <div className="pl-4">
                  {/* Title */}
                  <div className="flex items-start justify-between">
                    <h2 className="font-display text-lg font-bold text-white">
                      {test.title}
                    </h2>
                    <ShieldCheck
                      size={20}
                      className="flex-shrink-0 text-surface-600"
                    />
                  </div>

                  {/* Description */}
                  {test.description && (
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-surface-400">
                      {test.description}
                    </p>
                  )}

                  {/* Meta */}
                  <div className="mt-4 flex items-center gap-3 text-xs text-surface-500">
                    <span className="rounded-full border border-surface-700 bg-surface-800/50 px-2.5 py-1 font-mono font-medium text-surface-300">
                      {test.question_count} ta savol
                    </span>
                  </div>

                  {/* Action */}
                  <div className="mt-5">
                    <Link
                      href={`/test/${test.id}`}
                      className="btn-primary w-full"
                    >
                      Testni boshlash
                      <ArrowRight
                        size={16}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && tests.length === 0 && (
          <div className="py-20 text-center">
            <ShieldCheck
              size={48}
              className="mx-auto mb-4 text-surface-600"
            />
            <h3 className="font-display text-lg font-semibold text-surface-300">
              Testlar mavjud emas
            </h3>
            <p className="mt-1 text-sm text-surface-500">
              Keyinroq yangi testlar uchun tekshirib ko&apos;ring.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
