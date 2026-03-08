"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { EXERCISES } from "@/lib/exercise-data";
import { MUSCLE_GROUPS } from "@/lib/types";
import type { MuscleGroup } from "@/lib/types";
import { FITNESS_VIDEOS } from "@/lib/video-data";

// YouTubeSection의 YOUTUBE_IDS 매핑 재사용
const YOUTUBE_IDS: Record<string, string> = {
  "벤치 프레스": "rT7DgCr-3pg",
  "인클라인 벤치 프레스": "SrqOu55lrYU",
  "덤벨 플라이": "eozdVDA78K0",
  "푸시업": "IODxDxX7oi4",
  "케이블 크로스오버": "taI4XduLpTk",
  "데드리프트": "op9kVnSso6Q",
  "풀업": "eGo4IYlbE5g",
  "바벨 로우": "FWJR5Ve8bnQ",
  "랫 풀다운": "CAwf7n6Luuc",
  "시티드 로우": "GZbfZ033f74",
  "오버헤드 프레스": "_RlRDWO2jfg",
  "레터럴 레이즈": "3VcKaXpzqRo",
  "프론트 레이즈": "gzDRaW-_Wrg",
  "페이스 풀": "rep-qVOkqgk",
  "아놀드 프레스": "6Z15_WdXmVw",
  "스쿼트": "ultWZbUMPL8",
  "레그 프레스": "IZxyjW7MPJQ",
  "루마니안 데드리프트": "jEy_czb3RKA",
  "레그 익스텐션": "YyvSfVjQeL0",
  "레그 컬": "1Tq3QdYUuHs",
  "런지": "QOVaHwm-Q6U",
  "카프 레이즈": "gwLzBJYoWlI",
  "바벨 컬": "kwG2ipFRgFo",
  "트라이셉 푸시다운": "2-LAMcpzODU",
  "해머 컬": "zC3nLlEvin4",
  "스컬 크러셔": "d_KZxkY_0cM",
  "딥스": "2z8JmcrW-As",
  "플랭크": "ASdvN_XEl_c",
  "크런치": "Xyd_fa5zoEU",
  "러시안 트위스트": "wkD8rjkodUI",
  "레그 레이즈": "JB2oyawG9KI",
  "ab 롤아웃": "rqiTPl9SstE",
};

type GymStep = "select" | "workout";

interface WorkoutExercise {
  exercise: typeof EXERCISES[0];
  videoId?: string;
  sets: number;
  currentSet: number;
  completed: boolean;
}

