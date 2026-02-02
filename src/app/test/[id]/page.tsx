"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import QuestionCard from "@/components/QuestionCard";
import Timer from "@/components/Timer";
import LoadingSpinner from "@/components/LoadingSpinner";
import api from "@/services/api";
import type { OptionLabel, Question, SubmitResponse } from "@/types";
import {
  ArrowLeft,
  ArrowRight,
  Send,
  AlertCircle,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";

const TEST_DURATION_SECONDS = 30 * 60;

export default function TestPage() {
  const params = useParams();
  const router = useRouter();
  const testId = Number(params.id);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Map<number, OptionLabel>>(new Map());
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await api.get<Question[]>(
          `/tests/${testId}/questions/`
        );
        setQuestions(data);
      } catch (err: unknown) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        setError(
          axiosErr?.response?.data?.message || "Savollarni yuklashda xatolik."
        );
      } finally {
        setLoading(false);
      }
    }
    if (testId) load();
  }, [testId]);

  const selectOption = (questionId: number, option: OptionLabel) => {
    setAnswers((prev) => new Map(prev).set(questionId, option));
  };

  const submitTest = useCallback(async () => {
    if (submitting || submitted) return;
    setSubmitting(true);

    const payload = {
      test_id: testId,
      answers: questions.map((q) => ({
        question_id: q.question_id,
        selected_option: answers.get(q.question_id) || "A",
      })),
    };

    try {
      const { data } = await api.post<SubmitResponse>(
        "/tests/submit/",
        payload
      );
      setSubmitted(true);
      sessionStorage.setItem(`result_${testId}`, JSON.stringify(data));
      router.push(`/result/${testId}`);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr?.response?.data?.message || "Yuborishda xatolik.");
      setSubmitting(false);
    }
  }, [submitting, submitted, testId, questions, answers, router]);

  const handleTimeUp = useCallback(() => {
    submitTest();
  }, [submitTest]);

  const goTo = (idx: number) => {
    if (idx >= 0 && idx < questions.length) setCurrent(idx);
  };

  const answeredCount = answers.size;
  const total = questions.length;
  const currentQ = questions[current];

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        <Navbar />

        <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-20">
              <LoadingSpinner size="lg" label="Savollar yuklanmoqda..." />
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

          {/* Test content */}
          {!loading && !error && currentQ && (
            <>
              {/* Top bar */}
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <Timer
                  duration={TEST_DURATION_SECONDS}
                  onTimeUp={handleTimeUp}
                  paused={submitted}
                />
                <div className="flex items-center gap-2 text-sm text-surface-400">
                  <CheckCircle2 size={16} className="text-brand-400" />
                  <span className="font-mono font-medium">
                    {answeredCount}/{total} javob berildi
                  </span>
                </div>
              </div>

              {/* Question navigation pills */}
              <div className="mb-6 flex flex-wrap gap-2">
                {questions.map((q, idx) => {
                  const isAnswered = answers.has(q.question_id);
                  const isCurrent = idx === current;

                  return (
                    <button
                      key={q.question_id}
                      onClick={() => goTo(idx)}
                      className={`flex h-9 w-9 items-center justify-center rounded-lg font-mono text-xs font-bold transition-all ${
                        isCurrent
                          ? "bg-brand-600 text-white shadow-md shadow-brand-600/30"
                          : isAnswered
                          ? "border border-brand-600/30 bg-brand-600/20 text-brand-400 hover:bg-brand-600/30"
                          : "border border-surface-700 bg-surface-800/50 text-surface-500 hover:bg-surface-700"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Question card */}
              <QuestionCard
                question={currentQ}
                index={current + 1}
                total={total}
                selectedOption={answers.get(currentQ.question_id) ?? null}
                onSelectOption={selectOption}
                disabled={submitted}
              />

              {/* Navigation buttons */}
              <div className="mt-6 flex items-center justify-between">
                <button
                  onClick={() => goTo(current - 1)}
                  disabled={current === 0}
                  className="btn-secondary"
                >
                  <ArrowLeft size={16} />
                  Oldingi
                </button>

                {current < total - 1 ? (
                  <button
                    onClick={() => goTo(current + 1)}
                    className="btn-primary"
                  >
                    Keyingi
                    <ArrowRight size={16} />
                  </button>
                ) : (
                  <button
                    onClick={() => setShowConfirm(true)}
                    disabled={submitting}
                    className="btn-primary"
                  >
                    <Send size={16} />
                    Testni yakunlash
                  </button>
                )}
              </div>
            </>
          )}
        </main>

        {/* Confirm modal */}
        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="animate-scale-in mx-4 w-full max-w-sm rounded-2xl border border-surface-800 bg-surface-900 p-6 shadow-2xl">
              <div className="mb-3 flex items-center gap-2 text-warning">
                <ShieldAlert size={22} />
                <h3 className="font-display text-lg font-bold text-white">
                  Testni yakunlaysizmi?
                </h3>
              </div>
              <p className="text-sm text-surface-400">
                Siz{" "}
                <span className="font-mono font-semibold text-white">
                  {answeredCount}
                </span>{" "}
                /{" "}
                <span className="font-mono font-semibold text-white">
                  {total}
                </span>{" "}
                ta savolga javob berdingiz.
                {answeredCount < total && (
                  <span className="mt-1 block text-warning">
                    Javob berilmagan savollar noto&apos;g&apos;ri deb hisoblanadi.
                  </span>
                )}
              </p>

              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="btn-secondary flex-1"
                >
                  Orqaga
                </button>
                <button
                  onClick={() => {
                    setShowConfirm(false);
                    submitTest();
                  }}
                  disabled={submitting}
                  className="btn-primary flex-1"
                >
                  {submitting ? "Yuborilmoqda..." : "Tasdiqlash"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
