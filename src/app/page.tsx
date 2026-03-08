"use client";

import { useEffect, useState } from "react";
import { StatCard } from "./components/Card";
import Link from "next/link";
import { EXERCISES } from "@/lib/exercise-data";
import { MUSCLE_GROUPS, DIFFICULTY_LABELS } from "@/lib/types";
import type { MuscleGroup, Difficulty } from "@/lib/types";
import { FITNESS_VIDEOS, VIDEO_CATEGORIES, AI_WORKOUT_PLANS } from "@/lib/video-data";

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
  {
    name: "Push / Pull / Legs",
    desc: "밀기·당기기·하체 3분할, 주 3~6일",
    level: "중급",
    color: "from-orange-100 to-amber-50",
    emoji: "🔥",
    who: "중급 이상, 근비대 목표, 주 4~6일 가능한 분",
    schedule: "Push → Pull → Legs → 반복 (주 3~6일)",
    days: [
      { day: "Push (밀기)", muscles: "가슴 · 어깨 · 삼두", exercises: ["벤치프레스 4×8", "인클라인 DB프레스 3×10", "숄더프레스 3×10", "사이드 레터럴 레이즈 3×15", "케이블 플라이 3×12", "트라이셉 푸시다운 3×12"] },
      { day: "Pull (당기기)", muscles: "등 · 이두 · 후면삼각", exercises: ["데드리프트 4×6", "풀업/랫풀다운 4×8", "바벨 로우 3×10", "페이스풀 3×15", "해머 컬 3×12", "시티드 케이블 로우 3×10"] },
      { day: "Legs (하체)", muscles: "대퇴사두 · 둔근 · 햄스트링 · 종아리", exercises: ["스쿼트 4×8", "레그프레스 3×12", "루마니안 데드리프트 3×10", "레그 익스텐션 3×12", "레그 컬 3×12", "카프 레이즈 4×15"] },
    ],
    pros: ["부위별 충분한 볼륨", "회복 시간 확보", "가장 인기 있는 분할법"],
    cons: ["주 3일 미만이면 빈도 부족", "세션당 시간이 길 수 있음"],
  },
  {
    name: "Upper / Lower",
    desc: "상체·하체 2분할, 주 4일",
    level: "초급~중급",
    color: "from-emerald-100 to-green-50",
    emoji: "⚡",
    who: "초급~중급, 주 4일 운동 가능한 분, 근력+근비대 균형",
    schedule: "Upper → Lower → 휴식 → Upper → Lower → 휴식 (주 4일)",
    days: [
      { day: "Upper A (상체)", muscles: "가슴 · 등 · 어깨 · 팔", exercises: ["벤치프레스 4×8", "바벨 로우 4×8", "숄더프레스 3×10", "랫풀다운 3×10", "바이셉 컬 2×12", "트라이셉 푸시다운 2×12"] },
      { day: "Lower A (하체)", muscles: "대퇴사두 · 둔근 · 햄스트링", exercises: ["스쿼트 4×8", "루마니안 데드리프트 3×10", "레그프레스 3×12", "레그 컬 3×12", "카프 레이즈 3×15", "플랭크 3×45초"] },
      { day: "Upper B (상체)", muscles: "가슴 · 등 · 어깨 · 팔", exercises: ["인클라인 DB프레스 3×10", "시티드 케이블 로우 3×10", "사이드 레터럴 3×15", "페이스풀 3×15", "해머 컬 2×12", "오버헤드 익스텐션 2×12"] },
      { day: "Lower B (하체)", muscles: "대퇴사두 · 둔근 · 햄스트링", exercises: ["데드리프트 4×6", "불가리안 스플릿 3×10", "레그 익스텐션 3×12", "힙 스러스트 3×10", "카프 레이즈 3×15", "행잉 레그레이즈 3×12"] },
    ],
    pros: ["주 2회 빈도로 근성장 최적", "상·하체 밸런스 좋음", "시간 효율적"],
    cons: ["세션당 운동 수가 많음", "한 부위 볼륨이 PPL보다 적을 수 있음"],
  },
  {
    name: "Full Body",
    desc: "전신 운동, 주 3일",
    level: "초급",
    color: "from-amber-100 to-yellow-50",
    emoji: "💪",
    who: "입문자, 시간이 부족한 직장인, 주 3일만 가능한 분",
    schedule: "월 · 수 · 금 (격일, 주 3일)",
    days: [
      { day: "Day A", muscles: "전신", exercises: ["스쿼트 3×8", "벤치프레스 3×8", "바벨 로우 3×8", "숄더프레스 2×10", "바이셉 컬 2×12", "플랭크 3×30초"] },
      { day: "Day B", muscles: "전신", exercises: ["데드리프트 3×6", "인클라인 DB프레스 3×10", "풀업/랫풀다운 3×8", "런지 3×10(양쪽)", "페이스풀 2×15", "행잉 레그레이즈 2×10"] },
      { day: "Day C", muscles: "전신", exercises: ["프론트 스쿼트 3×8", "딥스 3×8", "시티드 로우 3×10", "사이드 레터럴 2×15", "해머 컬 2×12", "ab 롤아웃 3×10"] },
    ],
    pros: ["최소 투자로 최대 효과", "높은 빈도(주 3회 자극)", "초보자에게 최적"],
    cons: ["한 부위 볼륨이 제한적", "세션이 길어질 수 있음", "고급자에게는 부족"],
  },
  {
    name: "Bro Split",
    desc: "부위별 1일 1부위, 주 5일",
    level: "중급~고급",
    color: "from-rose-100 to-pink-50",
    emoji: "🏆",
    who: "중급~고급, 한 부위를 깊게 파고싶은 분, 주 5일 가능",
    schedule: "가슴 → 등 → 어깨 → 팔 → 하체 (주 5일)",
    days: [
      { day: "가슴", muscles: "대흉근 상·중·하", exercises: ["벤치프레스 4×8", "인클라인 DB프레스 3×10", "케이블 크로스오버 3×12", "펙덱 플라이 3×12", "딥스(가슴) 3×10"] },
      { day: "등", muscles: "광배근 · 능형근 · 승모근", exercises: ["데드리프트 4×6", "풀업 4×8", "바벨 로우 3×10", "시티드 케이블 로우 3×10", "스트레이트 암 풀다운 3×12"] },
      { day: "어깨", muscles: "전면·측면·후면 삼각근", exercises: ["밀리터리 프레스 4×8", "사이드 레터럴 레이즈 4×15", "페이스풀 3×15", "리어 델트 플라이 3×15", "프론트 레이즈 3×12"] },
      { day: "팔", muscles: "이두근 · 삼두근 · 전완근", exercises: ["바벨 컬 3×10", "해머 컬 3×12", "인클라인 DB컬 3×10", "클로즈그립 벤치 3×10", "트라이셉 푸시다운 3×12", "오버헤드 익스텐션 3×12"] },
      { day: "하체", muscles: "대퇴사두 · 둔근 · 햄스트링", exercises: ["스쿼트 4×8", "레그프레스 3×12", "루마니안 데드리프트 3×10", "레그 익스텐션 3×12", "레그 컬 3×12", "카프 레이즈 4×15"] },
    ],
    pros: ["한 부위에 집중 가능", "볼륨 최대", "펌핑감 극대화"],
    cons: ["주 1회 빈도(연구상 주 2회가 이상적)", "시간 투자 많음"],
  },
];