export default function GymModePage() {
  const [step, setStep] = useState<GymStep>("select");
  const [selectedGroup, setSelectedGroup] = useState<MuscleGroup | null>(null);
  const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [restTimer, setRestTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);

  // 화면 꺼짐 방지
  useEffect(() => {
    if (step === "workout") {
      const requestWake = async () => {
        try {
          if ("wakeLock" in navigator) {
            const lock = await navigator.wakeLock.request("screen");
            setWakeLock(lock);
          }
        } catch {}
      };
      requestWake();
      return () => { wakeLock?.release(); };
    }
  }, [step]);

  // 휴식 타이머
  useEffect(() => {
    if (!isResting || restTimer <= 0) return;
    const interval = setInterval(() => {
      setRestTimer(prev => {
        if (prev <= 1) {
          setIsResting(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isResting, restTimer]);

  const startWorkout = (group: MuscleGroup) => {
    const groupExercises = EXERCISES
      .filter(e => e.muscle_group === group)
      .slice(0, 6)
      .map(ex => ({
        exercise: ex,
        videoId: YOUTUBE_IDS[ex.name_ko],
        sets: parseInt(ex.recommended_sets) || 3,
        currentSet: 0,
        completed: false,
      }));
    setWorkoutExercises(groupExercises);
    setCurrentIdx(0);
    setStep("workout");
    setShowVideo(false);
  };

  const currentExercise = workoutExercises[currentIdx];

  const completeSet = () => {
    if (!currentExercise) return;
    const updated = [...workoutExercises];
    updated[currentIdx] = {
      ...updated[currentIdx],
      currentSet: updated[currentIdx].currentSet + 1,
    };
    if (updated[currentIdx].currentSet >= updated[currentIdx].sets) {
      updated[currentIdx].completed = true;
    }
    setWorkoutExercises(updated);

    // 세트 완료 후 휴식
    setRestTimer(currentExercise.exercise.rest_seconds);
    setIsResting(true);
  };

  const nextExercise = () => {
    setIsResting(false);
    setRestTimer(0);
    setShowVideo(false);
    if (currentIdx < workoutExercises.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const prevExercise = () => {
    setShowVideo(false);
    if (currentIdx > 0) setCurrentIdx(currentIdx - 1);
  };

  const skipRest = () => {
    setIsResting(false);
    setRestTimer(0);
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const completedCount = workoutExercises.filter(e => e.completed).length;

  // === 운동 선택 화면 ===
  if (step === "select") {
    return (
      <div className="space-y-6 animate-slide-up">
        <div className="relative overflow-hidden rounded-3xl p-6 glass-dark">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">📱</span>
              <div>
                <h1 className="text-2xl font-black">짐 모드</h1>
                <p className="text-white/50 text-xs mt-0.5">헬스장에서 따라하기</p>
              </div>
            </div>
            <p className="text-white/60 text-sm mt-3 leading-relaxed">
              폰을 앞에 놓고 영상을 보면서 운동하세요!<br/>
              <span className="text-primary-light font-semibold">화면이 자동으로 켜져있습니다.</span>
            </p>
          </div>
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-green-500/20 blur-3xl" />
        </div>

        {/* 기능 안내 */}
        <div className="glass rounded-2xl p-5 gradient-border">
          <h2 className="font-bold text-sm mb-3">💡 짐 모드 기능</h2>
          <div className="space-y-2.5">
            {[
              { icon: "🎬", text: "운동별 자세 영상을 바로 보면서 따라하기" },
              { icon: "⏱", text: "세트 간 자동 휴식 타이머" },
              { icon: "📋", text: "자세 가이드 & 주의사항 확인" },
              { icon: "🔒", text: "운동 중 화면 꺼짐 방지" },
              { icon: "📊", text: "세트/반복 진행률 한눈에 확인" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 text-xs text-text-muted">
                <span className="text-base">{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 부위 선택 */}
        <div>
          <h2 className="text-lg font-bold mb-4">운동할 부위를 선택하세요</h2>
          <div className="grid grid-cols-3 gap-3">
            {(Object.entries(MUSCLE_GROUPS) as [MuscleGroup, { label: string; emoji: string }][])
              .filter(([key]) => !["cardio", "pilates", "yoga"].includes(key))
              .map(([key, { label, emoji }]) => {
                const count = EXERCISES.filter(e => e.muscle_group === key).length;
                return (
                  <button
                    key={key}
                    onClick={() => startWorkout(key)}
                    className="glass gradient-border rounded-2xl p-4 text-center hover:bg-orange-50/60 active:scale-[0.95] transition-all group"
                  >
                    <div className="text-3xl mb-2 group-hover:animate-float">{emoji}</div>
                    <p className="font-bold text-sm">{label}</p>
                    <p className="text-[10px] text-text-muted mt-0.5">{count}개 운동</p>
                  </button>
                );
              })}
          </div>
        </div>

        {/* 아틀라스 연결 */}
        <Link href="/atlas">
          <div className="glass rounded-2xl p-4 flex items-center gap-3 bg-gradient-to-r from-orange-500/10 to-amber-500/10 hover:from-orange-500/20 hover:to-amber-500/20 transition-all group">
            <span className="text-2xl group-hover:animate-float">🧬</span>
            <div className="flex-1">
              <p className="font-bold text-sm">근육 아틀라스 보기</p>
              <p className="text-[10px] text-text-muted mt-0.5">어떤 근육을 운동할지 고민된다면?</p>
            </div>
            <span className="text-text-muted">→</span>
          </div>
        </Link>

        <div className="h-8" />
      </div>
    );
  }

  // === 운동 진행 화면 ===
  if (!currentExercise) return null;
  const ex = currentExercise.exercise;
  const videoId = currentExercise.videoId;
  const progress = completedCount / workoutExercises.length;

  return (
    <div className="min-h-screen -m-4 p-4 bg-gradient-to-b from-black/20 to-transparent">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setStep("select")} className="glass px-3 py-1.5 rounded-xl text-xs font-bold">
          ← 나가기
        </button>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-text-muted">{completedCount}/{workoutExercises.length} 완료</span>
          <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress * 100}%` }} />
          </div>
        </div>
      </div>

      {/* 휴식 타이머 오버레이 */}
      {isResting && (
        <div className="glass-dark rounded-3xl p-8 text-center mb-4 animate-fade-in">
          <p className="text-xs text-text-muted mb-2">휴식 중</p>
          <p className="text-6xl font-black text-primary mb-4 tabular-nums">{formatTime(restTimer)}</p>
          <p className="text-sm text-text-muted mb-6">
            다음: {currentExercise.completed ? (workoutExercises[currentIdx + 1]?.exercise.name_ko ?? "완료!") : `${currentExercise.currentSet + 1}/${currentExercise.sets} 세트`}
          </p>
          <div className="flex gap-3 justify-center">
            <button onClick={skipRest} className="px-6 py-2.5 bg-white/10 hover:bg-white/15 rounded-xl text-sm font-bold transition-all">
              건너뛰기
            </button>
            {currentExercise.completed && (
              <button onClick={nextExercise} className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-bold transition-all">
                다음 운동 →
              </button>
            )}
          </div>
        </div>
      )}

      {/* 영상 영역 */}
      <div className="glass rounded-2xl overflow-hidden mb-4">
        {videoId && !showVideo && (
          <button onClick={() => setShowVideo(true)} className="relative w-full aspect-video group">
            <img
              src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
              alt={ex.name_ko}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
            <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-1 rounded text-[10px] text-white">
              🎬 자세 영상 보기
            </div>
          </button>
        )}
        {videoId && showVideo && (
          <div className="relative w-full aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?rel=0`}
              title={ex.name_ko}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        )}
        {!videoId && (
          <div className="w-full aspect-video flex flex-col items-center justify-center gap-2 bg-white/5">
            <span className="text-4xl">{MUSCLE_GROUPS[ex.muscle_group as MuscleGroup]?.emoji ?? "💪"}</span>
            <p className="text-xs text-text-muted">영상 없음 — 아래 가이드를 참고하세요</p>
          </div>
        )}
      </div>

      {/* 운동 정보 */}
      <div className="glass rounded-2xl p-5 mb-4 gradient-border">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h2 className="text-xl font-black">{ex.name_ko}</h2>
            <p className="text-xs text-text-muted mt-0.5">
              {ex.primary_muscles.join(" · ")} · {ex.equipment === "none" ? "맨몸" : ex.equipment}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-primary">
              {currentExercise.currentSet}/{currentExercise.sets}
            </p>
            <p className="text-[10px] text-text-muted">세트</p>
          </div>
        </div>

        {/* 세트 진행 표시 */}
        <div className="flex gap-1.5 mb-4">
          {Array.from({ length: currentExercise.sets }).map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-2 rounded-full transition-all ${
                i < currentExercise.currentSet ? "bg-primary" : "bg-white/10"
              }`}
            />
          ))}
        </div>

        {/* 추천 정보 */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="glass rounded-xl p-2.5 text-center">
            <p className="text-xs font-black text-primary">{ex.recommended_reps}</p>
            <p className="text-[9px] text-text-muted">반복</p>
          </div>
          <div className="glass rounded-xl p-2.5 text-center">
            <p className="text-xs font-black text-primary">{ex.recommended_sets}</p>
            <p className="text-[9px] text-text-muted">세트</p>
          </div>
          <div className="glass rounded-xl p-2.5 text-center">
            <p className="text-xs font-black text-primary">{ex.rest_seconds}초</p>
            <p className="text-[9px] text-text-muted">휴식</p>
          </div>
        </div>

        {/* 세트 완료 버튼 */}
        {!currentExercise.completed ? (
          <button
            onClick={completeSet}
            disabled={isResting}
            className="w-full py-4 bg-primary hover:bg-primary-dark text-white rounded-2xl text-lg font-black shadow-lg shadow-primary/30 transition-all active:scale-[0.96] disabled:opacity-50"
          >
            {isResting ? "휴식 중..." : `세트 ${currentExercise.currentSet + 1} 완료 ✓`}
          </button>
        ) : (
          <button
            onClick={nextExercise}
            className="w-full py-4 bg-green-500 hover:bg-green-600 text-white rounded-2xl text-lg font-black shadow-lg shadow-green-500/30 transition-all active:scale-[0.96]"
          >
            {currentIdx < workoutExercises.length - 1 ? "다음 운동 →" : "운동 완료! 🎉"}
          </button>
        )}
      </div>

      {/* 자세 가이드 (접을 수 있음) */}
      <details className="glass rounded-2xl overflow-hidden mb-4">
        <summary className="p-4 font-bold text-sm cursor-pointer hover:bg-white/5">
          📋 자세 가이드 ({ex.how_to.length}단계)
        </summary>
        <div className="px-4 pb-4 space-y-2">
          {ex.how_to.map((step, i) => (
            <div key={i} className="flex items-start gap-2 text-xs">
              <span className="w-5 h-5 rounded-full bg-primary/15 text-primary text-[9px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span className="text-text-muted leading-relaxed">{step}</span>
            </div>
          ))}
        </div>
      </details>

      {/* 팁 & 주의사항 */}
      <details className="glass rounded-2xl overflow-hidden mb-4">
        <summary className="p-4 font-bold text-sm cursor-pointer hover:bg-white/5">
          💡 팁 & 흔한 실수
        </summary>
        <div className="px-4 pb-4 space-y-3">
          {ex.tips.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-green-400 mb-1.5">✅ 팁</p>
              {ex.tips.map((t, i) => (
                <p key={i} className="text-[11px] text-text-muted leading-relaxed mb-1">· {t}</p>
              ))}
            </div>
          )}
          {ex.common_mistakes.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-red-400 mb-1.5">⚠️ 주의</p>
              {ex.common_mistakes.map((m, i) => (
                <p key={i} className="text-[11px] text-text-muted leading-relaxed mb-1">· {m}</p>
              ))}
            </div>
          )}
        </div>
      </details>

      {/* 운동 리스트 (하단) */}
      <div className="glass rounded-2xl p-4 mb-4">
        <p className="font-bold text-xs mb-3">운동 목록</p>
        <div className="space-y-1.5">
          {workoutExercises.map((we, i) => (
            <button
              key={i}
              onClick={() => { setCurrentIdx(i); setShowVideo(false); setIsResting(false); }}
              className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl text-left transition-all ${
                i === currentIdx ? "bg-primary/15 border border-primary/30" : "hover:bg-white/5"
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                we.completed ? "bg-green-500 text-white" : i === currentIdx ? "bg-primary text-white" : "bg-white/10 text-text-muted"
              }`}>
                {we.completed ? "✓" : i + 1}
              </div>
              <span className={`text-xs flex-1 ${we.completed ? "line-through text-text-muted" : i === currentIdx ? "font-bold" : ""}`}>
                {we.exercise.name_ko}
              </span>
              <span className="text-[10px] text-text-muted">
                {we.currentSet}/{we.sets}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Nav buttons */}
      <div className="flex gap-3 mb-8">
        <button
          onClick={prevExercise}
          disabled={currentIdx === 0}
          className="flex-1 py-3 glass rounded-xl text-sm font-bold disabled:opacity-30 transition-all active:scale-[0.96]"
        >
          ← 이전
        </button>
        <button
          onClick={nextExercise}
          disabled={currentIdx >= workoutExercises.length - 1}
          className="flex-1 py-3 glass rounded-xl text-sm font-bold disabled:opacity-30 transition-all active:scale-[0.96]"
        >
          다음 →
        </button>
      </div>
    </div>
  );
}
