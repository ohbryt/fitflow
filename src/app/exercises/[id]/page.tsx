"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { EXERCISES, getExerciseById } from "@/lib/exercise-data";
import { MUSCLE_GROUPS, EQUIPMENT_LABELS, DIFFICULTY_LABELS } from "@/lib/types";
import type { Exercise, MuscleGroup, Difficulty } from "@/lib/types";

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
    <div className="space-y-5 pb-8">
      {/* Back button */}
      <button onClick={() => router.back()} className="flex items-center gap-1 text-text-muted hover:text-text text-sm">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        운동 목록
      </button>

      {/* Header */}
      <div className="bg-bg-card rounded-2xl p-5 border border-border">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center text-2xl shrink-0">
            {muscleInfo?.emoji ?? "💪"}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold">{exercise.name_ko}</h1>
            <p className="text-sm text-text-muted mt-0.5">{exercise.name}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${diffInfo?.color} bg-white/5`}>
                {diffInfo?.label}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/15 text-primary">
                {muscleInfo?.label}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/5 text-text-muted">
                {EQUIPMENT_LABELS[exercise.equipment] || exercise.equipment}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Muscles */}
      <div className="bg-bg-card rounded-2xl p-5 border border-border">
        <h2 className="font-semibold text-sm text-text-muted mb-3">🎯 타겟 근육</h2>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-text-muted mb-1.5">주동근</p>
            <div className="flex flex-wrap gap-1.5">
              {exercise.primary_muscles.map((m, i) => (
                <span key={i} className="px-3 py-1.5 bg-primary/20 text-primary rounded-lg text-sm font-medium">{m}</span>
              ))}
            </div>
          </div>
          {exercise.secondary_muscles.length > 0 && (
            <div>
              <p className="text-xs text-text-muted mb-1.5">보조근</p>
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
        <div className="bg-bg-card rounded-2xl p-4 border border-border text-center">
          <p className="text-xs text-text-muted mb-1">세트</p>
          <p className="text-lg font-bold text-primary">{exercise.recommended_sets}</p>
        </div>
        <div className="bg-bg-card rounded-2xl p-4 border border-border text-center">
          <p className="text-xs text-text-muted mb-1">반복</p>
          <p className="text-lg font-bold text-primary">{exercise.recommended_reps}</p>
        </div>
        <div className="bg-bg-card rounded-2xl p-4 border border-border text-center">
          <p className="text-xs text-text-muted mb-1">휴식</p>
          <p className="text-lg font-bold text-primary">{exercise.rest_seconds}초</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-bg-card rounded-xl p-1 border border-border">
        {([
          { key: "howto" as const, label: "📖 수행 방법", count: exercise.how_to.length },
          { key: "tips" as const, label: "💡 팁", count: exercise.tips.length },
          { key: "mistakes" as const, label: "⚠️ 주의", count: exercise.common_mistakes.length },
        ]).map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === tab.key
                ? "bg-primary text-white"
                : "text-text-muted hover:text-text"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-bg-card rounded-2xl p-5 border border-border">
        {activeTab === "howto" && (
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              📖 수행 방법
              <span className="text-xs text-text-muted font-normal">{exercise.how_to.length}단계</span>
            </h3>
            <ol className="space-y-3">
              {exercise.how_to.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
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
            <h3 className="font-semibold">💡 운동 팁</h3>
            <ul className="space-y-3">
              {exercise.tips.map((tip, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-green-400 mt-1 shrink-0">✓</span>
                  <p className="text-sm leading-relaxed">{tip}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === "mistakes" && (
          <div className="space-y-4">
            <h3 className="font-semibold">⚠️ 흔한 실수 & 교정</h3>
            <ul className="space-y-3">
              {exercise.common_mistakes.map((mistake, i) => (
                <li key={i} className="flex gap-3 bg-red-500/5 rounded-xl p-3">
                  <span className="text-red-400 mt-0.5 shrink-0">✗</span>
                  <p className="text-sm leading-relaxed">{mistake}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Alternatives */}
      {exercise.alternatives.length > 0 && (
        <div className="bg-bg-card rounded-2xl p-5 border border-border">
          <h3 className="font-semibold mb-3">🔄 대체 운동</h3>
          <div className="flex flex-wrap gap-2">
            {exercise.alternatives.map((alt, i) => {
              const altExercise = EXERCISES.find(e => e.name_ko === alt);
              return altExercise ? (
                <Link
                  key={i}
                  href={`/exercises/${altExercise.id}`}
                  className="px-3 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl text-sm font-medium transition-colors"
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
        <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-2xl p-5 border border-orange-500/20">
          <h3 className="font-semibold mb-1">🔥 칼로리 소모</h3>
          <p className="text-2xl font-bold text-orange-400">~{exercise.calories_per_min}kcal<span className="text-sm font-normal text-text-muted">/분</span></p>
          <p className="text-xs text-text-muted mt-1">* 체중, 강도에 따라 달라질 수 있습니다</p>
        </div>
      )}
    </div>
  );
}
