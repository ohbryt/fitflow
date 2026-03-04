"use client";

import { useEffect, useState } from "react";
import { StatCard } from "./components/Card";
import Link from "next/link";
import { EXERCISES } from "@/lib/exercise-data";
import { MUSCLE_GROUPS, DIFFICULTY_LABELS } from "@/lib/types";
import type { MuscleGroup, Difficulty } from "@/lib/types";

interface Stats {
  totalWorkouts: number;
  totalVolume: number;
  thisWeekWorkouts: number;
  streak: number;
}

const BEGINNER_TIPS = [
  { title: "워밍업은 필수", desc: "5~10분 가벼운 유산소 + 동적 스트레칭으로 부상을 예방하세요.", icon: "🔥" },
  { title: "폼이 먼저, 무게는 나중", desc: "정확한 자세를 먼저 익히고 점진적으로 무게를 올리세요.", icon: "🎯" },
  { title: "점진적 과부하", desc: "매주 무게나 반복 횟수를 조금씩 늘려야 근육이 성장합니다.", icon: "📈" },
  { title: "충분한 휴식", desc: "같은 부위는 48~72시간 쉬어야 회복됩니다. 수면도 중요!", icon: "😴" },
  { title: "영양 섭취", desc: "단백질 체중(kg) × 1.6~2.2g, 충분한 수분 섭취를 권장합니다.", icon: "🥩" },
  { title: "기록하는 습관", desc: "운동 기록을 남기면 성장을 확인하고 동기 부여가 됩니다.", icon: "📝" },
];

const SPLIT_PROGRAMS = [
  { name: "Push / Pull / Legs", desc: "밀기·당기기·하체 3분할, 주 3~6일", level: "중급", muscles: ["가슴·어깨·삼두", "등·이두", "하체·코어"] },
  { name: "Upper / Lower", desc: "상체·하체 2분할, 주 4일", level: "초급~중급", muscles: ["상체 전체", "하체 전체"] },
  { name: "Full Body", desc: "전신 운동, 주 3일", level: "초급", muscles: ["전신 주요 근육"] },
  { name: "Bro Split", desc: "부위별 1일 1부위, 주 5일", level: "중급~고급", muscles: ["가슴", "등", "어깨", "팔", "하체"] },
];

