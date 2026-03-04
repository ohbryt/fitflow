"use client";

import { MUSCLE_GROUPS } from "./types";
import { EXERCISES } from "./exercise-data";
import type { Exercise, Routine, RoutineExercise, WorkoutSession, WorkoutLog } from "./types";

// ========== localStorage 헬퍼 ==========
function get<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const v = localStorage.getItem(`fitflow:${key}`);
    return v ? JSON.parse(v) : fallback;
  } catch { return fallback; }
}
function set(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  localStorage.setItem(`fitflow:${key}`, JSON.stringify(value));
}

// ========== Exercises ==========
export function getExercises(muscle?: string, q?: string): Exercise[] {
  let list = EXERCISES;
  if (muscle) list = list.filter(e => e.muscle_group === muscle);
  if (q) { const s = q.toLowerCase(); list = list.filter(e => e.name.toLowerCase().includes(s) || e.name_ko.includes(s)); }
  return list;
}

// ========== Routines ==========
let _nextRoutineId = 1;
function _initRoutineId() { const r = get<Routine[]>("routines", []); if (r.length) _nextRoutineId = Math.max(...r.map(x=>x.id)) + 1; }

export function getRoutines(): (Routine & { exercise_count: number })[] {
  _initRoutineId();
  const routines = get<Routine[]>("routines", []);
  const reMap = get<Record<string, RoutineExercise[]>>("routine_exercises", {});
  return routines.map(r => ({ ...r, exercise_count: (reMap[r.id] || []).length }));
}

export function getRoutine(id: number): (Routine & { exercises: RoutineExercise[] }) | null {
  const routines = get<Routine[]>("routines", []);
  const r = routines.find(x => x.id === id);
  if (!r) return null;
  const reMap = get<Record<string, RoutineExercise[]>>("routine_exercises", {});
  const exercises = (reMap[id] || []).map(re => {
    const ex = EXERCISES.find(e => e.id === re.exercise_id);
    return { ...re, exercise_name: ex?.name, exercise_name_ko: ex?.name_ko, muscle_group: ex?.muscle_group };
  });
  return { ...r, exercises };
}

export function createRoutine(name: string, description: string, exercises: { exercise_id: number; sets: number; reps: number; weight: number; rest_seconds: number }[]): number {
  _initRoutineId();
  const routines = get<Routine[]>("routines", []);
  const id = _nextRoutineId++;
  const now = new Date().toISOString();
  routines.push({ id, name, description, created_at: now, updated_at: now });
  set("routines", routines);
  const reMap = get<Record<string, RoutineExercise[]>>("routine_exercises", {});
  reMap[id] = exercises.map((e, i) => ({ id: Date.now() + i, routine_id: id, ...e, sort_order: i }));
  set("routine_exercises", reMap);
  return id;
}

export function deleteRoutine(id: number) {
  set("routines", get<Routine[]>("routines", []).filter(r => r.id !== id));
  const reMap = get<Record<string, RoutineExercise[]>>("routine_exercises", {});
  delete reMap[id];
  set("routine_exercises", reMap);
}

// ========== Workouts ==========
let _nextSessionId = 1;
function _initSessionId() { const s = get<WorkoutSession[]>("sessions", []); if (s.length) _nextSessionId = Math.max(...s.map(x=>x.id)) + 1; }

export function getSessions(month?: string): WorkoutSession[] {
  let sessions = get<WorkoutSession[]>("sessions", []);
  if (month) sessions = sessions.filter(s => s.started_at.startsWith(month));
  const logsMap = get<Record<string, WorkoutLog[]>>("workout_logs", {});
  return sessions.map(s => {
    const logs = logsMap[s.id] || [];
    const completed = logs.filter(l => l.completed);
    return { ...s, total_volume: completed.reduce((a, l) => a + (l.weight||0)*(l.reps||0), 0), total_sets: completed.length };
  }).sort((a, b) => b.started_at.localeCompare(a.started_at));
}

export function createSession(routine_id?: number): number {
  _initSessionId();
  const sessions = get<WorkoutSession[]>("sessions", []);
  const id = _nextSessionId++;
  const routines = get<Routine[]>("routines", []);
  const rName = routine_id ? routines.find(r => r.id === routine_id)?.name : undefined;
  sessions.push({ id, routine_id, routine_name: rName, started_at: new Date().toISOString() });
  set("sessions", sessions);
  return id;
}

export function finishSession(id: number) {
  const sessions = get<WorkoutSession[]>("sessions", []);
  const s = sessions.find(x => x.id === id);
  if (s) { s.finished_at = new Date().toISOString(); set("sessions", sessions); }
}

export function addLog(session_id: number, exercise_id: number, set_number: number, reps: number, weight: number, completed: boolean) {
  const logsMap = get<Record<string, WorkoutLog[]>>("workout_logs", {});
  const logs = logsMap[session_id] || [];
  const ex = EXERCISES.find(e => e.id === exercise_id);
  logs.push({ id: Date.now(), session_id, exercise_id, exercise_name: ex?.name, exercise_name_ko: ex?.name_ko, set_number, reps, weight, completed, logged_at: new Date().toISOString() });
  logsMap[session_id] = logs;
  set("workout_logs", logsMap);
}

// ========== Stats ==========
export function getStats() {
  const sessions = get<WorkoutSession[]>("sessions", []);
  const logsMap = get<Record<string, WorkoutLog[]>>("workout_logs", {});
  const finished = sessions.filter(s => s.finished_at);
  const allLogs = Object.values(logsMap).flat().filter(l => l.completed);
  const totalVolume = allLogs.reduce((a, l) => a + (l.weight||0)*(l.reps||0), 0);
  const weekAgo = new Date(Date.now() - 7*86400000).toISOString();
  const thisWeek = finished.filter(s => s.started_at >= weekAgo).length;

  // streak
  let streak = 0;
  const dates = [...new Set(finished.map(s => s.started_at.split("T")[0]))].sort().reverse();
  const today = new Date();
  for (let i = 0; i < dates.length; i++) {
    const exp = new Date(today); exp.setDate(exp.getDate() - i);
    const expStr = exp.toISOString().split("T")[0];
    if (dates[i] === expStr) streak++;
    else if (i === 0) { exp.setDate(exp.getDate() - 1); if (dates[i] === exp.toISOString().split("T")[0]) streak++; else break; }
    else break;
  }

  // muscle distribution
  const muscleCount: Record<string, number> = {};
  const recentLogs = allLogs.filter(l => l.logged_at && l.logged_at >= weekAgo);
  recentLogs.forEach(l => { const ex = EXERCISES.find(e => e.id === l.exercise_id); if (ex) muscleCount[ex.muscle_group] = (muscleCount[ex.muscle_group]||0) + 1; });

  return {
    totalWorkouts: finished.length, totalVolume: Math.round(totalVolume),
    thisWeekWorkouts: thisWeek, streak,
    muscleDistribution: Object.entries(muscleCount).map(([muscle_group, count]) => ({ muscle_group, count })).sort((a,b) => b.count - a.count),
    weeklyVolume: [] as { week: string; volume: number }[],
  };
}
