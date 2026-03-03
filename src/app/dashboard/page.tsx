"use client";

import { useEffect, useState } from "react";
import { StatCard } from "../components/Card";
import { MUSCLE_GROUPS, type MuscleGroup } from "@/lib/types";

interface Stats {
  totalWorkouts: number;
  totalVolume: number;
  thisWeekWorkouts: number;
  streak: number;
  weeklyVolume: { week: string; volume: number }[];
  muscleDistribution: { muscle_group: string; count: number }[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/stats").then((r) => r.json()).then(setStats).catch(() => {});
  }, []);

  if (!stats) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-text-muted">로딩 중...</div>
      </div>
    );
  }

  const maxVolume = Math.max(...(stats.weeklyVolume.map((w) => w.volume) || [0]), 1);
  const totalMuscleCount = stats.muscleDistribution.reduce((s, m) => s + m.count, 0) || 1;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">대시보드</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard emoji="🔥" label="연속 운동" value={stats.streak} unit="일" />
        <StatCard emoji="📅" label="이번 주" value={stats.thisWeekWorkouts} unit="회" />
        <StatCard emoji="🏆" label="총 운동" value={stats.totalWorkouts} unit="회" />
        <StatCard emoji="⚡" label="총 볼륨" value={(stats.totalVolume / 1000).toFixed(1)} unit="톤" />
      </div>

      {/* Weekly Volume Chart */}
      <div className="bg-bg-card rounded-2xl p-4 border border-border">
        <h2 className="font-semibold mb-4">주간 볼륨 추이</h2>
        {stats.weeklyVolume.length === 0 ? (
          <p className="text-text-muted text-sm text-center py-4">아직 데이터가 없습니다</p>
        ) : (
          <div className="flex items-end gap-2 h-40">
            {stats.weeklyVolume.map((w, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-text-muted">{(w.volume / 1000).toFixed(1)}t</span>
                <div
                  className="w-full bg-primary rounded-t-lg min-h-[4px]"
                  style={{ height: `${(w.volume / maxVolume) * 100}%` }}
                />
                <span className="text-xs text-text-muted">W{w.week.split("W")[1]}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Muscle Distribution */}
      <div className="bg-bg-card rounded-2xl p-4 border border-border">
        <h2 className="font-semibold mb-4">부위별 운동 비율 (30일)</h2>
        {stats.muscleDistribution.length === 0 ? (
          <p className="text-text-muted text-sm text-center py-4">아직 데이터가 없습니다</p>
        ) : (
          <div className="space-y-3">
            {stats.muscleDistribution.map((m) => {
              const info = MUSCLE_GROUPS[m.muscle_group as MuscleGroup];
              const pct = Math.round((m.count / totalMuscleCount) * 100);
              return (
                <div key={m.muscle_group}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>{info?.emoji} {info?.label || m.muscle_group}</span>
                    <span className="text-text-muted">{pct}%</span>
                  </div>
                  <div className="h-2 bg-bg rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