export default function HomePage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [tipIdx, setTipIdx] = useState(0);
  const [featuredExercises, setFeaturedExercises] = useState<typeof EXERCISES>([]);
  const [openSplit, setOpenSplit] = useState<number | null>(null);

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
      <div className="relative overflow-hidden rounded-3xl p-6 pb-7 glass-dark">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            {stats && stats.streak > 0 && (
              <div className="streak-fire animate-scale-in">
                🔥 {stats.streak}일 연속
              </div>
            )}
          </div>
          <h1 className="text-[42px] font-black tracking-tight leading-none">
            <span className="text-white">Fit</span><span className="text-primary-light">Flow</span>
          </h1>
          <p className="text-white/60 mt-2.5 text-sm leading-relaxed">
            스마트 운동 가이드 & 트래커<br/>
            <span className="text-white/40">36개 운동 · 상세 자세 가이드 · 영상 튜토리얼</span>
          </p>
          <div className="flex gap-3 mt-6">
            <Link href="/workout" className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-2xl text-sm font-bold active:scale-[0.96] shadow-lg shadow-primary/30 transition-all">
              운동 시작하기
            </Link>
            <Link href="/exercises" className="px-6 py-3 bg-white/10 hover:bg-white/15 text-white/90 rounded-2xl text-sm font-semibold active:scale-[0.96] backdrop-blur-sm border border-white/10">
              운동 배우기
            </Link>
          </div>
        </div>
        <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-accent/15 blur-3xl" />
        <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-primary-light/10 blur-2xl" />
      </div>

      {/* Quick Access */}
      <div className="grid grid-cols-4 gap-2.5">
        {[
          { href: "/videos", emoji: "🎬", label: "운동 영상" },
          { href: "/plans", emoji: "🤖", label: "AI 플랜" },
          { href: "/atlas", emoji: "🧬", label: "근육 아틀라스" },
          { href: "/gym-mode", emoji: "📱", label: "짐 모드" },
          { href: "/nearby", emoji: "📍", label: "주변 헬스장" },
          { href: "/equipment", emoji: "🏋️", label: "기구 가이드" },
          { href: "/community", emoji: "🏘️", label: "동네" },
          { href: "/music", emoji: "🎵", label: "운동 음악" },
          { href: "/health", emoji: "❤️", label: "건강 관리" },
          { href: "/diet", emoji: "🍱", label: "식단" },
          { href: "/scanner", emoji: "📸", label: "AI 스캔" },
          { href: "/calendar", emoji: "📅", label: "캘린더" },
        ].map(item => (
          <Link key={item.href} href={item.href}>
            <div className="glass rounded-2xl p-3 text-center card-hover active:scale-[0.95] group">
              <div className="text-2xl mb-1.5 group-hover:animate-float">{item.emoji}</div>
              <p className="text-[10px] font-bold text-text-secondary">{item.label}</p>
            </div>
          </Link>
        ))}
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
                <div className="glass gradient-border rounded-2xl p-4 hover:bg-orange-50/60 active:scale-[0.97] h-full group">
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
      <div className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-amber-50 to-orange-50 glass gradient-border">
        <div className="flex items-start gap-3 relative z-10">
          <span className="text-3xl">{BEGINNER_TIPS[tipIdx].icon}</span>
          <div className="flex-1">
            <p className="text-xs text-primary font-semibold mb-1">오늘의 운동 팁</p>
            <h3 className="font-bold">{BEGINNER_TIPS[tipIdx].title}</h3>
            <p className="text-sm text-text-muted mt-1.5 leading-relaxed">{BEGINNER_TIPS[tipIdx].desc}</p>
          </div>
        </div>
        <button
          onClick={() => setTipIdx((tipIdx + 1) % BEGINNER_TIPS.length)}
          className="mt-4 text-xs text-primary font-semibold hover:text-primary-dark relative z-10"
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
            <div key={i} className="glass rounded-xl p-4 flex items-start gap-3 hover:bg-orange-50/60 active:scale-[0.99]">
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
          {SPLIT_PROGRAMS.map((prog, i) => {
            const isOpen = openSplit === i;
            return (
              <div key={i} className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${prog.color} glass gradient-border transition-all`}>
                <button onClick={() => setOpenSplit(isOpen ? null : i)} className="w-full text-left p-5 relative z-10">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-2.5">
                      <span className="text-2xl">{prog.emoji}</span>
                      <div>
                        <h3 className="font-bold text-sm">{prog.name}</h3>
                        <p className="text-xs text-text-muted mt-0.5">{prog.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/10 text-primary">{prog.level}</span>
                      <span className={`text-text-muted text-xs transition-transform ${isOpen ? "rotate-180" : ""}`}>▼</span>
                    </div>
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 space-y-4 animate-slide-up relative z-10">
                    {/* Who & Schedule */}
                    <div className="glass rounded-xl p-3 space-y-1.5">
                      <p className="text-xs"><span className="font-bold text-primary">👤 추천 대상</span> {prog.who}</p>
                      <p className="text-xs"><span className="font-bold text-primary">📅 스케줄</span> {prog.schedule}</p>
                    </div>

                    {/* Day-by-day breakdown */}
                    {prog.days.map((d, di) => (
                      <div key={di} className="glass rounded-xl p-3">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-black text-primary">{d.day}</p>
                          <p className="text-[10px] text-text-muted">{d.muscles}</p>
                        </div>
                        <div className="space-y-1">
                          {d.exercises.map((ex, ei) => (
                            <div key={ei} className="flex items-center gap-2 text-xs">
                              <span className="w-4 h-4 rounded-full bg-primary/10 text-primary text-[9px] font-bold flex items-center justify-center shrink-0">{ei + 1}</span>
                              <span>{ex}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                    {/* Pros & Cons */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="glass rounded-xl p-3">
                        <p className="text-[10px] font-bold text-emerald-600 mb-1.5">✅ 장점</p>
                        {prog.pros.map((p, pi) => (
                          <p key={pi} className="text-[10px] text-text-muted leading-relaxed">· {p}</p>
                        ))}
                      </div>
                      <div className="glass rounded-xl p-3">
                        <p className="text-[10px] font-bold text-red-500 mb-1.5">⚠️ 단점</p>
                        {prog.cons.map((c, ci) => (
                          <p key={ci} className="text-[10px] text-text-muted leading-relaxed">· {c}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 🎬 인기 운동 영상 */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">🎬 인기 운동 영상</h2>
          <Link href="/videos" className="text-xs text-primary font-medium">전체 보기 →</Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
          {FITNESS_VIDEOS.slice(0, 6).map((video) => {
            const catInfo = VIDEO_CATEGORIES[video.category];
            return (
              <Link key={video.id} href="/videos" className="shrink-0 w-[200px] group">
                <div className="glass gradient-border rounded-2xl overflow-hidden hover:bg-orange-50/60 active:scale-[0.97]">
                  <div className="relative aspect-video">
                    <img
                      src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-10 h-10 rounded-full bg-red-600/90 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                    <div className={`absolute top-1.5 left-1.5 bg-gradient-to-r ${catInfo.color} backdrop-blur-sm px-1.5 py-0.5 rounded-md`}>
                      <span className="text-[8px] font-bold text-white">{catInfo.emoji} {catInfo.label}</span>
                    </div>
                    {video.duration && (
                      <div className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 rounded text-[8px] text-white font-mono">
                        {video.duration}
                      </div>
                    )}
                  </div>
                  <div className="p-2.5">
                    <p className="text-[11px] font-bold leading-snug line-clamp-2">{video.title}</p>
                    <p className="text-[9px] text-text-muted mt-1">{video.channel}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 🤖 AI 운동 플랜 */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">🤖 AI 운동 플랜</h2>
          <Link href="/plans" className="text-xs text-primary font-medium">전체 보기 →</Link>
        </div>
        <div className="stagger space-y-3">
          {AI_WORKOUT_PLANS.slice(0, 2).map((plan) => (
            <Link key={plan.id} href="/plans">
              <div className={`relative overflow-hidden rounded-2xl p-4 bg-gradient-to-r ${plan.color} glass gradient-border hover:scale-[0.99] active:scale-[0.97] transition-all group`}>
                <div className="flex items-start gap-3 relative z-10">
                  <span className="text-3xl group-hover:animate-float">{plan.emoji}</span>
                  <div className="flex-1">
                    <h3 className="font-bold text-sm">{plan.name}</h3>
                    <p className="text-[11px] text-text-muted mt-1 line-clamp-1">{plan.description}</p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="px-2 py-0.5 rounded-full bg-white/10 text-[9px] font-bold text-primary">
                        {plan.level === "beginner" ? "초급" : plan.level === "intermediate" ? "중급" : "고급"}
                      </span>
                      <span className="text-[9px] text-text-muted">📅 {plan.duration}</span>
                      <span className="text-[9px] text-text-muted">🔄 {plan.frequency}</span>
                    </div>
                  </div>
                  <span className="text-text-muted text-sm mt-1">→</span>
                </div>
              </div>
            </Link>
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
                <div className="glass gradient-border rounded-2xl p-3 text-center hover:bg-orange-50/60 active:scale-[0.95] group">
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
