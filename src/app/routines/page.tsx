"use client";

import { useEffect, useState } from "react";
import { Card } from "../components/Card";
import type { Exercise } from "@/lib/types";
import { MUSCLE_GROUPS, type MuscleGroup } from "@/lib/types";
import { getRoutines, getExercises, createRoutine, deleteRoutine } from "@/lib/storage";

interface RoutineListItem { id: number; name: string; description?: string; exercise_count: number; }
interface SelectedExercise { exercise_id: number; name_ko: string; muscle_group: string; sets: number; reps: number; weight: number; rest_seconds: number; }

export default function RoutinesPage() {
  const [routines, setRoutines] = useState<RoutineListItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedExercises, setSelectedExercises] = useState<SelectedExercise[]>([]);
  const [allExercises, setAllExercises] = useState<Exercise[]>([]);
  const [showPicker, setShowPicker] = useState(false);

  const loadRoutines = () => setRoutines(getRoutines());
  useEffect(() => { loadRoutines(); }, []);

  const openPicker = () => { setAllExercises(getExercises()); setShowPicker(true); };
  const addExercise = (ex: Exercise) => { setSelectedExercises(prev => [...prev, { exercise_id: ex.id, name_ko: ex.name_ko, muscle_group: ex.muscle_group, sets: 3, reps: 10, weight: 0, rest_seconds: 60 }]); setShowPicker(false); };
  const updateExercise = (i: number, field: string, value: number) => setSelectedExercises(prev => prev.map((e, idx) => idx === i ? { ...e, [field]: value } : e));
  const removeExercise = (i: number) => setSelectedExercises(prev => prev.filter((_, idx) => idx !== i));

  const saveRoutine = () => {
    if (!name.trim()) return;
    createRoutine(name, description, selectedExercises);
    setName(""); setDescription(""); setSelectedExercises([]); setShowForm(false); loadRoutines();
  };
  const handleDelete = (id: number) => { deleteRoutine(id); loadRoutines(); };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">루틴 관리</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl text-sm font-semibold">{showForm ? "취소" : "+ 새 루틴"}</button>
      </div>
      {showForm && (
        <Card className="space-y-3">
          <input type="text" placeholder="루틴 이름 (예: 가슴/삼두 Day)" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-bg rounded-xl px-4 py-3 border border-border text-text placeholder:text-text-muted focus:outline-none focus:border-primary" />
          <input type="text" placeholder="설명 (선택)" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-bg rounded-xl px-4 py-3 border border-border text-text placeholder:text-text-muted focus:outline-none focus:border-primary" />
          <div className="space-y-2">
            {selectedExercises.map((ex, i) => (
              <div key={i} className="bg-bg rounded-xl p-3 border border-border">
                <div className="flex items-center justify-between mb-2"><span className="font-medium text-sm">{MUSCLE_GROUPS[ex.muscle_group as MuscleGroup]?.emoji} {ex.name_ko}</span><button onClick={() => removeExercise(i)} className="text-danger text-xs">삭제</button></div>
                <div className="grid grid-cols-4 gap-2">
                  {[{l:"세트",f:"sets",v:ex.sets},{l:"횟수",f:"reps",v:ex.reps},{l:"무게(kg)",f:"weight",v:ex.weight},{l:"휴식(s)",f:"rest_seconds",v:ex.rest_seconds}].map(({l,f,v})=>(
                    <div key={f}><label className="text-xs text-text-muted">{l}</label><input type="number" value={v} onChange={e=>updateExercise(i,f,+e.target.value)} className="w-full bg-bg-card rounded-lg px-2 py-1 text-center text-sm border border-border"/></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button onClick={openPicker} className="w-full border-2 border-dashed border-border rounded-xl py-3 text-text-muted hover:border-primary hover:text-primary text-sm">+ 운동 추가</button>
          <button onClick={saveRoutine} disabled={!name.trim()} className="w-full bg-primary hover:bg-primary-dark disabled:opacity-50 text-white rounded-xl py-3 font-semibold">루틴 저장</button>
        </Card>
      )}
      {showPicker && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end">
          <div className="bg-bg-card w-full max-h-[70vh] rounded-t-3xl p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4"><h3 className="font-bold text-lg">운동 선택</h3><button onClick={() => setShowPicker(false)} className="text-text-muted">닫기</button></div>
            <div className="space-y-2">{allExercises.map(ex => (
              <button key={ex.id} onClick={() => addExercise(ex)} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-bg-card-hover text-left">
                <span className="text-lg">{MUSCLE_GROUPS[ex.muscle_group as MuscleGroup]?.emoji}</span><div><div className="font-medium text-sm">{ex.name_ko}</div><div className="text-xs text-text-muted">{MUSCLE_GROUPS[ex.muscle_group as MuscleGroup]?.label}</div></div>
              </button>
            ))}</div>
          </div>
        </div>
      )}
      <div className="space-y-2">
        {routines.length === 0 && !showForm && (<div className="text-center py-12 text-text-muted"><div className="text-4xl mb-3">📋</div><p>아직 루틴이 없습니다</p><p className="text-sm">새 루틴을 만들어보세요!</p></div>)}
        {routines.map(r => (
          <Card key={r.id} className="flex items-center justify-between">
            <div><div className="font-semibold">{r.name}</div><div className="text-xs text-text-muted">{r.exercise_count}개 운동 {r.description && `· ${r.description}`}</div></div>
            <button onClick={() => handleDelete(r.id)} className="text-danger text-xs px-3 py-1 rounded-lg hover:bg-danger/10">삭제</button>
          </Card>
        ))}
      </div>
    </div>
  );
}
