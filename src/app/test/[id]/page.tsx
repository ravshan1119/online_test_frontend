"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import QuestionCard from "@/components/QuestionCard";
import Timer from "@/components/Timer";
import LoadingSpinner from "@/components/LoadingSpinner";
import api from "@/services/api";
import type { OptionLabel, Question, SubmitPayload, SubmitResponse } from "@/types";
import {
  ArrowLeft,
  ArrowRight,
  Send,
  AlertCircle,
  CheckCircle2,
  ShieldAlert,
  User,
} from "lucide-react";

const TEST_DURATION_SECONDS = 30 * 60;

interface UserInfo {
  first_name: string;
  last_name: string;
  middle_name: string;
}

export default function TestPage() {
  const params = useParams();
  const router = useRouter();
  const testId = Number(params.id);

  /* --- user info step --- */
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [nameForm, setNameForm] = useState<UserInfo>({
    first_name: "",
    last_name: "",
    middle_name: "",
  });
  const [nameError, setNameError] = useState("");

  /* --- test step --- */
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Map<number, OptionLabel>>(new Map());
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  /* Load questions after user enters name */
  useEffect(() => {
    if (!userInfo) return;

    async function load() {
      setLoading(true);
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
    load();
  }, [testId, userInfo]);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameForm.first_name.trim() || !nameForm.last_name.trim()) {
      setNameError("Ism va familiya kiritilishi shart.");
      return;
    }
    setNameError("");
    setUserInfo({ ...nameForm });
  };

  const selectOption = (questionId: number, option: OptionLabel) => {
    setAnswers((prev) => new Map(prev).set(questionId, option));
  };

  const submitTest = useCallback(async () => {
    if (submitting || submitted || !userInfo) return;
    setSubmitting(true);

    const payload: SubmitPayload = {
      test_id: testId,
      first_name: userInfo.first_name,
      last_name: userInfo.last_name,
      ...(userInfo.middle_name.trim() && {
        middle_name: userInfo.middle_name.trim(),
      }),
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
  }, [submitting, submitted, testId, questions, answers, router, userInfo]);

  const handleTimeUp = useCallback(() => {
    submitTest();
  }, [submitTest]);

  const goTo = (idx: number) => {
    if (idx >= 0 && idx < questions.length) setCurrent(idx);
  };

  const answeredCount = answers.size;
  const total = questions.length;
  const currentQ = questions[current];

  /* ====== NAME FORM STEP ====== */
  if (!userInfo) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="mx-auto max-w-md px-4 py-10 sm:px-6">
          <div className="card animate-slide-up">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600/20 text-brand-400">
                <User size={22} />
              </div>
              <div>
                <h1 className="font-display text-xl font-bold text-white">
                  Ma&apos;lumotlaringiz
                </h1>
                <p className="text-sm text-surface-400">
                  Testni boshlash uchun ism-familiyangizni kiriting
                </p>
              </div>
            </div>

            <form onSubmit={handleNameSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-surface-300">
                  Familiya <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  value={nameForm.last_name}
                  onChange={(e) =>
                    setNameForm((p) => ({ ...p, last_name: e.target.value }))
                  }
                  placeholder="Valiyev"
                  className="w-full rounded-lg border border-surface-700 bg-surface-800/50 px-4 py-2.5 text-white placeholder-surface-500 outline-none transition-colors focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-surface-300">
                  Ism <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  value={nameForm.first_name}
                  onChange={(e) =>
                    setNameForm((p) => ({ ...p, first_name: e.target.value }))
                  }
                  placeholder="Ali"
                  className="w-full rounded-lg border border-surface-700 bg-surface-800/50 px-4 py-2.5 text-white placeholder-surface-500 outline-none transition-colors focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-surface-300">
                  Otasining ismi (ixtiyoriy)
                </label>
                <input
                  type="text"
                  value={nameForm.middle_name}
                  onChange={(e) =>
                    setNameForm((p) => ({ ...p, middle_name: e.target.value }))
                  }
                  placeholder="Karimovich"
                  className="w-full rounded-lg border border-surface-700 bg-surface-800/50 px-4 py-2.5 text-white placeholder-surface-500 outline-none transition-colors focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
                />
              </div>

              {nameError && (
                <div className="flex items-center gap-2 text-sm text-danger">
                  <AlertCircle size={16} />
                  {nameError}
                </div>
              )}

              <button type="submit" className="btn-primary w-full mt-2">
                Testni boshlash
                <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </main>
      </div>
    );
  }

  /* ====== TEST STEP ====== */
  return (
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
                onClick={() => router.push("/")}
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
  );
}