export default function HomePage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [tipIdx, setTipIdx] = useState(0);
  const [featuredExercises, setFeaturedExercises] = useState<typeof EXERCISES>([]);

  useEffect(() => {
    import("@/lib/storage").then(({ getStats }) => setStats(getStats()));
    // Pick 4 random exercises from different muscle groups
    const groups = ["chest", "back", "legs", "shoulders", "arms", "core"];
    const picked = groups
      .sort(() => Math.random() - 0.5)
      .slice(0, 4)
      .map(g => {
        const inGroup = EXERCISES.filter(e => e.muscle_group === g);
        return inGroup[Math.floor(Math.random() * inGroup.length)];
      })
      .filter(Boolean);
    setFeaturedExercises(picked);
    setTipIdx(Math.floor(Math.random() * BEGINNER_TIPS.length));
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Fit<span className="text-primary">Flow</span>
        </h1>
        <p className="text-text-muted mt-1">스마트 운동 가이드 & 트래커</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard emoji="🔥" label="연속 운동" value={stats?.streak ?? 0} unit="일" />
        <StatCard emoji="📅" label="이번 주" value={stats?.thisWeekWorkouts ?? 0} unit="회" />
        <StatCard emoji="🏆" label="총 운동" value={stats?.totalWorkouts ?? 0} unit="회" />
        <StatCard emoji="⚡" label="총 볼륨" value={stats ? (stats.totalVolume / 1000).toFixed(1) : "0"} unit="톤" />
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">빠른 시작</h2>
        <div className="grid grid-cols-2 gap-3">
          <Link href="/workout" className="bg-primary hover:bg-primary-dark text-white rounded-2xl p-4 text-center font-semibold active:scale-[0.98]">
            <div className="text-2xl mb-2">▶️</div>
            운동 시작
          </Link>
          <Link href="/routines" className="bg-bg-card hover:bg-bg-card-hover border border-border rounded-2xl p-4 text-center font-semibold active:scale-[0.98]">
            <div className="text-2xl mb-2">📋</div>
            루틴 관리
          </Link>
        </div>
      </div>

      {/* Featured Exercises */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">오늘의 추천 운동</h2>
          <Link href="/exercises" className="text-xs text-primary">전체 보기 →</Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {featuredExercises.map((ex) => {
            const muscleInfo = MUSCLE_GROUPS[ex.muscle_group as MuscleGroup];
            const diffInfo = DIFFICULTY_LABELS[ex.difficulty as Difficulty];
            return (
              <Link key={ex.id} href={`/exercises/${ex.id}`}>
                <div className="bg-bg-card rounded-2xl p-4 border border-border hover:border-primary/50 active:scale-[0.98] transition-all h-full">
                  <div className="text-2xl mb-2">{muscleInfo?.emoji ?? "💪"}</div>
                  <p className="font-semibold text-sm truncate">{ex.name_ko}</p>
                  <p className="text-[10px] text-text-muted mt-0.5">{muscleInfo?.label}</p>
                  <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${diffInfo?.color} bg-white/5`}>
                    {diffInfo?.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Training Tip */}
      <div className="bg-gradient-to-br from-primary/10 to-blue-500/5 rounded-2xl p-5 border border-primary/20">
        <div className="flex items-start gap-3">
          <span className="text-2xl">{BEGINNER_TIPS[tipIdx].icon}</span>
          <div>
            <h3 className="font-semibold text-sm">{BEGINNER_TIPS[tipIdx].title}</h3>
            <p className="text-sm text-text-muted mt-1 leading-relaxed">{BEGINNER_TIPS[tipIdx].desc}</p>
          </div>
        </div>
        <button
          onClick={() => setTipIdx((tipIdx + 1) % BEGINNER_TIPS.length)}
          className="mt-3 text-xs text-primary font-medium"
        >
          다음 팁 보기 →
        </button>
      </div>

      {/* Beginner Guide */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">초보자 가이드</h2>
        <div className="grid grid-cols-1 gap-2">
          {BEGINNER_TIPS.map((tip, i) => (
            <div key={i} className="bg-bg-card rounded-xl p-3.5 border border-border flex items-start gap-3">
              <span className="text-xl shrink-0">{tip.icon}</span>
              <div>
                <p className="font-semibold text-sm">{tip.title}</p>
                <p className="text-xs text-text-muted mt-0.5 leading-relaxed">{tip.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Split Programs */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">추천 분할 프로그램</h2>
        <div className="space-y-3">
          {SPLIT_PROGRAMS.map((prog, i) => (
            <div key={i} className="bg-bg-card rounded-2xl p-4 border border-border">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-sm">{prog.name}</h3>
                  <p className="text-xs text-text-muted mt-0.5">{prog.desc}</p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/15 text-primary shrink-0">
                  {prog.level}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {prog.muscles.map((m, j) => (
                  <span key={j} className="px-2 py-1 bg-white/5 rounded-lg text-[11px] text-text-muted">{m}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Muscle Group Quick Access */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">부위별 운동 찾기</h2>
        <div className="grid grid-cols-4 gap-2">
          {(Object.entries(MUSCLE_GROUPS) as [MuscleGroup, { label: string; emoji: string }][]).map(([key, { label, emoji }]) => {
            const count = EXERCISES.filter(e => e.muscle_group === key).length;
            return (
              <Link key={key} href={`/exercises?muscle=${key}`}>
                <div className="bg-bg-card rounded-xl p-3 border border-border text-center hover:border-primary/50 active:scale-[0.97] transition-all">
                  <div className="text-2xl mb-1">{emoji}</div>
                  <p className="text-xs font-semibold">{label}</p>
                  <p className="text-[10px] text-text-muted">{count}개</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer space */}
      <div className="h-4" />
    </div>
  );
}
