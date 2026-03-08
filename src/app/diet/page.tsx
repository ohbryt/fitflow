"use client";

import { useState } from "react";
import Link from "next/link";
import { MEAL_PLANS, getWeekLabel, getDaysUntilNextRotation, getActiveWeekIndex } from "@/lib/meal-data";
import type { MealPlan, DayMeals, Meal } from "@/lib/meal-data";

const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const DAY_SHORT = ["월", "화", "수", "목", "금", "토", "일"];

function MealCard({ meal, label, color }: { meal: Meal; label: string; color: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="glass rounded-xl p-3 hover:bg-orange-50/60 active:scale-[0.99]" onClick={() => setOpen(!open)}>
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <p className={`text-[10px] font-bold ${color}`}>{label}</p>
          <p className="font-semibold text-sm mt-0.5 truncate">{meal.name}</p>
          <p className="text-[11px] text-text-muted mt-0.5">{meal.desc}</p>
        </div>
        <div className="text-right shrink-0 ml-2">
          <p className="text-sm font-bold">{meal.calories}</p>
          <p className="text-[10px] text-text-muted">kcal</p>
        </div>
      </div>
      {open && (
        <div className="mt-3 pt-3 border-t border-border/50 space-y-2 animate-slide-up">
          <div className="flex gap-3 text-[10px]">
            <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-600">단백질 {meal.protein}g</span>
            <span className="px-2 py-1 rounded bg-amber-500/10 text-amber-600">탄수화물 {meal.carbs}g</span>
            <span className="px-2 py-1 rounded bg-rose-500/10 text-rose-600">지방 {meal.fat}g</span>
          </div>
          <div>
            <p className="text-[10px] text-text-muted mb-1">재료</p>
            <div className="flex flex-wrap gap-1">
              {meal.ingredients.map((ing, i) => (
                <span key={i} className="px-2 py-0.5 bg-orange-50/80 rounded text-[10px] text-text-muted">{ing}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DayView({ day }: { day: DayMeals }) {
  const meals: [string, Meal, string][] = [
    ["🌅 아침", day.breakfast, "text-amber-600"],
    ["🍎 오전 간식", day.snack1, "text-green-600"],
    ["☀️ 점심", day.lunch, "text-blue-600"],
    ["🥜 오후 간식", day.snack2, "text-violet-400"],
    ["🌙 저녁", day.dinner, "text-indigo-400"],
  ];

  return (
    <div className="space-y-2">
      {/* Day total */}
      <div className="glass gradient-border rounded-xl p-3 flex justify-between items-center">
        <div className="flex gap-3 text-[10px] font-semibold">
          <span className="text-text">{day.totalCalories} kcal</span>
          <span className="text-blue-600">P {day.totalProtein}g</span>
          <span className="text-amber-600">C {day.totalCarbs}g</span>
          <span className="text-rose-600">F {day.totalFat}g</span>
        </div>
        {/* Macro bar */}
        <div className="w-20 h-2 rounded-full overflow-hidden bg-orange-50/80 flex">
          <div className="bg-blue-400 h-full" style={{ width: `${(day.totalProtein * 4 / (day.totalCalories || 1)) * 100}%` }} />
          <div className="bg-amber-400 h-full" style={{ width: `${(day.totalCarbs * 4 / (day.totalCalories || 1)) * 100}%` }} />
          <div className="bg-rose-400 h-full" style={{ width: `${(day.totalFat * 9 / (day.totalCalories || 1)) * 100}%` }} />
        </div>
      </div>
      {meals.map(([label, meal, color], i) => (
        <MealCard key={i} meal={meal} label={label} color={color} />
      ))}
    </div>
  );
}

export default function DietPage() {
  const [planIdx, setPlanIdx] = useState(0);
  const [dayIdx, setDayIdx] = useState(0);
  const plan = MEAL_PLANS[planIdx];
  const day = plan.days[dayIdx];

  return (
    <div className="space-y-5 animate-slide-up">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <Link href="/" className="w-9 h-9 glass rounded-xl flex items-center justify-center hover:bg-orange-50 shrink-0">
            <span className="text-lg">←</span>
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black">식단 가이드</h1>
            <p className="text-xs sm:text-sm text-text-muted mt-0.5">목표에 맞는 1주일 식단</p>
          </div>
        </div>
        <Link href="/scanner" className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold active:scale-[0.97] shadow-lg shadow-primary/25 flex items-center gap-1.5">
          📷 AI 스캔
        </Link>
      </div>

      {/* Week Rotation Badge */}
      <div className="glass gradient-border rounded-2xl p-3 flex items-center justify-between bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="flex items-center gap-2">
          <span className="text-lg">🔄</span>
          <div>
            <p className="text-xs font-bold text-orange-700">현재 {getWeekLabel()} 식단</p>
            <p className="text-[10px] text-text-muted">매주 월요일 자동 변경 · 4주 로테이션</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-primary">{getDaysUntilNextRotation()}일 후</p>
          <p className="text-[10px] text-text-muted">다음 식단</p>
        </div>
      </div>

      {/* Plan Selector */}
      <div className="grid grid-cols-2 gap-2.5">
        {MEAL_PLANS.map((p, i) => (
          <button
            key={p.id}
            onClick={() => { setPlanIdx(i); setDayIdx(0); }}
            className={`relative overflow-hidden rounded-2xl p-3.5 transition-all active:scale-[0.97] ${
              planIdx === i
                ? `bg-gradient-to-br ${p.color} glass gradient-border shadow-lg`
                : "glass opacity-60"
            }`}
          >
            <div className="text-2xl mb-1">{p.icon}</div>
            <p className="font-bold text-sm">{p.name}</p>
            <p className="text-[10px] text-text-muted mt-0.5">{p.targetCalories}</p>
          </button>
        ))}
      </div>

      {/* Plan Info */}
      <div className={`relative overflow-hidden glass gradient-border rounded-2xl p-4 bg-gradient-to-br ${plan.color}`}>
        <div className="flex justify-between items-start relative z-10">
          <div>
            <p className="text-xs text-text-muted font-semibold">목표 칼로리</p>
            <p className="font-black text-lg mt-0.5">{plan.targetCalories}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-text-muted font-semibold">단백질 목표</p>
            <p className="font-bold text-sm mt-0.5">{plan.targetProtein}</p>
          </div>
        </div>
        <div className="mt-2 relative z-10">
          <p className="text-[10px] text-text-muted">탄단지 비율</p>
          <p className="text-sm font-bold">{plan.ratio}</p>
        </div>
        <div className="absolute -top-4 -right-4 w-16 h-16 bg-orange-50/80 rounded-full blur-xl" />
      </div>

      {/* Tips */}
      <div className="glass rounded-2xl p-4">
        <h3 className="font-bold text-sm mb-2">💡 식단 팁</h3>
        <div className="space-y-1.5">
          {plan.tips.slice(0, 3).map((tip, i) => (
            <p key={i} className="text-[11px] text-text-muted flex gap-2">
              <span className="text-primary shrink-0">•</span>{tip}
            </p>
          ))}
        </div>
      </div>

      {/* Day Selector */}
      <div className="flex gap-1.5">
        {DAYS.map((d, i) => (
          <button
            key={d}
            onClick={() => setDayIdx(i)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              dayIdx === i
                ? "bg-primary text-white shadow-lg shadow-primary/25"
                : "glass text-text-muted hover:text-text"
            }`}
          >
            {DAY_SHORT[i]}
          </button>
        ))}
      </div>

      {/* Day Label */}
      <h2 className="font-bold text-lg">{day.dayLabel}</h2>

      {/* Day Meals */}
      <DayView day={day} />

      {/* Bottom spacing */}
      <div className="h-8" />
    </div>
  );
}
