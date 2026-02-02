"use client";

import type { OptionLabel, Question } from "@/types";
import OptionButton from "./OptionButton";

interface QuestionCardProps {
  question: Question;
  index: number;
  total: number;
  selectedOption: OptionLabel | null;
  onSelectOption: (questionId: number, option: OptionLabel) => void;
  disabled?: boolean;
}

export default function QuestionCard({
  question,
  index,
  total,
  selectedOption,
  onSelectOption,
  disabled = false,
}: QuestionCardProps) {
  const options = Object.entries(question.options) as [OptionLabel, string][];

  return (
    <div className="animate-fade-in rounded-2xl border border-surface-800 bg-surface-900/80 p-6 shadow-sm backdrop-blur-sm sm:p-8">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <span className="rounded-full border border-brand-600/30 bg-brand-600/10 px-3 py-1 font-mono text-xs font-bold tracking-wide text-brand-400">
          SAVOL {index} / {total}
        </span>
      </div>

      {/* Question text */}
      <h3 className="mb-6 text-lg font-semibold leading-relaxed text-white sm:text-xl">
        {question.question_text}
      </h3>

      {/* Options */}
      <div className="flex flex-col gap-3">
        {options.map(([label, text]) => (
          <OptionButton
            key={label}
            label={label}
            text={text}
            selected={selectedOption === label}
            onSelect={(opt) => onSelectOption(question.question_id, opt)}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
}
