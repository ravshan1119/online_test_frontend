"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import LoadingSpinner from "@/components/LoadingSpinner";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import type { Test, TestResult } from "@/types";
import {
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Terminal,
} from "lucide-react";

export default function DashboardPage() {
  const { isAuthenticated } = useAuth();
  const [tests, setTests] = useState<Test[]>([]);
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const testsRes = await api.get<Test[]>("/tests/");
        setTests(testsRes.data);

        if (isAuthenticated) {
          const resultsRes = await api.get<TestResult[]>("/tests/results/");
          setResults(resultsRes.data);
        }
      } catch {
        setError("Testlarni yuklashda xatolik. Qayta urinib ko'ring.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [isAuthenticated]);

  const resultMap = new Map(results.map((r) => [r.test, r]));

  return (
    <ProtectedRoute>
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
              {tests.map((test, idx) => {
                const result = resultMap.get(test.id);
                const completed = !!result;

                return (
                  <div
                    key={test.id}
                    className="card group relative overflow-hidden transition-all duration-300 hover:border-brand-600/40 hover:shadow-lg hover:shadow-brand-600/5"
                    style={{ animationDelay: `${idx * 80}ms` }}
                  >
                    {/* Accent bar */}
                    <div
                      className={`absolute left-0 top-0 h-full w-1 ${
                        completed ? "bg-brand-400" : "bg-brand-600"
                      }`}
                    />

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
                          20 ta savol
                        </span>
                      </div>

                      {/* Action */}
                      <div className="mt-5">
                        {completed ? (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-sm font-medium text-brand-400">
                              <CheckCircle2 size={16} />
                              Yakunlangan — {Number(result.score)}%
                            </div>
                            <Link
                              href={`/result/${result.id}`}
                              className="flex items-center gap-1 text-sm font-medium text-surface-400 transition-colors hover:text-brand-400"
                            >
                              <BarChart3 size={15} />
                              Natija
                            </Link>
                          </div>
                        ) : (
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
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
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

          {/* Results section */}
          {!loading && results.length > 0 && (
            <section className="mt-12">
              <h2 className="mb-5 font-display text-xl font-bold text-white">
                Sizning natijalaringiz
              </h2>
              <div className="overflow-hidden rounded-xl border border-surface-800 bg-surface-900/80">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-surface-800 bg-surface-800/50">
                      <th className="px-5 py-3 text-left font-semibold text-surface-400">
                        Test
                      </th>
                      <th className="hidden px-5 py-3 text-center font-semibold text-surface-400 sm:table-cell">
                        To&apos;g&apos;ri
                      </th>
                      <th className="hidden px-5 py-3 text-center font-semibold text-surface-400 sm:table-cell">
                        Xato
                      </th>
                      <th className="px-5 py-3 text-center font-semibold text-surface-400">
                        Ball
                      </th>
                      <th className="px-5 py-3 text-right font-semibold text-surface-400">
                        Sana
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r) => (
                      <tr
                        key={r.id}
                        className="border-b border-surface-800/50 last:border-0 hover:bg-surface-800/30"
                      >
                        <td className="px-5 py-3.5 font-medium text-surface-200">
                          {r.test_title}
                        </td>
                        <td className="hidden px-5 py-3.5 text-center text-brand-400 sm:table-cell">
                          {r.correct_answers}
                        </td>
                        <td className="hidden px-5 py-3.5 text-center text-danger sm:table-cell">
                          {r.wrong_answers}
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <span
                            className={`inline-block rounded-full px-2.5 py-0.5 font-mono text-xs font-bold ${
                              Number(r.score) >= 90
                                ? "bg-brand-600/20 text-brand-400"
                                : "bg-danger/20 text-danger"
                            }`}
                          >
                            {Number(r.score)}%
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right font-mono text-xs text-surface-500">
                          {new Date(r.submitted_at).toLocaleDateString("uz-UZ")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
