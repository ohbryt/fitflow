"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { EXERCISES, getExerciseById } from "@/lib/exercise-data";
import { MUSCLE_GROUPS, EQUIPMENT_LABELS, DIFFICULTY_LABELS } from "@/lib/types";
import type { Exercise, MuscleGroup, Difficulty } from "@/lib/types";
import { MuscleMap } from "../../components/MuscleMap";
import { YouTubeSection } from "../../components/YouTubeSection";

export default function ExerciseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [activeTab, setActiveTab] = useState<"howto" | "tips" | "mistakes">("howto");

  useEffect(() => {
    const id = Number(params.id);
    const ex = getExerciseById(id);
    if (ex) setExercise(ex);
  }, [params.id]);

  if (!exercise) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-4xl mb-4">🔍</div>
        <p className="text-text-muted">운동을 찾을 수 없습니다</p>
        <button onClick={() => router.back()} className="mt-4 text-primary text-sm">← 돌아가기</button>
      </div>
    );
  }

  const muscleInfo = MUSCLE_GROUPS[exercise.muscle_group as MuscleGroup];
  const diffInfo = DIFFICULTY_LABELS[exercise.difficulty as Difficulty];

  return (
    <div className="space-y-5 pb-10 animate-slide-up">
      {/* Back button */}
      <button onClick={() => router.back()} className="flex items-center gap-1.5 text-text-muted hover:text-text text-sm font-medium">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        운동 목록
      </button>

      {/* Header */}
      <div className="relative overflow-hidden glass gradient-border rounded-2xl p-5">
        <div className="flex items-start gap-4 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/30 to-violet-500/20 flex items-center justify-center text-2xl shrink-0 animate-float">
            {muscleInfo?.emoji ?? "💪"}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-black">{exercise.name_ko}</h1>
            <p className="text-sm text-text-muted mt-0.5">{exercise.name}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${diffInfo?.color} bg-white/5`}>
                {diffInfo?.label}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/15 text-primary">
                {muscleInfo?.label}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/5 text-text-muted">
                {EQUIPMENT_LABELS[exercise.equipment] || exercise.equipment}
              </span>
            </div>
          </div>
        </div>
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-primary/10 blur-2xl" />
      </div>

      {/* YouTube Video */}
      <YouTubeSection
        exerciseNameKo={exercise.name_ko}
        exerciseName={exercise.name}
      />

      {/* Muscle Anatomy Map */}
      <div className="glass gradient-border rounded-2xl p-5">
        <h2 className="font-bold text-sm text-text-muted mb-4">🎯 타겟 근육</h2>
        <MuscleMap
          primaryMuscles={exercise.primary_muscles}
          secondaryMuscles={exercise.secondary_muscles}
        />
        <div className="mt-5 space-y-3">
          <div>
            <p className="text-xs text-text-muted mb-1.5 font-medium">주동근</p>
            <div className="flex flex-wrap gap-1.5">
              {exercise.primary_muscles.map((m, i) => (
                <span key={i} className="px-3 py-1.5 bg-primary/15 text-primary rounded-lg text-sm font-semibold">{m}</span>
              ))}
            </div>
          </div>
          {exercise.secondary_muscles.length > 0 && (
            <div>
              <p className="text-xs text-text-muted mb-1.5 font-medium">보조근</p>
              <div className="flex flex-wrap gap-1.5">
                {exercise.secondary_muscles.map((m, i) => (
                  <span key={i} className="px-3 py-1.5 bg-white/5 text-text-muted rounded-lg text-sm">{m}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recommended */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "세트", value: exercise.recommended_sets, grad: "from-indigo-500/15 to-violet-500/5" },
          { label: "반복", value: exercise.recommended_reps, grad: "from-emerald-500/15 to-teal-500/5" },
          { label: "휴식", value: `${exercise.rest_seconds}초`, grad: "from-amber-500/15 to-orange-500/5" },
        ].map((item, i) => (
          <div key={i} className={`relative overflow-hidden glass gradient-border rounded-2xl p-4 text-center bg-gradient-to-br ${item.grad}`}>
            <p className="text-[10px] text-text-muted mb-1 font-semibold">{item.label}</p>
            <p className="text-lg font-black gradient-text">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 glass rounded-xl p-1">
        {([
          { key: "howto" as const, label: "📖 수행 방법" },
          { key: "tips" as const, label: "💡 팁" },
          { key: "mistakes" as const, label: "⚠️ 주의" },
        ]).map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === tab.key
                ? "bg-primary text-white shadow-lg shadow-primary/25"
                : "text-text-muted hover:text-text"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="glass gradient-border rounded-2xl p-5">
        {activeTab === "howto" && (
          <div className="space-y-4">
            <h3 className="font-bold flex items-center gap-2">
              📖 수행 방법
              <span className="text-xs text-text-muted font-normal">{exercise.how_to.length}단계</span>
            </h3>
            <ol className="space-y-3">
              {exercise.how_to.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/30 to-violet-500/20 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-sm leading-relaxed flex-1">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        )}

        {activeTab === "tips" && (
          <div className="space-y-4">
            <h3 className="font-bold">💡 운동 팁</h3>
            <ul className="space-y-3">
              {exercise.tips.map((tip, i) => (
                <li key={i} className="flex gap-3 p-3 rounded-xl bg-emerald-500/5">
                  <span className="text-emerald-400 mt-0.5 shrink-0 font-bold">✓</span>
                  <p className="text-sm leading-relaxed">{tip}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === "mistakes" && (
          <div className="space-y-4">
            <h3 className="font-bold">⚠️ 흔한 실수 & 교정</h3>
            <ul className="space-y-3">
              {exercise.common_mistakes.map((mistake, i) => (
                <li key={i} className="flex gap-3 bg-red-500/5 rounded-xl p-3 border border-red-500/10">
                  <span className="text-red-400 mt-0.5 shrink-0 font-bold">✗</span>
                  <p className="text-sm leading-relaxed">{mistake}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Alternatives */}
      {exercise.alternatives.length > 0 && (
        <div className="glass gradient-border rounded-2xl p-5">
          <h3 className="font-bold mb-3">🔄 대체 운동</h3>
          <div className="flex flex-wrap gap-2">
            {exercise.alternatives.map((alt, i) => {
              const altExercise = EXERCISES.find(e => e.name_ko === alt);
              return altExercise ? (
                <Link
                  key={i}
                  href={`/exercises/${altExercise.id}`}
                  className="px-3 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl text-sm font-semibold transition-colors"
                >
                  {alt} →
                </Link>
              ) : (
                <span key={i} className="px-3 py-2 bg-white/5 text-text-muted rounded-xl text-sm">{alt}</span>
              );
            })}
          </div>
        </div>
      )}

      {/* Calories (cardio) */}
      {exercise.calories_per_min && (
        <div className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-r from-orange-500/15 to-red-500/10 glass gradient-border">
          <h3 className="font-bold mb-1 relative z-10">🔥 칼로리 소모</h3>
          <p className="text-2xl font-black relative z-10">
            <span className="gradient-text-warm">~{exercise.calories_per_min}kcal</span>
            <span className="text-sm font-normal text-text-muted">/분</span>
          </p>
          <p className="text-xs text-text-muted mt-1 relative z-10">* 체중, 강도에 따라 달라질 수 있습니다</p>
          <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-orange-500/10 blur-xl" />
        </div>
      )}
    </div>
  );
}
