"use client";

import { useState } from "react";
import Link from "next/link";
import { EXERCISES } from "@/lib/exercise-data";
import { MUSCLE_GROUPS, DIFFICULTY_LABELS } from "@/lib/types";
import type { MuscleGroup, Difficulty } from "@/lib/types";

// 근육 부위 → 상세 근육명 매핑
const MUSCLE_DETAILS: Record<string, { label: string; muscles: string[]; group: MuscleGroup; description: string }> = {
  chest: {
    label: "가슴",
    muscles: ["대흉근(상부)", "대흉근(중부)", "대흉근(하부)", "대흉근(전체)"],
    group: "chest",
    description: "벤치프레스, 푸시업 등으로 발달시키는 상체 전면의 대표 근육입니다.",
  },
  "front-delt": {
    label: "전면 삼각근",
    muscles: ["전면 삼각근", "삼각근(전체)"],
    group: "shoulders",
    description: "어깨 전면부로, 프레스 동작이나 프론트 레이즈로 자극됩니다.",
  },
  "side-delt": {
    label: "측면 삼각근",
    muscles: ["측면 삼각근", "삼각근(전체)"],
    group: "shoulders",
    description: "넓은 어깨를 만드는 핵심! 레터럴 레이즈가 대표 운동입니다.",
  },
  "rear-delt": {
    label: "후면 삼각근",
    muscles: ["후면 삼각근", "삼각근(전체)"],
    group: "shoulders",
    description: "어깨 후면부로, 페이스풀이나 리어 델트 플라이로 발달시킵니다.",
  },
  bicep: {
    label: "이두근",
    muscles: ["이두근", "상완근"],
    group: "arms",
    description: "팔 앞쪽 근육으로, 바벨 컬과 덤벨 컬이 대표 운동입니다.",
  },
  tricep: {
    label: "삼두근",
    muscles: ["삼두근"],
    group: "arms",
    description: "팔 뒤쪽 근육으로, 팔 둘레의 2/3를 차지합니다. 푸시다운, 딥스가 효과적!",
  },
  forearm: {
    label: "전완근",
    muscles: ["전완근"],
    group: "arms",
    description: "손목과 팔꿈치 사이의 근육으로, 그립 강화에 중요합니다.",
  },
  abs: {
    label: "복직근 (식스팩)",
    muscles: ["복직근", "코어 전체", "복횡근"],
    group: "core",
    description: "식스팩을 만드는 핵심 근육! 크런치, 레그레이즈가 대표 운동입니다.",
  },
  oblique: {
    label: "복사근",
    muscles: ["복사근", "코어 전체"],
    group: "core",
    description: "옆구리 근육으로, 러시안 트위스트와 사이드 플랭크로 자극됩니다.",
  },
  traps: {
    label: "승모근",
    muscles: ["승모근"],
    group: "back",
    description: "목과 어깨 사이의 근육으로, 데드리프트와 슈러그로 발달시킵니다.",
  },
  lats: {
    label: "광배근",
    muscles: ["광배근"],
    group: "back",
    description: "V자 등을 만드는 넓은 등 근육! 풀업과 랫풀다운이 핵심입니다.",
  },
  rhomboids: {
    label: "능형근",
    muscles: ["능형근"],
    group: "back",
    description: "견갑골 사이의 근육으로, 로우 동작에서 견갑골을 모을 때 사용됩니다.",
  },
  erector: {
    label: "척추기립근",
    muscles: ["척추기립근"],
    group: "back",
    description: "척추를 따라 이어지는 근육으로, 데드리프트와 백 익스텐션이 효과적입니다.",
  },
  glute: {
    label: "둔근 (엉덩이)",
    muscles: ["둔근"],
    group: "legs",
    description: "인체에서 가장 큰 근육! 스쿼트, 힙 스러스트로 발달시킵니다.",
  },
  quad: {
    label: "대퇴사두근 (앞허벅지)",
    muscles: ["대퇴사두근"],
    group: "legs",
    description: "허벅지 앞쪽의 4개 근육으로, 스쿼트와 레그프레스가 대표 운동입니다.",
  },
  hamstring: {
    label: "햄스트링 (뒤허벅지)",
    muscles: ["햄스트링"],
    group: "legs",
    description: "허벅지 뒤쪽 근육으로, 루마니안 데드리프트와 레그 컬이 효과적입니다.",
  },
  adductor: {
    label: "내전근 (안쪽 허벅지)",
    muscles: ["내전근"],
    group: "legs",
    description: "허벅지 안쪽 근육으로, 와이드 스쿼트에서 보조적으로 사용됩니다.",
  },
  calf: {
    label: "종아리",
    muscles: ["비복근", "가자미근"],
    group: "legs",
    description: "카프 레이즈로 발달시키며, 서서 하면 비복근, 앉아서 하면 가자미근을 자극합니다.",
  },
  "hip-flexor": {
    label: "고관절 굴곡근",
    muscles: ["고관절 굴곡근"],
    group: "legs",
    description: "다리를 들어올릴 때 사용되는 근육으로, 레그레이즈에서도 동원됩니다.",
  },
};

