export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface Exercise {
  id: number;
  name: string;
  name_ko: string;
  category: string;
  muscle_group: string;
  equipment: string;
  description?: string;
  image_url?: string;
  // 신규 상세 필드
  difficulty: Difficulty;
  primary_muscles: string[];
  secondary_muscles: string[];
  how_to: string[];          // 단계별 자세 설명
  tips: string[];            // 운동 팁
  common_mistakes: string[]; // 흔한 실수
  alternatives: string[];    // 대체 운동 (name_ko)
  calories_per_min?: number; // 분당 칼로리 (유산소)
  recommended_sets: string;  // "3-4세트"
  recommended_reps: string;  // "8-12회" 또는 "30-60초"
  rest_seconds: number;      // 권장 휴식
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
  ez_bar: "EZ바",
  kettlebell: "케틀벨",
  band: "밴드",
};

export const DIFFICULTY_LABELS: Record<Difficulty, { label: string; color: string }> = {
  beginner: { label: "초급", color: "text-green-400" },
  intermediate: { label: "중급", color: "text-yellow-400" },
  advanced: { label: "고급", color: "text-red-400" },
};
