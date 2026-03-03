"use client";

import { useEffect, useState } from "react";
import { Card } from "../components/Card";
import { RestTimer } from "../components/RestTimer";
import type { Routine, RoutineExercise } from "@/lib/types";
import { MUSCLE_GROUPS, type MuscleGroup } from "@/lib/types";

interface LogEntry {
  exercise_id: number;
  exercise_name_ko: string;
  muscle_group: string;
  sets: { set_number: number; reps: number; weight: number; completed: boolean; saved?: boolean }[];
}

export default function WorkoutPage() {
  const [routines, setRoutines] = useState<{ id: number; name: string }[]>([]);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [showTimer, setShowTimer] = useState(false);

  useEffect(() => {
    fetch("/api/routines").then((r) => r.json()).then(setRoutines).catch(() => {});
  }, []);

  useEffect(() => {
    if (!sessionId) return;
    const interval = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(interval);
  }, [sessionId]);

  const startWorkout = async (routineId?: number) => {
    const res = await fetch("/api/workouts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ routine_id: routineId }),
    });
    const { id } = await res.json();
    setSessionId(id);
    setElapsed(0);

    if (routineId) {
      const rRes = await fetch(`/api/routines/${routineId}`);
      const routine: Routine & { exercises: RoutineExercise[] } = await rRes.json();
      const entries: LogEntry[] = routine.exercises.map((re) => ({
        exercise_id: re.exercise_id,
        exercise_name_ko: re.exercise_name_ko || "",
        muscle_group: re.muscle_group || "",
        sets: Array.from({ length: re.sets }, (_, i) => ({
          set_number: i + 1, reps: re.reps, weight: re.weight, completed: false,
        })),
      }));
      setLogs(entries);
    }
  };

  const toggleSet = async (exIdx: number, setIdx: number) => {
    if (!sessionId) return;
    const entry = logs[exIdx];
    const set = entry.sets[setIdx];
    const newCompleted = !set.completed;

    // Save to server
    await fetch(`/api/workouts/${sessionId}/logs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        exercise_id: entry.exercise_id,
        set_number: set.set_number,
        reps: set.reps,
        weight: set.weight,
        completed: newCompleted,
      }),
    });

    setLogs((prev) =>
      prev.map((e, ei) =>
        ei === exIdx
          ? { ...e, sets: e.sets.map((s, si) => (si === setIdx ? { ...s, completed: newCompleted, saved: true } : s)) }
          : e
      )
    );
  };

  const updateSet = (exIdx: number, setIdx: number, field: "reps" | "weight", value: number) => {
    setLogs((prev) =>
      prev.map((e, ei) =>
        ei === exIdx
          ? { ...e, sets: e.sets.map((s, si) => (si === setIdx ? { ...s, [field]: value } : s)) }
          : e
      )
    );
  };

  const finishWorkout = async () => {
    if (!sessionId) return;
    await fetch(`/api/workouts/${sessionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ finish: true }),
    });
    setSessionId(null);
    setLogs([]);
    setElapsed(0);
  };

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return h > 0
      ? `${h}:${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`
      : `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const totalVolume = logs.reduce(
    (sum, e) => sum + e.sets.filter((s) => s.completed).reduce((s2, s) => s2 + s.reps * s.weight, 0),
    0
  );
  const completedSets = logs.reduce((sum, e) => sum + e.sets.filter((s) => s.completed).length, 0);
  const totalSets = logs.reduce((sum, e) => sum + e.sets.length, 0);

  // Not started yet
  if (!sessionId) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">운동 시작</h1>

        {routines.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">루틴으로 시작</h2>
            {routines.map((r) => (
              <Card key={r.id} onClick={() => startWorkout(r.id)} className="flex items-center justify-between">
                <span className="font-semibold">{r.name}</span>
                <span className="text-primary text-sm">시작 →</span>
              </Card>
            ))}
          </div>
        )}

        <div>
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-2">자유 운동</h2>
          <Card onClick={() => startWorkout()} className="text-center">
            <div className="text-3xl mb-2">🏋️</div>
            <div className="font-semibold">빈 세션으로 시작</div>
            <div className="text-xs text-text-muted mt-1">루틴 없이 자유롭게 기록</div>
          </Card>
        </div>
      </div>
    );
  }

  // Active session
  return (
    <div className="space-y-4">
      {/* Session Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">운동 중</h1>
          <div className="text-text-muted text-sm font-mono">{formatTime(elapsed)}</div>
        </div>
        <button onClick={finishWorkout} className="bg-success hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-semibold">
          완료 ✓
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-bg-card rounded-xl p-3 text-center border border-border">
          <div className="text-lg font-bold">{completedSets}/{totalSets}</div>
          <div className="text-xs text-text-muted">세트</div>
        </div>
        <div className="bg-bg-card rounded-xl p-3 text-center border border-border">
          <div className="text-lg font-bold">{totalVolume.toLocaleString()}</div>
          <div className="text-xs text-text-muted">볼륨(kg)</div>
        </div>
        <button onClick={() => setShowTimer(!showTimer)} className="bg-bg-card rounded-xl p-3 text-center border border-border hover:border-primary">
          <div className="text-lg">⏱️</div>
          <div className="text-xs text-text-muted">타이머</div>
        </button>
      </div>

      {/* Rest Timer */}
      {showTimer && <RestTimer defaultSeconds={60} />}

      {/* Exercise Logs */}
      <div className="space-y-3">
        {logs.map((entry, exIdx) => (
          <Card key={exIdx}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">{MUSCLE_GROUPS[entry.muscle_group as MuscleGroup]?.emoji}</span>
              <span className="font-semibold">{entry.exercise_name_ko}</span>
            </div>
            <div className="space-y-2">
              {/* Header */}
              <div className="grid grid-cols-[2rem_1fr_1fr_2.5rem] gap-2 text-xs text-text-muted px-1">
                <span>SET</span><span className="text-center">KG</span><span className="text-center">횟수</span><span></span>
              </div>
              {entry.sets.map((set, setIdx) => (
                <div key={setIdx} className={`grid grid-cols-[2rem_1fr_1fr_2.5rem] gap-2 items-center ${set.completed ? "opacity-60" : ""}`}>
                  <span className="text-sm text-text-muted text-center">{set.set_number}</span>
                  <input
                    type="number" value={set.weight}
                    onChange={(e) => updateSet(exIdx, setIdx, "weight", +e.target.value)}
                    className="bg-bg rounded-lg px-2 py-2 text-center text-sm border border-border focus:border-primary focus:outline-none"
                  />
                  <input
                    type="number" value={set.reps}
                    onChange={(e) => updateSet(exIdx, setIdx, "reps", +e.target.value)}
                    className="bg-bg rounded-lg px-2 py-2 text-center text-sm border border-border focus:border-primary focus:outline-none"
                  />
                  <button
                    onClick={() => toggleSet(exIdx, setIdx)}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg ${
                      set.completed ? "bg-success text-white" : "bg-bg-card-hover text-text-muted hover:text-white"
                    }`}
                  >
                    {set.completed ? "✓" : "○"}
                  </button>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {logs.length === 0 && (
        <div className="text-center py-8 text-text-muted">
          <p className="text-4xl mb-3">📝</p>
          <p>아직 운동이 없습니다</p>
          <p className="text-sm">루틴으로 시작하면 운동이 자동으로 추가됩니다</p>
        </div>
      )}
    </div>
  );
}
