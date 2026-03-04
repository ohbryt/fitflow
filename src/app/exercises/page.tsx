"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Exercise, MuscleGroup, Difficulty } from "@/lib/types";
import { MUSCLE_GROUPS, EQUIPMENT_LABELS, DIFFICULTY_LABELS } from "@/lib/types";
import { getExercises } from "@/lib/storage";

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedMuscle, setSelectedMuscle] = useState<string>("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let list = getExercises(selectedMuscle || undefined, search || undefined);
    if (selectedDifficulty) {
      list = list.filter(e => e.difficulty === selectedDifficulty);
    }
    setExercises(list);
  }, [selectedMuscle, selectedDifficulty, search]);

  const groups = Object.entries(MUSCLE_GROUPS) as [MuscleGroup, { label: string; emoji: string }][];
  const difficulties = Object.entries(DIFFICULTY_LABELS) as [Difficulty, { label: string; color: string }][];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">운동 라이브러리</h1>
        <p className="text-sm text-text-muted mt-1">36개 운동의 상세 가이드를 확인하세요</p>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="운동 검색... (예: 벤치 프레스, squat)"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full bg-bg-card border border-border rounded-xl px-4 py-3 text-text placeholder:text-text-muted focus:outline-none focus:border-primary"
      />

      {/* Muscle Group Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        <button
          onClick={() => setSelectedMuscle("")}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
            !selectedMuscle ? "bg-primary text-white" : "bg-bg-card text-text-muted border border-border"
          }`}
        >
          전체
        </button>
        {groups.map(([key, { label, emoji }]) => (
          <button
            key={key}
            onClick={() => setSelectedMuscle(key)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              selectedMuscle === key ? "bg-primary text-white" : "bg-bg-card text-text-muted border border-border"
            }`}
          >
            {emoji} {label}
          </button>
        ))}
      </div>

      {/* Difficulty Filter */}
      <div className="flex gap-2">
        <button
          onClick={() => setSelectedDifficulty("")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
            !selectedDifficulty ? "bg-white/10 text-white" : "bg-bg-card text-text-muted border border-border"
          }`}
        >
          전체 난이도
        </button>
        {difficulties.map(([key, { label, color }]) => (
          <button
            key={key}
            onClick={() => setSelectedDifficulty(key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
              selectedDifficulty === key ? `bg-white/10 ${color}` : "bg-bg-card text-text-muted border border-border"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-xs text-text-muted">{exercises.length}개 운동</p>

      {/* Exercise Cards */}
      <div className="space-y-3">
        {exercises.length === 0 && (
          <p className="text-text-muted text-center py-8">검색 결과가 없습니다</p>
        )}
        {exercises.map((ex) => {
          const muscleInfo = MUSCLE_GROUPS[ex.muscle_group as MuscleGroup];
          const diffInfo = DIFFICULTY_LABELS[ex.difficulty as Difficulty];
          return (
            <Link key={ex.id} href={`/exercises/${ex.id}`}>
              <div className="bg-bg-card rounded-2xl p-4 border border-border hover:border-primary/50 active:scale-[0.99] transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-xl shrink-0">
                    {muscleInfo?.emoji ?? "💪"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold truncate">{ex.name_ko}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${diffInfo?.color} bg-white/5 shrink-0`}>
                        {diffInfo?.label}
                      </span>
                    </div>
                    <p className="text-xs text-text-muted mt-0.5">{ex.name}</p>

                    {/* Muscle tags */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {ex.primary_muscles.map((m, i) => (
                        <span key={i} className="px-2 py-0.5 bg-primary/10 text-primary rounded text-[10px] font-medium">{m}</span>
                      ))}
                      {ex.secondary_muscles.slice(0, 2).map((m, i) => (
                        <span key={i} className="px-2 py-0.5 bg-white/5 text-text-muted rounded text-[10px]">{m}</span>
                      ))}
                    </div>

                    {/* Quick info */}
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-text-muted">
                      <span>{EQUIPMENT_LABELS[ex.equipment] || ex.equipment}</span>
                      <span>·</span>
                      <span>{ex.recommended_sets} × {ex.recommended_reps}</span>
                      <span>·</span>
                      <span>휴식 {ex.rest_seconds}초</span>
                    </div>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-text-muted shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
