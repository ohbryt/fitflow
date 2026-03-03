"use client";

import { useEffect, useState } from "react";
import { Card } from "../components/Card";
import type { Exercise, MuscleGroup } from "@/lib/types";
import { MUSCLE_GROUPS, EQUIPMENT_LABELS } from "@/lib/types";

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedMuscle, setSelectedMuscle] = useState<string>("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedMuscle) params.set("muscle", selectedMuscle);
    if (search) params.set("q", search);
    fetch(`/api/exercises?${params}`).then((r) => r.json()).then(setExercises).catch(() => {});
  }, [selectedMuscle, search]);

  const groups = Object.entries(MUSCLE_GROUPS) as [MuscleGroup, { label: string; emoji: string }][];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">운동 라이브러리</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="운동 검색..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full bg-bg-card border border-border rounded-xl px-4 py-3 text-text placeholder:text-text-muted focus:outline-none focus:border-primary"
      />

      {/* Muscle Filter Chips */}
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

      {/* Exercise List */}
      <div className="space-y-2">
        {exercises.length === 0 && (
          <p className="text-text-muted text-center py-8">검색 결과가 없습니다</p>
        )}
        {exercises.map((ex) => (
          <Card key={ex.id} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-lg">
              {MUSCLE_GROUPS[ex.muscle_group as MuscleGroup]?.emoji ?? "💪"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold truncate">{ex.name_ko}</div>
              <div className="text-xs text-text-muted">
                {MUSCLE_GROUPS[ex.muscle_group as MuscleGroup]?.label} · {EQUIPMENT_LABELS[ex.equipment] || ex.equipment}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
