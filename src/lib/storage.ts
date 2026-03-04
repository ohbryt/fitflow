"use client";

import { MUSCLE_GROUPS } from "./types";
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

// ========== 시드 운동 데이터 ==========
const SEED_EXERCISES: Exercise[] = [
  { id:1, name:"Bench Press", name_ko:"벤치 프레스", category:"strength", muscle_group:"chest", equipment:"barbell" },
  { id:2, name:"Incline Bench Press", name_ko:"인클라인 벤치 프레스", category:"strength", muscle_group:"chest", equipment:"barbell" },
  { id:3, name:"Dumbbell Fly", name_ko:"덤벨 플라이", category:"strength", muscle_group:"chest", equipment:"dumbbell" },
  { id:4, name:"Push Up", name_ko:"푸시업", category:"bodyweight", muscle_group:"chest", equipment:"none" },
  { id:5, name:"Cable Crossover", name_ko:"케이블 크로스오버", category:"strength", muscle_group:"chest", equipment:"cable" },
  { id:6, name:"Deadlift", name_ko:"데드리프트", category:"strength", muscle_group:"back", equipment:"barbell" },
  { id:7, name:"Pull Up", name_ko:"풀업", category:"bodyweight", muscle_group:"back", equipment:"none" },
  { id:8, name:"Barbell Row", name_ko:"바벨 로우", category:"strength", muscle_group:"back", equipment:"barbell" },
  { id:9, name:"Lat Pulldown", name_ko:"랫 풀다운", category:"strength", muscle_group:"back", equipment:"machine" },
  { id:10, name:"Seated Row", name_ko:"시티드 로우", category:"strength", muscle_group:"back", equipment:"cable" },
  { id:11, name:"Overhead Press", name_ko:"오버헤드 프레스", category:"strength", muscle_group:"shoulders", equipment:"barbell" },
  { id:12, name:"Lateral Raise", name_ko:"레터럴 레이즈", category:"strength", muscle_group:"shoulders", equipment:"dumbbell" },
  { id:13, name:"Front Raise", name_ko:"프론트 레이즈", category:"strength", muscle_group:"shoulders", equipment:"dumbbell" },
  { id:14, name:"Face Pull", name_ko:"페이스 풀", category:"strength", muscle_group:"shoulders", equipment:"cable" },
  { id:15, name:"Arnold Press", name_ko:"아놀드 프레스", category:"strength", muscle_group:"shoulders", equipment:"dumbbell" },
  { id:16, name:"Squat", name_ko:"스쿼트", category:"strength", muscle_group:"legs", equipment:"barbell" },
  { id:17, name:"Leg Press", name_ko:"레그 프레스", category:"strength", muscle_group:"legs", equipment:"machine" },
  { id:18, name:"Romanian Deadlift", name_ko:"루마니안 데드리프트", category:"strength", muscle_group:"legs", equipment:"barbell" },
  { id:19, name:"Leg Extension", name_ko:"레그 익스텐션", category:"strength", muscle_group:"legs", equipment:"machine" },
  { id:20, name:"Leg Curl", name_ko:"레그 컬", category:"strength", muscle_group:"legs", equipment:"machine" },
  { id:21, name:"Lunge", name_ko:"런지", category:"strength", muscle_group:"legs", equipment:"dumbbell" },
  { id:22, name:"Calf Raise", name_ko:"카프 레이즈", category:"strength", muscle_group:"legs", equipment:"machine" },
  { id:23, name:"Barbell Curl", name_ko:"바벨 컬", category:"strength", muscle_group:"arms", equipment:"barbell" },
  { id:24, name:"Tricep Pushdown", name_ko:"트라이셉 푸시다운", category:"strength", muscle_group:"arms", equipment:"cable" },
  { id:25, name:"Hammer Curl", name_ko:"해머 컬", category:"strength", muscle_group:"arms", equipment:"dumbbell" },
  { id:26, name:"Skull Crusher", name_ko:"스컬 크러셔", category:"strength", muscle_group:"arms", equipment:"barbell" },
  { id:27, name:"Dips", name_ko:"딥스", category:"bodyweight", muscle_group:"arms", equipment:"none" },
  { id:28, name:"Plank", name_ko:"플랭크", category:"bodyweight", muscle_group:"core", equipment:"none" },
  { id:29, name:"Crunch", name_ko:"크런치", category:"bodyweight", muscle_group:"core", equipment:"none" },
  { id:30, name:"Russian Twist", name_ko:"러시안 트위스트", category:"bodyweight", muscle_group:"core", equipment:"none" },
  { id:31, name:"Leg Raise", name_ko:"레그 레이즈", category:"bodyweight", muscle_group:"core", equipment:"none" },
  { id:32, name:"Ab Wheel Rollout", name_ko:"ab 롤아웃", category:"bodyweight", muscle_group:"core", equipment:"ab_wheel" },
  { id:33, name:"Running", name_ko:"러닝", category:"cardio", muscle_group:"cardio", equipment:"none" },
  { id:34, name:"Cycling", name_ko:"사이클링", category:"cardio", muscle_group:"cardio", equipment:"machine" },
  { id:35, name:"Jump Rope", name_ko:"줄넘기", category:"cardio", muscle_group:"cardio", equipment:"jump_rope" },
  { id:36, name:"Rowing Machine", name_ko:"로잉 머신", category:"cardio", muscle_group:"cardio", equipment:"machine" },
];

// ========== Exercises ==========
export function getExercises(muscle?: string, q?: string): Exercise[] {
  let list = SEED_EXERCISES;
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
    const ex = SEED_EXERCISES.find(e => e.id === re.exercise_id);
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
  const ex = SEED_EXERCISES.find(e => e.id === exercise_id);
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
  recentLogs.forEach(l => { const ex = SEED_EXERCISES.find(e => e.id === l.exercise_id); if (ex) muscleCount[ex.muscle_group] = (muscleCount[ex.muscle_group]||0) + 1; });

  return {
    totalWorkouts: finished.length, totalVolume: Math.round(totalVolume),
    thisWeekWorkouts: thisWeek, streak,
    muscleDistribution: Object.entries(muscleCount).map(([muscle_group, count]) => ({ muscle_group, count })).sort((a,b) => b.count - a.count),
    weeklyVolume: [] as { week: string; volume: number }[],
  };
}
