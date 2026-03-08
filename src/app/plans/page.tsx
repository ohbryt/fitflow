"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AI_WORKOUT_PLANS,
  PLAN_LEVELS,
  type WorkoutPlan,
} from "@/lib/video-data";

export default function PlansPage() {
  const [openPlan, setOpenPlan] = useState<string | null>(null);
  const [activePlan, setActivePlan] = useState<string | null>(null);

  // localStorage에서 활성 플랜 불러오기
  useState(() => {
    try {
      const saved = localStorage.getItem("fitflow_active_plan");
      if (saved) setActivePlan(saved);
    } catch {}
  });

  const startPlan = (planId: string) => {
    setActivePlan(planId);
    try { localStorage.setItem("fitflow_active_plan", planId); } catch {}
  };

  const stopPlan = () => {
    setActivePlan(null);
    try { localStorage.removeItem("fitflow_active_plan"); } catch {}
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl p-6 glass-dark">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🤖</span>
            <div>
              <h1 className="text-2xl font-black">AI 운동 플랜</h1>
              <p className="text-white/50 text-xs mt-0.5">나에게 맞는 프로그램 찾기</p>
            </div>
          </div>
          <p className="text-white/60 text-sm mt-3 leading-relaxed">
            목표와 레벨에 맞는 체계적인 운동 프로그램으로<br/>
            <span className="text-primary-light font-semibold">운동이 쉬워집니다!</span>
          </p>
        </div>
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-accent/15 blur-3xl" />
      </div>

      {/* Active Plan Banner */}
      {activePlan && (
        <div className="glass rounded-2xl p-4 border-2 border-primary/30 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-xl">
              {AI_WORKOUT_PLANS.find(p => p.id === activePlan)?.emoji ?? "🏋️"}
            </div>
            <div className="flex-1">
              <p className="text-[10px] text-primary font-bold">현재 진행 중인 프로그램</p>
              <p className="font-bold text-sm">
                {AI_WORKOUT_PLANS.find(p => p.id === activePlan)?.name}
              </p>
            </div>
            <Link href="/workout" className="px-3 py-1.5 bg-primary text-white rounded-xl text-xs font-bold">
              운동 시작
            </Link>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="glass rounded-2xl p-3 text-center">
          <p className="text-2xl font-black text-primary">{AI_WORKOUT_PLANS.length}</p>
          <p className="text-[10px] text-text-muted font-bold mt-0.5">프로그램</p>
        </div>
        <div className="glass rounded-2xl p-3 text-center">
          <p className="text-2xl font-black text-primary">4~30</p>
          <p className="text-[10px] text-text-muted font-bold mt-0.5">일/주</p>
        </div>
        <div className="glass rounded-2xl p-3 text-center">
          <p className="text-2xl font-black text-primary">초~중급</p>
          <p className="text-[10px] text-text-muted font-bold mt-0.5">레벨</p>
        </div>
      </div>

      {/* How It Works */}
      <div className="glass rounded-2xl p-5 gradient-border">
        <h2 className="font-bold text-sm mb-4 flex items-center gap-2">
          <span className="text-lg">💡</span> 이렇게 사용하세요
        </h2>
        <div className="space-y-3">
          {[
            { step: "1", title: "프로그램 선택", desc: "목표와 레벨에 맞는 프로그램을 골라보세요" },
            { step: "2", title: "운동 시작", desc: "스케줄에 맞춰 매일 운동을 시작합니다" },
            { step: "3", title: "영상으로 학습", desc: "각 운동의 연결된 영상으로 자세를 확인하세요" },
            { step: "4", title: "기록 & 성장", desc: "운동 기록을 남기고 점진적으로 강도를 올려요" },
          ].map(item => (
            <div key={item.step} className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-primary/20 text-primary text-xs font-black flex items-center justify-center shrink-0">
                {item.step}
              </div>
              <div>
                <p className="font-bold text-xs">{item.title}</p>
                <p className="text-[11px] text-text-muted mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Plans List */}
      <div>
        <h2 className="text-lg font-bold mb-4">추천 프로그램</h2>
        <div className="space-y-4">
          {AI_WORKOUT_PLANS.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isOpen={openPlan === plan.id}
              isActive={activePlan === plan.id}
              onToggle={() => setOpenPlan(openPlan === plan.id ? null : plan.id)}
              onStart={() => startPlan(plan.id)}
              onStop={stopPlan}
            />
          ))}
        </div>
      </div>

      {/* CTA to Videos */}
      <Link href="/videos">
        <div className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-r from-red-500/15 to-orange-500/15 glass gradient-border group hover:from-red-500/25 hover:to-orange-500/25 transition-all">
          <div className="flex items-center gap-4 relative z-10">
            <span className="text-4xl group-hover:animate-float">🎬</span>
            <div className="flex-1">
              <h3 className="font-bold text-sm">운동 영상 보러가기</h3>
              <p className="text-xs text-text-muted mt-1">
                인기 피트니스 쇼츠를 보면서 자세를 배워보세요!
              </p>
            </div>
            <span className="text-text-muted text-lg">→</span>
          </div>
        </div>
      </Link>

      {/* AI Coach CTA */}
      <Link href="/coach">
        <div className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-r from-violet-500/15 to-indigo-500/15 glass gradient-border group hover:from-violet-500/25 hover:to-indigo-500/25 transition-all mt-3">
          <div className="flex items-center gap-4 relative z-10">
            <span className="text-4xl group-hover:animate-float">💬</span>
            <div className="flex-1">
              <h3 className="font-bold text-sm">AI 코치에게 물어보기</h3>
              <p className="text-xs text-text-muted mt-1">
                운동, 자세, 식단에 대해 AI 코치가 답변해드려요!
              </p>
            </div>
            <span className="text-text-muted text-lg">→</span>
          </div>
        </div>
      </Link>

      <div className="h-8" />
    </div>
  );
}

function PlanCard({
  plan,
  isOpen,
  isActive,
  onToggle,
  onStart,
  onStop,
}: {
  plan: WorkoutPlan;
  isOpen: boolean;
  isActive: boolean;
  onToggle: () => void;
  onStart: () => void;
  onStop: () => void;
}) {
  const levelInfo = PLAN_LEVELS[plan.level];

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${plan.color} glass gradient-border transition-all ${isActive ? "ring-2 ring-primary/50" : ""}`}>
      {/* Header */}
      <button onClick={onToggle} className="w-full text-left p-5 relative z-10">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-3">
            <span className="text-3xl">{plan.emoji}</span>
            <div>
              <h3 className="font-bold text-sm">{plan.name}</h3>
              <p className="text-xs text-text-muted mt-1 leading-relaxed">{plan.description}</p>
              <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${levelInfo.color}`}>
                  {levelInfo.label}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] text-text-muted font-medium">
                  📅 {plan.duration}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] text-text-muted font-medium">
                  🔄 {plan.frequency}
                </span>
              </div>
            </div>
          </div>
          <span className={`text-text-muted text-xs transition-transform shrink-0 mt-1 ${isOpen ? "rotate-180" : ""}`}>▼</span>
        </div>
      </button>

      {/* Expanded Content */}
      {isOpen && (
        <div className="px-5 pb-5 space-y-4 animate-slide-up relative z-10">
          {/* Goal */}
          <div className="glass rounded-xl p-3">
            <p className="text-xs">
              <span className="font-bold text-primary">🎯 목표</span>{" "}
              {plan.goal}
            </p>
          </div>

          {/* Schedule */}
          {plan.schedule.map((day, di) => (
            <div key={di} className="glass rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs font-black text-primary">{day.day}</p>
                  <p className="text-[10px] text-text-muted mt-0.5">{day.focus}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-text-muted">⏱ {day.estimatedTime}</p>
                  <p className="text-[10px] text-text-muted">🔥 {day.caloriesBurn}</p>
                </div>
              </div>
              <div className="space-y-1.5">
                {day.exercises.map((ex, ei) => (
                  <div key={ei} className="flex items-center gap-2 text-xs">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[9px] font-bold flex items-center justify-center shrink-0">
                      {ei + 1}
                    </span>
                    <span className="flex-1">{ex.name}</span>
                    <span className="text-text-muted text-[10px] shrink-0">
                      {ex.sets}×{ex.reps}
                    </span>
                    <span className="text-text-muted text-[10px] shrink-0">
                      휴식 {ex.rest}
                    </span>
                    {ex.videoId && (
                      <a
                        href={`https://www.youtube.com/watch?v=${ex.videoId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-400 hover:text-red-300 shrink-0"
                        title="영상 보기"
                      >
                        🎬
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Action Button */}
          <div className="flex gap-2">
            {isActive ? (
              <>
                <Link href="/workout" className="flex-1 py-3 bg-primary hover:bg-primary-dark text-white rounded-2xl text-sm font-bold text-center shadow-lg shadow-primary/30 transition-all active:scale-[0.96]">
                  운동 시작하기 💪
                </Link>
                <button
                  onClick={onStop}
                  className="px-4 py-3 bg-white/10 hover:bg-white/15 text-text-muted rounded-2xl text-sm font-medium transition-all active:scale-[0.96]"
                >
                  중단
                </button>
              </>
            ) : (
              <button
                onClick={onStart}
                className="w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-2xl text-sm font-bold shadow-lg shadow-primary/30 transition-all active:scale-[0.96]"
              >
                이 프로그램 시작하기 🚀
              </button>
            )}
          </div>
        </div>
      )}

      {/* Active badge */}
      {isActive && (
        <div className="absolute top-3 right-3 px-2 py-1 bg-primary rounded-lg text-[10px] font-bold text-white animate-fade-in z-20">
          진행 중
        </div>
      )}
    </div>
  );
}
