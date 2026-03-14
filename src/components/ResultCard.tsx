"use client";

import { Trophy, CheckCircle, XCircle, Target } from "lucide-react";
import type { SubmitResponse } from "@/types";

interface ResultCardProps {
  result: SubmitResponse;
  testTitle?: string;
}

export default function ResultCard({ result, testTitle }: ResultCardProps) {
  const { total_questions, correct_answers, wrong_answers, score, is_passed } = result;

  const passed = is_passed ?? score >= 90;

  const gradeColor = passed ? "text-brand-400" : "text-danger";
  const gradeBg = passed
    ? "bg-brand-600/10 border-brand-600/30"
    : "bg-danger/10 border-danger/30";
  const gradeLabel = passed ? "Muvaffaqiyatli o'tdingiz" : "O'ta olmadingiz";
  const ringColor = passed ? "stroke-[#10b981]" : "stroke-[#ff3366]";

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="animate-scale-in mx-auto max-w-lg overflow-hidden rounded-2xl border border-surface-800 bg-surface-900/80 shadow-xl backdrop-blur-sm">
      {/* Header */}
      <div className={`border-b px-6 py-5 ${gradeBg}`}>
        <div className="flex items-center gap-2">
          <Trophy size={22} className={gradeColor} />
          <h2 className={`font-display text-xl font-bold ${gradeColor}`}>
            {gradeLabel}
          </h2>
        </div>
        {testTitle && (
          <p className="mt-1 text-sm text-surface-400">{testTitle}</p>
        )}
      </div>

      {/* Score circle */}
      <div className="flex justify-center py-8">
        <div className="relative">
          <svg width="140" height="140" className="-rotate-90">
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke="#1e293b"
              strokeWidth="10"
            />
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              className={ringColor}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{
                transition: "stroke-dashoffset 1s ease-in-out",
              }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`font-display text-3xl font-bold ${gradeColor}`}>
              {score}%
            </span>
            <span className="font-mono text-xs text-surface-500">Ball</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-px border-t border-surface-800 bg-surface-800">
        <div className="flex flex-col items-center bg-surface-900 py-5">
          <Target size={20} className="mb-1.5 text-surface-500" />
          <span className="font-display text-2xl font-bold text-white">
            {total_questions}
          </span>
          <span className="font-mono text-xs text-surface-500">Jami</span>
        </div>

        <div className="flex flex-col items-center bg-surface-900 py-5">
          <CheckCircle size={20} className="mb-1.5 text-brand-400" />
          <span className="font-display text-2xl font-bold text-brand-400">
            {correct_answers}
          </span>
          <span className="font-mono text-xs text-surface-500">To&apos;g&apos;ri</span>
        </div>

        <div className="flex flex-col items-center bg-surface-900 py-5">
          <XCircle size={20} className="mb-1.5 text-danger" />
          <span className="font-display text-2xl font-bold text-danger">
            {wrong_answers}
          </span>
          <span className="font-mono text-xs text-surface-500">Xato</span>
        </div>
      </div>
    </div>
  );
}
