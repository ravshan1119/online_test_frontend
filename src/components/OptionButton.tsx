"use client";

import type { OptionLabel } from "@/types";

interface OptionButtonProps {
  label: OptionLabel;
  text: string;
  selected: boolean;
  onSelect: (label: OptionLabel) => void;
  disabled?: boolean;
}

const labelColors: Record<OptionLabel, string> = {
  A: "bg-cyan-900/50 text-cyan-400 group-hover:bg-cyan-800/50",
  B: "bg-brand-900/50 text-brand-400 group-hover:bg-brand-800/50",
  C: "bg-amber-900/50 text-amber-400 group-hover:bg-amber-800/50",
  D: "bg-purple-900/50 text-purple-400 group-hover:bg-purple-800/50",
};

const selectedLabelColors: Record<OptionLabel, string> = {
  A: "bg-cyan-500 text-white",
  B: "bg-brand-500 text-white",
  C: "bg-amber-500 text-white",
  D: "bg-purple-500 text-white",
};

export default function OptionButton({
  label,
  text,
  selected,
  onSelect,
  disabled = false,
}: OptionButtonProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(label)}
      disabled={disabled}
      className={`group flex w-full items-start gap-3.5 rounded-xl border-2 p-4 text-left transition-all duration-200 ${
        selected
          ? "border-brand-500/60 bg-brand-600/10 shadow-md shadow-brand-600/10"
          : "border-surface-700 bg-surface-800/30 hover:border-surface-600 hover:bg-surface-800/60"
      } ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
    >
      <span
        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg font-mono text-sm font-bold transition-colors ${
          selected ? selectedLabelColors[label] : labelColors[label]
        }`}
      >
        {label}
      </span>

      <span
        className={`pt-0.5 text-[15px] leading-relaxed ${
          selected ? "font-medium text-white" : "text-surface-300"
        }`}
      >
        {text}
      </span>
    </button>
  );
}
