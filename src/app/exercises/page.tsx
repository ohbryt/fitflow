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
    // Check URL params for muscle filter
    const params = new URLSearchParams(window.location.search);
    const muscle = params.get("muscle");
    if (muscle) setSelectedMuscle(muscle);
  }, []);

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
    <div className="space-y-5 animate-slide-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black">운동 라이브러리</h1>
        <p className="text-sm text-text-muted mt-1">36개 운동의 상세 가이드를 확인하세요</p>
      </div>

      {/* Search */}
      <div className="relative">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-text-muted absolute left-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="운동 검색... (예: 벤치 프레스, squat)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full glass rounded-xl pl-10 pr-4 py-3 text-sm text-text placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {/* Muscle Group Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
        <button
          onClick={() => setSelectedMuscle("")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            !selectedMuscle ? "bg-primary text-white shadow-lg shadow-primary/25" : "glass text-text-muted hover:text-text"
          }`}
        >
          전체
        </button>
        {groups.map(([key, { label, emoji }]) => (
          <button
            key={key}
            onClick={() => setSelectedMuscle(key)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedMuscle === key ? "bg-primary text-white shadow-lg shadow-primary/25" : "glass text-text-muted hover:text-text"
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
          className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold ${
            !selectedDifficulty ? "bg-white/10 text-white" : "text-text-muted hover:text-text"
          }`}
        >
          전체 난이도
        </button>
        {difficulties.map(([key, { label, color }]) => (
          <button
            key={key}
            onClick={() => setSelectedDifficulty(key)}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
              selectedDifficulty === key ? `bg-white/10 ${color}` : "text-text-muted hover:text-text"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-[11px] text-text-muted font-medium">{exercises.length}개 운동</p>

      {/* Exercise Cards */}
      <div className="stagger space-y-3">
        {exercises.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-text-muted">검색 결과가 없습니다</p>
          </div>
        )}
        {exercises.map((ex) => {
          const muscleInfo = MUSCLE_GROUPS[ex.muscle_group as MuscleGroup];
          const diffInfo = DIFFICULTY_LABELS[ex.difficulty as Difficulty];
          return (
            <Link key={ex.id} href={`/exercises/${ex.id}`}>
              <div className="glass gradient-border rounded-2xl p-4 hover:bg-white/5 active:scale-[0.98] group">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-violet-500/10 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
                    {muscleInfo?.emoji ?? "💪"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm truncate">{ex.name_ko}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${diffInfo?.color} bg-white/5 shrink-0`}>
                        {diffInfo?.label}
                      </span>
                    </div>
                    <p className="text-[11px] text-text-muted mt-0.5">{ex.name}</p>

                    {/* Muscle tags */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {ex.primary_muscles.map((m, i) => (
                        <span key={i} className="px-2 py-0.5 bg-primary/10 text-primary rounded-md text-[10px] font-medium">{m}</span>
                      ))}
                      {ex.secondary_muscles.slice(0, 2).map((m, i) => (
                        <span key={i} className="px-2 py-0.5 bg-white/5 text-text-muted rounded-md text-[10px]">{m}</span>
                      ))}
                    </div>

                    {/* Quick info */}
                    <div className="flex items-center gap-2 mt-2 text-[10px] text-text-muted">
                      <span className="px-1.5 py-0.5 rounded bg-white/5">{EQUIPMENT_LABELS[ex.equipment] || ex.equipment}</span>
                      <span>{ex.recommended_sets} × {ex.recommended_reps}</span>
                      <span>· 휴식 {ex.rest_seconds}초</span>
                    </div>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-text-muted/50 shrink-0 mt-1 group-hover:text-primary group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Bottom spacing */}
      <div className="h-8" />
    </div>
  );
}
