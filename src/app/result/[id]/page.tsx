"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import ResultCard from "@/components/ResultCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import api from "@/services/api";
import type { SubmitResponse, TestResult } from "@/types";
import { ArrowLeft, RotateCcw, AlertCircle } from "lucide-react";

export default function ResultPage() {
  const params = useParams();
  const router = useRouter();
  const testId = params.id as string;

  const [result, setResult] = useState<SubmitResponse | null>(null);
  const [testTitle, setTestTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadResult() {
      const cached = sessionStorage.getItem(`result_${testId}`);
      if (cached) {
        try {
          setResult(JSON.parse(cached));
          sessionStorage.removeItem(`result_${testId}`);
          setLoading(false);
          return;
        } catch {
          /* fall through to API */
        }
      }

      try {
        const { data } = await api.get<TestResult[]>("/tests/results/");
        const match = data.find((r) => r.test === Number(testId));
        if (match) {
          setResult({
            total_questions: match.total_questions,
            correct_answers: match.correct_answers,
            wrong_answers: match.wrong_answers,
            score: Number(match.score),
          });
          setTestTitle(match.test_title);
        } else {
          setError("Natija topilmadi.");
        }
      } catch {
        setError("Natijani yuklashda xatolik.");
      } finally {
        setLoading(false);
      }
    }

    loadResult();
  }, [testId]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        <Navbar />

        <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-20">
              <LoadingSpinner size="lg" label="Natija yuklanmoqda..." />
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-danger/30 bg-danger/10 p-4 text-sm text-danger">
              <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
              <div>
                <p>{error}</p>
                <button
                  onClick={() => router.push("/dashboard")}
                  className="mt-2 text-sm font-medium text-brand-400 hover:text-brand-300"
                >
                  ← Bosh sahifaga qaytish
                </button>
              </div>
            </div>
          )}

          {/* Result */}
          {!loading && !error && result && (
            <div className="animate-slide-up">
              <div className="mb-8 text-center">
                <h1 className="font-display text-3xl font-bold text-white">
                  Test natijasi
                </h1>
                <p className="mt-1 text-surface-400">
                  Sizning ko&apos;rsatkichlaringiz
                </p>
              </div>

              <ResultCard result={result} testTitle={testTitle} />

              {/* Actions */}
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Link href="/dashboard" className="btn-secondary">
                  <ArrowLeft size={16} />
                  Bosh sahifa
                </Link>

                <button
                  onClick={() => window.location.reload()}
                  className="btn-secondary"
                >
                  <RotateCcw size={16} />
                  Yangilash
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
