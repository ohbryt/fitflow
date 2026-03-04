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
  { name: "Push / Pull / Legs", desc: "밀기·당기기·하체 3분할, 주 3~6일", level: "중급", color: "from-indigo-500/20 to-violet-500/10" },
  { name: "Upper / Lower", desc: "상체·하체 2분할, 주 4일", level: "초급~중급", color: "from-emerald-500/20 to-teal-500/10" },
  { name: "Full Body", desc: "전신 운동, 주 3일", level: "초급", color: "from-amber-500/20 to-orange-500/10" },
  { name: "Bro Split", desc: "부위별 1일 1부위, 주 5일", level: "중급~고급", color: "from-rose-500/20 to-pink-500/10" },
];

export default function HomePage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [tipIdx, setTipIdx] = useState(0);
  const [featuredExercises, setFeaturedExercises] = useState<typeof EXERCISES>([]);

  useEffect(() => {
    import("@/lib/storage").then(({ getStats }) => setStats(getStats()));
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
    <div className="space-y-8 animate-slide-up">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-indigo-600/30 via-purple-600/20 to-violet-600/10 glass gradient-border">
        <div className="relative z-10">
          <h1 className="text-4xl font-black tracking-tight">
            <span className="gradient-text">FitFlow</span>
          </h1>
          <p className="text-text-muted mt-2 text-sm leading-relaxed">
            스마트 운동 가이드 & 트래커<br/>
            <span className="text-text/70">36개 운동 · 상세 자세 가이드 · 영상 튜토리얼</span>
          </p>
          <div className="flex gap-3 mt-5">
            <Link href="/workout" className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-semibold active:scale-[0.97] shadow-lg shadow-primary/25">
              ▶ 운동 시작
            </Link>
            <Link href="/exercises" className="px-5 py-2.5 glass rounded-xl text-sm font-semibold active:scale-[0.97] hover:bg-white/10">
              📖 운동 배우기
            </Link>
          </div>
        </div>
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-primary/10 blur-2xl" />
        <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-violet-500/10 blur-2xl" />
      </div>

      {/* Stats Grid */}
      <div className="stagger grid grid-cols-2 gap-3">
        <StatCard emoji="🔥" label="연속 운동" value={stats?.streak ?? 0} unit="일" index={0} />
        <StatCard emoji="📅" label="이번 주" value={stats?.thisWeekWorkouts ?? 0} unit="회" index={1} />
        <StatCard emoji="🏆" label="총 운동" value={stats?.totalWorkouts ?? 0} unit="회" index={2} />
        <StatCard emoji="⚡" label="총 볼륨" value={stats ? (stats.totalVolume / 1000).toFixed(1) : "0"} unit="톤" index={3} />
      </div>

      {/* Featured Exercises */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">오늘의 추천 운동</h2>
          <Link href="/exercises" className="text-xs text-primary font-medium">전체 보기 →</Link>
        </div>
        <div className="stagger grid grid-cols-2 gap-3">
          {featuredExercises.map((ex) => {
            const muscleInfo = MUSCLE_GROUPS[ex.muscle_group as MuscleGroup];
            const diffInfo = DIFFICULTY_LABELS[ex.difficulty as Difficulty];
            return (
              <Link key={ex.id} href={`/exercises/${ex.id}`}>
                <div className="glass gradient-border rounded-2xl p-4 hover:bg-white/5 active:scale-[0.97] h-full group">
                  <div className="text-2xl mb-3 group-hover:animate-float">{muscleInfo?.emoji ?? "💪"}</div>
                  <p className="font-bold text-sm">{ex.name_ko}</p>
                  <p className="text-[10px] text-text-muted mt-0.5">{muscleInfo?.label} · {ex.primary_muscles[0]}</p>
                  <span className={`inline-block mt-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${diffInfo?.color} bg-white/5`}>
                    {diffInfo?.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Training Tip */}
      <div className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-amber-500/10 to-orange-500/5 glass gradient-border">
        <div className="flex items-start gap-3 relative z-10">
          <span className="text-3xl">{BEGINNER_TIPS[tipIdx].icon}</span>
          <div className="flex-1">
            <p className="text-xs text-amber-400 font-semibold mb-1">오늘의 운동 팁</p>
            <h3 className="font-bold">{BEGINNER_TIPS[tipIdx].title}</h3>
            <p className="text-sm text-text-muted mt-1.5 leading-relaxed">{BEGINNER_TIPS[tipIdx].desc}</p>
          </div>
        </div>
        <button
          onClick={() => setTipIdx((tipIdx + 1) % BEGINNER_TIPS.length)}
          className="mt-4 text-xs text-amber-400 font-semibold hover:text-amber-300 relative z-10"
        >
          다음 팁 →
        </button>
        <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-amber-500/10 blur-xl" />
      </div>

      {/* Beginner Guide */}
      <div>
        <h2 className="text-lg font-bold mb-4">초보자 필수 가이드</h2>
        <div className="stagger space-y-2">
          {BEGINNER_TIPS.map((tip, i) => (
            <div key={i} className="glass rounded-xl p-4 flex items-start gap-3 hover:bg-white/5 active:scale-[0.99]">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-lg shrink-0">{tip.icon}</div>
              <div>
                <p className="font-semibold text-sm">{tip.title}</p>
                <p className="text-xs text-text-muted mt-0.5 leading-relaxed">{tip.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Split Programs */}
      <div>
        <h2 className="text-lg font-bold mb-4">추천 분할 프로그램</h2>
        <div className="stagger space-y-3">
          {SPLIT_PROGRAMS.map((prog, i) => (
            <div key={i} className={`relative overflow-hidden rounded-2xl p-5 bg-gradient-to-r ${prog.color} glass gradient-border`}>
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <h3 className="font-bold">{prog.name}</h3>
                  <p className="text-xs text-text-muted mt-1">{prog.desc}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/10 text-primary shrink-0">
                  {prog.level}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Muscle Group Quick Access */}
      <div>
        <h2 className="text-lg font-bold mb-4">부위별 운동</h2>
        <div className="grid grid-cols-4 gap-2.5">
          {(Object.entries(MUSCLE_GROUPS) as [MuscleGroup, { label: string; emoji: string }][]).map(([key, { label, emoji }]) => {
            const count = EXERCISES.filter(e => e.muscle_group === key).length;
            return (
              <Link key={key} href={`/exercises?muscle=${key}`}>
                <div className="glass gradient-border rounded-2xl p-3 text-center hover:bg-white/5 active:scale-[0.95] group">
                  <div className="text-2xl mb-1.5 group-hover:animate-float">{emoji}</div>
                  <p className="text-xs font-bold">{label}</p>
                  <p className="text-[10px] text-text-muted mt-0.5">{count}개</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom spacing for floating nav */}
      <div className="h-8" />
    </div>
  );
}
