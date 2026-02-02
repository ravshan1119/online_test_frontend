"use client";

import { useEffect, useState, useCallback } from "react";
import { Clock } from "lucide-react";

interface TimerProps {
  duration: number;
  onTimeUp: () => void;
  paused?: boolean;
}

export default function Timer({
  duration,
  onTimeUp,
  paused = false,
}: TimerProps) {
  const [remaining, setRemaining] = useState(duration);

  const handleTimeUp = useCallback(() => {
    onTimeUp();
  }, [onTimeUp]);

  useEffect(() => {
    if (paused || remaining <= 0) return;

    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [paused, remaining, handleTimeUp]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const percentage = (remaining / duration) * 100;

  let colorClass = "text-surface-200";
  let bgClass = "bg-brand-600";
  if (percentage <= 20) {
    colorClass = "text-danger";
    bgClass = "bg-danger";
  } else if (percentage <= 50) {
    colorClass = "text-warning";
    bgClass = "bg-warning";
  }

  return (
    <div className="flex items-center gap-3 rounded-xl border border-surface-800 bg-surface-900/80 px-4 py-2.5 shadow-sm backdrop-blur-sm">
      <Clock size={18} className={colorClass} />

      <div className="flex flex-col gap-1">
        <span className={`font-mono text-lg font-bold ${colorClass}`}>
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </span>

        <div className="h-1 w-20 overflow-hidden rounded-full bg-surface-800">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-linear ${bgClass}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
