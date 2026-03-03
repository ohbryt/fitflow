"use client";

import { useState, useEffect, useCallback } from "react";

export function RestTimer({ defaultSeconds = 60 }: { defaultSeconds?: number }) {
  const [seconds, setSeconds] = useState(defaultSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(defaultSeconds);

  useEffect(() => {
    setTimeLeft(seconds);
  }, [seconds]);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) {
      if (timeLeft <= 0 && isRunning) {
        setIsRunning(false);
        // Vibrate if supported
        if (typeof navigator !== "undefined" && navigator.vibrate) {
          navigator.vibrate([200, 100, 200]);
        }
      }
      return;
    }
    const interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const toggle = useCallback(() => {
    if (timeLeft <= 0) {
      setTimeLeft(seconds);
    }
    setIsRunning((r) => !r);
  }, [timeLeft, seconds]);

  const reset = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(seconds);
  }, [seconds]);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const progress = seconds > 0 ? ((seconds - timeLeft) / seconds) * 100 : 0;

  return (
    <div className="bg-bg-card rounded-2xl p-4 border border-border">
      <div className="text-center mb-3">
        <span className="text-xs text-text-muted uppercase tracking-wider">휴식 타이머</span>
      </div>
      {/* Progress ring */}
      <div className="relative w-32 h-32 mx-auto mb-3">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="var(--color-border)" strokeWidth="6" />
          <circle
            cx="50" cy="50" r="45" fill="none"
            stroke={timeLeft <= 0 ? "var(--color-success)" : "var(--color-primary)"}
            strokeWidth="6" strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-3xl font-mono font-bold ${timeLeft <= 0 ? "text-success" : ""}`}>
            {mins}:{secs.toString().padStart(2, "0")}
          </span>
        </div>
      </div>
      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        <button onClick={reset} className="px-4 py-2 rounded-xl bg-bg-card-hover text-text-muted text-sm hover:text-text">
          리셋
        </button>
        <button
          onClick={toggle}
          className={`px-6 py-2 rounded-xl font-semibold text-sm text-white ${
            isRunning ? "bg-danger hover:bg-red-600" : "bg-primary hover:bg-primary-dark"
          }`}
        >
          {isRunning ? "정지" : timeLeft <= 0 ? "다시" : "시작"}
        </button>
      </div>
      {/* Quick presets */}
      <div className="flex justify-center gap-2 mt-3">
        {[30, 60, 90, 120].map((s) => (
          <button
            key={s}
            onClick={() => { setSeconds(s); setTimeLeft(s); setIsRunning(false); }}
            className={`px-3 py-1 rounded-lg text-xs ${
              seconds === s ? "bg-primary text-white" : "bg-bg-card-hover text-text-muted"
            }`}
          >
            {s}s
          </button>
        ))}
      </div>
    </div>
  );
}
