"use client";

import { useEffect, useState } from "react";
import { StatCard } from "../components/Card";
import { MUSCLE_GROUPS, type MuscleGroup } from "@/lib/types";
import { getStats } from "@/lib/storage";

interface Stats { totalWorkouts: number; totalVolume: number; thisWeekWorkouts: number; streak: number; weeklyVolume: { week: string; volume: number }[]; muscleDistribution: { muscle_group: string; count: number }[]; }

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  useEffect(() => { setStats(getStats()); }, []);

  if (!stats) return <div className="flex items-center justify-center py-20"><div className="text-text-muted">로딩 중...</div></div>;

  const totalMuscleCount = stats.muscleDistribution.reduce((s, m) => s + m.count, 0) || 1;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">대시보드</h1>
      <div className="grid grid-cols-2 gap-3">
        <StatCard emoji="🔥" label="연속 운동" value={stats.streak} unit="일" />
        <StatCard emoji="📅" label="이번 주" value={stats.thisWeekWorkouts} unit="회" />
        <StatCard emoji="🏆" label="총 운동" value={stats.totalWorkouts} unit="회" />
        <StatCard emoji="⚡" label="총 볼륨" value={(stats.totalVolume / 1000).toFixed(1)} unit="톤" />
      </div>
      <div className="bg-bg-card rounded-2xl p-4 border border-border">
        <h2 className="font-semibold mb-4">부위별 운동 비율</h2>
        {stats.muscleDistribution.length === 0 ? <p className="text-text-muted text-sm text-center py-4">운동 기록을 쌓으면 여기에 표시됩니다</p>
        : <div className="space-y-3">{stats.muscleDistribution.map(m => {
          const info = MUSCLE_GROUPS[m.muscle_group as MuscleGroup]; const pct = Math.round((m.count / totalMuscleCount) * 100);
          return (<div key={m.muscle_group}><div className="flex items-center justify-between text-sm mb-1"><span>{info?.emoji} {info?.label || m.muscle_group}</span><span className="text-text-muted">{pct}%</span></div><div className="h-2 bg-bg rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full" style={{width:`${pct}%`}}/></div></div>);
        })}</div>}
      </div>
    </div>
  );
}
