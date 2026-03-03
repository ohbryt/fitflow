export interface Exercise {
  id: number;
  name: string;
  name_ko: string;
  category: string;
  muscle_group: string;
  equipment: string;
  description?: string;
  image_url?: string;
}

export interface Routine {
  id: number;
  name: string;
  description?: string;
  day_of_week?: string;
  created_at: string;
  updated_at: string;
  exercises?: RoutineExercise[];
}

export interface RoutineExercise {
  id: number;
  routine_id: number;
  exercise_id: number;
  exercise_name?: string;
  exercise_name_ko?: string;
  muscle_group?: string;
  sets: number;
  reps: number;
  weight: number;
  rest_seconds: number;
  sort_order: number;
}

export interface WorkoutSession {
  id: number;
  routine_id?: number;
  routine_name?: string;
  started_at: string;
  finished_at?: string;
  notes?: string;
  total_volume?: number;
  total_sets?: number;
}

export interface WorkoutLog {
  id: number;
  session_id: number;
  exercise_id: number;
  exercise_name?: string;
  exercise_name_ko?: string;
  set_number: number;
  reps?: number;
  weight?: number;
  completed: boolean;
  logged_at: string;
}

export interface DashboardStats {
  totalWorkouts: number;
  totalVolume: number;
  thisWeekWorkouts: number;
  streak: number;
}

export type MuscleGroup = "chest" | "back" | "shoulders" | "legs" | "arms" | "core" | "cardio";

export const MUSCLE_GROUPS: Record<MuscleGroup, { label: string; emoji: string }> = {
  chest: { label: "가슴", emoji: "💪" },
  back: { label: "등", emoji: "🔙" },
  shoulders: { label: "어깨", emoji: "🏋️" },
  legs: { label: "하체", emoji: "🦵" },
  arms: { label: "팔", emoji: "💪" },
  core: { label: "코어", emoji: "🎯" },
  cardio: { label: "유산소", emoji: "🏃" },
};

export const EQUIPMENT_LABELS: Record<string, string> = {
  none: "맨몸",
  barbell: "바벨",
  dumbbell: "덤벨",
  cable: "케이블",
  machine: "머신",
  ab_wheel: "ab 휠",
  jump_rope: "줄넘기",
};