// 근육에 해당하는 운동 찾기
function findExercisesForMuscle(muscleNames: string[]) {
  return EXERCISES.filter(ex =>
    ex.primary_muscles.some(m => muscleNames.includes(m)) ||
    ex.secondary_muscles.some(m => muscleNames.includes(m))
  ).map(ex => ({
    ...ex,
    isPrimary: ex.primary_muscles.some(m => muscleNames.includes(m)),
  }));
}

export default function AtlasPage() {
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);
  const [view, setView] = useState<"front" | "back">("front");

  const muscleInfo = selectedMuscle ? MUSCLE_DETAILS[selectedMuscle] : null;
  const exercises = muscleInfo ? findExercisesForMuscle(muscleInfo.muscles) : [];
  const primaryExercises = exercises.filter(e => e.isPrimary);
  const secondaryExercises = exercises.filter(e => !e.isPrimary);

  const handleMuscleTap = (muscleId: string) => {
    // SVG region ID에서 -l, -r 접미사 제거
    const base = muscleId.replace(/-[lr]$/, "");
    if (MUSCLE_DETAILS[base]) {
      setSelectedMuscle(selectedMuscle === base ? null : base);
    }
  };

  const getColor = (id: string) => {
    const base = id.replace(/-[lr]$/, "");
    if (selectedMuscle === base) return "#f97316"; // 선택됨 - orange
    return "#1e293b";
  };
  const getOpacity = (id: string) => {
    const base = id.replace(/-[lr]$/, "");
    if (selectedMuscle === base) return 0.9;
    return 0.4;
  };

  const muscleButton = (id: string, cx: number, cy: number, rx: number, ry: number) => (
    <ellipse
      key={id}
      cx={cx} cy={cy} rx={rx} ry={ry}
      fill={getColor(id)} opacity={getOpacity(id)}
      stroke={selectedMuscle === id.replace(/-[lr]$/, "") ? "#fb923c" : "#475569"}
      strokeWidth={selectedMuscle === id.replace(/-[lr]$/, "") ? 2 : 0.5}
      onClick={() => handleMuscleTap(id)}
      className="cursor-pointer transition-all hover:opacity-70"
    />
  );

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl p-6 glass-dark">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🧬</span>
            <div>
              <h1 className="text-2xl font-black">근육 아틀라스</h1>
              <p className="text-white/50 text-xs mt-0.5">터치해서 근육별 운동 찾기</p>
            </div>
          </div>
          <p className="text-white/60 text-sm mt-3">
            궁금한 근육을 터치하면 해당 부위를 자극하는 운동을 알려드려요!
          </p>
        </div>
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-orange-500/20 blur-3xl" />
      </div>

      {/* View Toggle */}
      <div className="flex gap-2 justify-center">
        <button
          onClick={() => setView("front")}
          className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
            view === "front" ? "bg-primary text-white shadow-lg shadow-primary/30" : "glass text-text-secondary"
          }`}
        >
          앞면
        </button>
        <button
          onClick={() => setView("back")}
          className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
            view === "back" ? "bg-primary text-white shadow-lg shadow-primary/30" : "glass text-text-secondary"
          }`}
        >
          뒷면
        </button>
      </div>

      {/* Interactive Body Map */}
      <div className="glass rounded-2xl p-6 gradient-border">
        <div className="flex justify-center">
          {view === "front" ? (
            <svg viewBox="0 0 200 400" width="220" height="440" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="100" cy="30" rx="22" ry="26" fill="#334155" stroke="#475569" strokeWidth="1"/>
              <rect x="90" y="54" width="20" height="14" rx="4" fill="#334155"/>
              {muscleButton("front-delt-l", 62, 82, 14, 16)}
              {muscleButton("front-delt-r", 138, 82, 14, 16)}
              {muscleButton("side-delt-l", 52, 80, 8, 14)}
              {muscleButton("side-delt-r", 148, 80, 8, 14)}
              {muscleButton("chest-l", 78, 108, 22, 18)}
              {muscleButton("chest-r", 122, 108, 22, 18)}
              {muscleButton("bicep-l", 48, 120, 10, 24)}
              {muscleButton("bicep-r", 152, 120, 10, 24)}
              {muscleButton("forearm-l", 42, 168, 8, 26)}
              {muscleButton("forearm-r", 158, 168, 8, 26)}
              <rect
                id="abs"
                x="82" y="130" width="36" height="52" rx="6"
                fill={getColor("abs")} opacity={getOpacity("abs")}
                stroke={selectedMuscle === "abs" ? "#fb923c" : "#475569"}
                strokeWidth={selectedMuscle === "abs" ? 2 : 0.5}
                onClick={() => handleMuscleTap("abs")}
                className="cursor-pointer transition-all hover:opacity-70"
              />
              <line x1="100" y1="132" x2="100" y2="180" stroke="#475569" strokeWidth="0.5" opacity="0.5" pointerEvents="none"/>
              <line x1="84" y1="145" x2="116" y2="145" stroke="#475569" strokeWidth="0.5" opacity="0.5" pointerEvents="none"/>
              <line x1="84" y1="158" x2="116" y2="158" stroke="#475569" strokeWidth="0.5" opacity="0.5" pointerEvents="none"/>
              <line x1="84" y1="171" x2="116" y2="171" stroke="#475569" strokeWidth="0.5" opacity="0.5" pointerEvents="none"/>
              {muscleButton("oblique-l", 72, 156, 10, 24)}
              {muscleButton("oblique-r", 128, 156, 10, 24)}
              {muscleButton("hip-flexor-l", 82, 196, 10, 10)}
              {muscleButton("hip-flexor-r", 118, 196, 10, 10)}
              {muscleButton("quad-l", 80, 250, 18, 42)}
              {muscleButton("quad-r", 120, 250, 18, 42)}
              {muscleButton("adductor-l", 92, 248, 8, 30)}
              {muscleButton("adductor-r", 108, 248, 8, 30)}
              {muscleButton("calf-l", 80, 332, 12, 30)}
              {muscleButton("calf-r", 120, 332, 12, 30)}
              <ellipse cx="80" cy="375" rx="12" ry="6" fill="#334155" stroke="#475569" strokeWidth="0.5"/>
              <ellipse cx="120" cy="375" rx="12" ry="6" fill="#334155" stroke="#475569" strokeWidth="0.5"/>
              <ellipse cx="38" cy="200" rx="7" ry="9" fill="#334155" stroke="#475569" strokeWidth="0.5"/>
              <ellipse cx="162" cy="200" rx="7" ry="9" fill="#334155" stroke="#475569" strokeWidth="0.5"/>
            </svg>
          ) : (
            <svg viewBox="0 0 200 400" width="220" height="440" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="100" cy="30" rx="22" ry="26" fill="#334155" stroke="#475569" strokeWidth="1"/>
              <rect x="90" y="54" width="20" height="14" rx="4" fill="#334155"/>
              <path
                d="M72,68 Q100,58 128,68 L122,92 Q100,86 78,92 Z"
                fill={getColor("traps")} opacity={getOpacity("traps")}
                stroke={selectedMuscle === "traps" ? "#fb923c" : "#475569"}
                strokeWidth={selectedMuscle === "traps" ? 2 : 0.5}
                onClick={() => handleMuscleTap("traps")}
                className="cursor-pointer transition-all hover:opacity-70"
              />
              {muscleButton("rear-delt-l", 60, 84, 14, 14)}
              {muscleButton("rear-delt-r", 140, 84, 14, 14)}
              <rect
                x="86" y="90" width="28" height="24" rx="4"
                fill={getColor("rhomboids")} opacity={getOpacity("rhomboids")}
                stroke={selectedMuscle === "rhomboids" ? "#fb923c" : "#475569"}
                strokeWidth={selectedMuscle === "rhomboids" ? 2 : 0.5}
                onClick={() => handleMuscleTap("rhomboids")}
                className="cursor-pointer transition-all hover:opacity-70"
              />
              <path
                d="M68,96 Q60,130 68,160 L84,150 Q82,120 80,96 Z"
                fill={getColor("lats-l")} opacity={getOpacity("lats-l")}
                stroke={selectedMuscle === "lats" ? "#fb923c" : "#475569"}
                strokeWidth={selectedMuscle === "lats" ? 2 : 0.5}
                onClick={() => handleMuscleTap("lats-l")}
                className="cursor-pointer transition-all hover:opacity-70"
              />
              <path
                d="M132,96 Q140,130 132,160 L116,150 Q118,120 120,96 Z"
                fill={getColor("lats-r")} opacity={getOpacity("lats-r")}
                stroke={selectedMuscle === "lats" ? "#fb923c" : "#475569"}
                strokeWidth={selectedMuscle === "lats" ? 2 : 0.5}
                onClick={() => handleMuscleTap("lats-r")}
                className="cursor-pointer transition-all hover:opacity-70"
              />
              {muscleButton("tricep-l", 48, 118, 10, 26)}
              {muscleButton("tricep-r", 152, 118, 10, 26)}
              <rect
                x="92" y="116" width="16" height="58" rx="4"
                fill={getColor("erector")} opacity={getOpacity("erector")}
                stroke={selectedMuscle === "erector" ? "#fb923c" : "#475569"}
                strokeWidth={selectedMuscle === "erector" ? 2 : 0.5}
                onClick={() => handleMuscleTap("erector")}
                className="cursor-pointer transition-all hover:opacity-70"
              />
              <ellipse cx="42" cy="168" rx="8" ry="26" fill={getColor("forearm-l")} opacity={getOpacity("forearm-l")} stroke="#475569" strokeWidth="0.5" onClick={() => handleMuscleTap("forearm-l")} className="cursor-pointer"/>
              <ellipse cx="158" cy="168" rx="8" ry="26" fill={getColor("forearm-r")} opacity={getOpacity("forearm-r")} stroke="#475569" strokeWidth="0.5" onClick={() => handleMuscleTap("forearm-r")} className="cursor-pointer"/>
              {muscleButton("glute-l", 84, 198, 18, 16)}
              {muscleButton("glute-r", 116, 198, 18, 16)}
              {muscleButton("hamstring-l", 80, 256, 16, 40)}
              {muscleButton("hamstring-r", 120, 256, 16, 40)}
              {muscleButton("calf-l", 80, 332, 13, 32)}
              {muscleButton("calf-r", 120, 332, 13, 32)}
              <ellipse cx="80" cy="375" rx="12" ry="6" fill="#334155" stroke="#475569" strokeWidth="0.5"/>
              <ellipse cx="120" cy="375" rx="12" ry="6" fill="#334155" stroke="#475569" strokeWidth="0.5"/>
              <ellipse cx="38" cy="200" rx="7" ry="9" fill="#334155" stroke="#475569" strokeWidth="0.5"/>
              <ellipse cx="162" cy="200" rx="7" ry="9" fill="#334155" stroke="#475569" strokeWidth="0.5"/>
            </svg>
          )}
        </div>

        {/* 선택 안내 */}
        {!selectedMuscle && (
          <p className="text-center text-text-muted text-xs mt-4 animate-pulse">
            👆 근육 부위를 터치해보세요!
          </p>
        )}
      </div>

      {/* Muscle Info Panel */}
      {muscleInfo && (
        <div className="space-y-4 animate-slide-up">
          {/* Muscle Detail */}
          <div className="glass rounded-2xl p-5 gradient-border border-2 border-orange-500/20">
            <div className="flex items-start gap-3 mb-3">
              <span className="text-2xl">{MUSCLE_GROUPS[muscleInfo.group]?.emoji}</span>
              <div>
                <h2 className="font-black text-lg">{muscleInfo.label}</h2>
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-bold text-primary">
                  {MUSCLE_GROUPS[muscleInfo.group]?.label}
                </span>
              </div>
            </div>
            <p className="text-sm text-text-muted leading-relaxed">{muscleInfo.description}</p>
          </div>

          {/* Primary Exercises */}
          {primaryExercises.length > 0 && (
            <div>
              <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500" /> 주동근 운동 ({primaryExercises.length}개)
              </h3>
              <div className="space-y-2">
                {primaryExercises.map(ex => {
                  const diffInfo = DIFFICULTY_LABELS[ex.difficulty as Difficulty];
                  return (
                    <Link key={ex.id} href={`/exercises/${ex.id}`}>
                      <div className="glass rounded-xl p-3.5 flex items-center gap-3 hover:bg-orange-50/60 active:scale-[0.98] transition-all group">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/15 flex items-center justify-center text-lg shrink-0 group-hover:animate-float">
                          {MUSCLE_GROUPS[ex.muscle_group as MuscleGroup]?.emoji ?? "💪"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm">{ex.name_ko}</p>
                          <p className="text-[10px] text-text-muted mt-0.5">
                            {ex.primary_muscles[0]} · {ex.recommended_sets} · {ex.recommended_reps}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-[10px] font-bold ${diffInfo?.color}`}>{diffInfo?.label}</span>
                          <span className="text-text-muted text-xs">→</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Secondary Exercises */}
          {secondaryExercises.length > 0 && (
            <div>
              <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400/50" /> 보조근 참여 운동 ({secondaryExercises.length}개)
              </h3>
              <div className="space-y-2">
                {secondaryExercises.slice(0, 5).map(ex => {
                  const diffInfo = DIFFICULTY_LABELS[ex.difficulty as Difficulty];
                  return (
                    <Link key={ex.id} href={`/exercises/${ex.id}`}>
                      <div className="glass rounded-xl p-3 flex items-center gap-3 hover:bg-white/5 active:scale-[0.98] transition-all">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-sm shrink-0">
                          {MUSCLE_GROUPS[ex.muscle_group as MuscleGroup]?.emoji ?? "💪"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-xs">{ex.name_ko}</p>
                          <p className="text-[10px] text-text-muted">{ex.primary_muscles[0]}</p>
                        </div>
                        <span className={`text-[10px] font-bold ${diffInfo?.color}`}>{diffInfo?.label}</span>
                      </div>
                    </Link>
                  );
                })}
                {secondaryExercises.length > 5 && (
                  <p className="text-center text-[11px] text-text-muted">
                    +{secondaryExercises.length - 5}개 더 보기
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Gym Mode CTA */}
          <Link href="/gym-mode">
            <div className="glass rounded-2xl p-4 flex items-center gap-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 hover:from-green-500/20 hover:to-emerald-500/20 transition-all group">
              <span className="text-2xl group-hover:animate-float">📱</span>
              <div className="flex-1">
                <p className="font-bold text-sm">짐 모드로 따라하기</p>
                <p className="text-[10px] text-text-muted mt-0.5">헬스장에서 폰을 앞에 놓고 영상 보면서 운동하세요!</p>
              </div>
              <span className="text-text-muted">→</span>
            </div>
          </Link>
        </div>
      )}

      {/* Quick Muscle List */}
      {!selectedMuscle && (
        <div>
          <h2 className="text-lg font-bold mb-4">전체 근육 목록</h2>
          <div className="grid grid-cols-2 gap-2.5">
            {Object.entries(MUSCLE_DETAILS).map(([key, info]) => {
              const exerciseCount = findExercisesForMuscle(info.muscles).length;
              return (
                <button
                  key={key}
                  onClick={() => { setSelectedMuscle(key); setView(["traps","lats","rhomboids","erector","rear-delt","glute","hamstring","tricep"].some(m => key.startsWith(m)) ? "back" : "front"); }}
                  className="glass rounded-xl p-3 text-left hover:bg-orange-50/60 active:scale-[0.97] transition-all"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{MUSCLE_GROUPS[info.group]?.emoji}</span>
                    <span className="font-bold text-xs">{info.label}</span>
                  </div>
                  <p className="text-[10px] text-text-muted">{exerciseCount}개 운동</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="h-8" />
    </div>
  );
}
