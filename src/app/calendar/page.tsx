"use client";

import { useEffect, useState } from "react";
import { Card } from "../components/Card";

interface WorkoutDay {
  id: number;
  started_at: string;
  routine_name?: string;
  total_volume: number;
  total_sets: number;
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [workouts, setWorkouts] = useState<WorkoutDay[]>([]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthStr = `${year}-${String(month + 1).padStart(2, "0")}`;

  useEffect(() => {
    fetch(`/api/workouts?month=${monthStr}`).then((r) => r.json()).then(setWorkouts).catch(() => {});
  }, [monthStr]);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const workoutDates = new Set(
    workouts.map((w) => new Date(w.started_at).getDate())
  );

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  const monthNames = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">운동 캘린더</h1>

      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <button onClick={prevMonth} className="text-text-muted hover:text-text px-3 py-1">←</button>
        <span className="font-bold text-lg">{year}년 {monthNames[month]}</span>
        <button onClick={nextMonth} className="text-text-muted hover:text-text px-3 py-1">→</button>
      </div>

      {/* Calendar Grid */}
      <Card>
        <div className="grid grid-cols-7 gap-1">
          {dayNames.map((d) => (
            <div key={d} className="text-center text-xs text-text-muted py-2 font-medium">{d}</div>
          ))}
          {days.map((day, i) => (
            <div
              key={i}
              className={`aspect-square flex flex-col items-center justify-center rounded-xl text-sm relative ${
                day === null ? "" :
                isCurrentMonth && day === today.getDate() ? "bg-primary text-white font-bold" :
                workoutDates.has(day) ? "bg-success/20 text-success font-semibold" : "text-text-muted hover:bg-bg-card-hover"
              }`}
            >
              {day}
              {day && workoutDates.has(day) && !(isCurrentMonth && day === today.getDate()) && (
                <div className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-success"></div>
              )}
              {day && isCurrentMonth && day === today.getDate() && workoutDates.has(day) && (
                <div className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-white"></div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Workout Summary */}
      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">
          {monthNames[month]} 운동 기록 ({workouts.length}회)
        </h2>
        {workouts.length === 0 ? (
          <div className="text-center py-8 text-text-muted">
            <p className="text-4xl mb-3">📅</p>
            <p>이 달에 운동 기록이 없습니다</p>
          </div>
        ) : (
          workouts.map((w) => (
            <Card key={w.id} className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-sm">
                  {new Date(w.started_at).toLocaleDateString("ko-KR", { month: "short", day: "numeric", weekday: "short" })}
                </div>
                <div className="text-xs text-text-muted">{w.routine_name || "자유 운동"}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold">{w.total_volume.toLocaleString()} kg</div>
                <div className="text-xs text-text-muted">{w.total_sets} 세트</div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
