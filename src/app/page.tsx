"use client";

import { useEffect, useState } from "react";
import { StatCard } from "./components/Card";
import Link from "next/link";

interface Stats {
  totalWorkouts: number;
  totalVolume: number;
  thisWeekWorkouts: number;
  streak: number;
}

export default function HomePage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/stats").then((r) => r.json()).then(setStats).catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Fit<span className="text-primary">Flow</span>
        </h1>
        <p className="text-text-muted mt-1">오늘도 한계를 넘어서자</p>
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

      {/* Recent hint */}
      <div className="bg-bg-card rounded-2xl p-4 border border-border">
        <h3 className="font-semibold mb-2">💡 팁</h3>
        <p className="text-sm text-text-muted">
          루틴을 먼저 만들어두면 운동 기록이 더 편해져요. 루틴 탭에서 나만의 운동 프로그램을 구성해보세요!
        </p>
      </div>
    </div>
  );
}
