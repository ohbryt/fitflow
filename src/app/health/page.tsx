"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BMI_CATEGORIES, getBmiCategory,
  GENETIC_CATEGORIES, GENETIC_TRAITS,
  ORAL_BACTERIA, ORAL_HEALTH_TIPS,
} from "@/lib/health-data";
import type { GeneticTrait } from "@/lib/health-data";
import { checkHealthConnect, requestHealthPermissions, fetchHealthData, type HealthData } from "@/lib/health-connect";

// localStorage helpers
function getHealth(key: string, fallback: unknown) {
  if (typeof window === "undefined") return fallback;
  try { return JSON.parse(localStorage.getItem(`fitflow:health:${key}`) || "null") ?? fallback; } catch { return fallback; }
}
function setHealth(key: string, value: unknown) {
  if (typeof window !== "undefined") localStorage.setItem(`fitflow:health:${key}`, JSON.stringify(value));
}

type Tab = "sync" | "body" | "glucose" | "gene" | "oral" | "coach";

// === Glucose types ===
interface GlucoseEntry {
  id: number;
  value: number; // mg/dL
  time: string;  // ISO string
  tag: "fasting" | "before_meal" | "after_meal" | "bedtime" | "other";
  note?: string;
}

interface NightscoutEntry {
  sgv: number;    // mg/dL
  dateString: string;
  direction?: string;
}

const GLUCOSE_TAGS: Record<string, string> = {
  fasting: "공복",
  before_meal: "식전",
  after_meal: "식후",
  bedtime: "취침전",
  other: "기타",
};

const GLUCOSE_RANGES = {
  low: { max: 70, label: "저혈당", color: "text-blue-600", bg: "bg-blue-100" },
  normal: { max: 100, label: "정상", color: "text-emerald-600", bg: "bg-emerald-100" },
  prediabetic: { max: 126, label: "주의", color: "text-amber-600", bg: "bg-amber-100" },
  high: { max: 999, label: "고혈당", color: "text-red-600", bg: "bg-red-100" },
};

function getGlucoseRange(val: number) {
  if (val < 70) return GLUCOSE_RANGES.low;
  if (val < 100) return GLUCOSE_RANGES.normal;
  if (val < 126) return GLUCOSE_RANGES.prediabetic;
  return GLUCOSE_RANGES.high;
}

function getGlucoseLogs(): GlucoseEntry[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem("fitflow:glucose_logs") || "[]"); } catch { return []; }
}
function saveGlucoseLogs(logs: GlucoseEntry[]) {
  if (typeof window !== "undefined") localStorage.setItem("fitflow:glucose_logs", JSON.stringify(logs.slice(0, 500)));
}

// Simple SVG sparkline chart
function GlucoseChart({ entries }: { entries: { value: number; time: string }[] }) {
  if (entries.length < 2) return null;
  const last = entries.slice(-30); // last 30 readings
  const vals = last.map(e => e.value);
  const min = Math.min(...vals, 60);
  const max = Math.max(...vals, 180);
  const range = max - min || 1;
  const w = 300, h = 100, pad = 10;
  const points = last.map((e, i) => {
    const x = pad + (i / (last.length - 1)) * (w - pad * 2);
    const y = h - pad - ((e.value - min) / range) * (h - pad * 2);
    return `${x},${y}`;
  }).join(" ");

  // Zone backgrounds
  const normalY1 = h - pad - ((100 - min) / range) * (h - pad * 2);
  const normalY2 = h - pad - ((70 - min) / range) * (h - pad * 2);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-28">
      {/* Normal zone */}
      <rect x={pad} y={Math.max(normalY1, pad)} width={w - pad * 2} height={Math.min(normalY2 - normalY1, h - pad * 2)} fill="#10b98120" rx="4" />
      {/* Line */}
      <polyline points={points} fill="none" stroke="#e67e22" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Dots */}
      {last.map((e, i) => {
        const x = pad + (i / (last.length - 1)) * (w - pad * 2);
        const y = h - pad - ((e.value - min) / range) * (h - pad * 2);
        const rng = getGlucoseRange(e.value);
        const fill = e.value < 70 ? "#3b82f6" : e.value < 100 ? "#10b981" : e.value < 126 ? "#f59e0b" : "#ef4444";
        return <circle key={i} cx={x} cy={y} r="3" fill={fill} />;
      })}
      {/* Labels */}
      <text x={pad} y={h - 2} fontSize="8" fill="#999">{last[0].time.slice(5, 10)}</text>
      <text x={w - pad} y={h - 2} fontSize="8" fill="#999" textAnchor="end">{last[last.length - 1].time.slice(5, 10)}</text>
      <text x={2} y={normalY1 + 3} fontSize="7" fill="#10b981">100</text>
      <text x={2} y={normalY2 + 3} fontSize="7" fill="#3b82f6">70</text>
    </svg>
  );
}

export default function HealthPage() {
  const [tab, setTab] = useState<Tab>("body");

  // Body Composition
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(70);
  const [age, setAge] = useState(25);
  const [gender, setGender] = useState<"male" | "female">("male");
  const [bodyFat, setBodyFat] = useState(18);
  const [bmi, setBmi] = useState(0);

  // Genetic
  const [geneResults, setGeneResults] = useState<Record<string, number>>({});
  const [selectedGene, setSelectedGene] = useState<GeneticTrait | null>(null);

  // Oral
  const [oralScores, setOralScores] = useState<Record<string, number>>({});

  // AI Coach
  const [coachQuery, setCoachQuery] = useState("");
  const [coachResponse, setCoachResponse] = useState("");
  const [coachLoading, setCoachLoading] = useState(false);

  // Glucose
  const [glucoseLogs, setGlucoseLogs] = useState<GlucoseEntry[]>([]);
  const [glucoseVal, setGlucoseVal] = useState(100);
  const [glucoseTag, setGlucoseTag] = useState<GlucoseEntry["tag"]>("other");
  const [glucoseNote, setGlucoseNote] = useState("");
  // Health Connect
  const [hcStatus, setHcStatus] = useState<string>("checking");
  const [hcData, setHcData] = useState<HealthData | null>(null);
  const [hcLoading, setHcLoading] = useState(false);

  // Nightscout
  const [nsUrl, setNsUrl] = useState("");
  const [nsData, setNsData] = useState<NightscoutEntry[]>([]);
  const [nsLoading, setNsLoading] = useState(false);
  const [nsError, setNsError] = useState("");
  const [nsConnected, setNsConnected] = useState(false);

  useEffect(() => {
    setHeight(getHealth("height", 170) as number);
    setWeight(getHealth("weight", 70) as number);
    setAge(getHealth("age", 25) as number);
    setGender(getHealth("gender", "male") as "male" | "female");
    setBodyFat(getHealth("bodyFat", 18) as number);
    setGeneResults(getHealth("geneResults", {}) as Record<string, number>);
    setOralScores(getHealth("oralScores", {}) as Record<string, number>);
    setGlucoseLogs(getGlucoseLogs());
    const savedNsUrl = getHealth("nightscout_url", "") as string;
    if (savedNsUrl) { setNsUrl(savedNsUrl); setNsConnected(true); }
    // Health Connect init
    checkHealthConnect().then(s => setHcStatus(s));
  }, []);

  useEffect(() => {
    const h = height / 100;
    setBmi(h > 0 ? Math.round((weight / (h * h)) * 10) / 10 : 0);
  }, [height, weight]);

  const saveBody = () => {
    setHealth("height", height);
    setHealth("weight", weight);
    setHealth("age", age);
    setHealth("gender", gender);
    setHealth("bodyFat", bodyFat);
  };

  const bmiCat = getBmiCategory(bmi);

  // TDEE calculation
  const bmr = gender === "male"
    ? 10 * weight + 6.25 * height - 5 * age + 5
    : 10 * weight + 6.25 * height - 5 * age - 161;
  const tdee = Math.round(bmr * 1.55); // moderate activity

  const setGeneLevel = (traitId: string, level: number) => {
    const next = { ...geneResults, [traitId]: level };
    setGeneResults(next);
    setHealth("geneResults", next);
  };

  const setOralScore = (bacteriaId: string, score: number) => {
    const next = { ...oralScores, [bacteriaId]: score };
    setOralScores(next);
    setHealth("oralScores", next);
  };

  // Glucose functions
  const addGlucose = () => {
    const entry: GlucoseEntry = { id: Date.now(), value: glucoseVal, time: new Date().toISOString(), tag: glucoseTag, note: glucoseNote || undefined };
    const next = [entry, ...glucoseLogs];
    setGlucoseLogs(next);
    saveGlucoseLogs(next);
    setGlucoseNote("");
  };

  const deleteGlucose = (id: number) => {
    const next = glucoseLogs.filter(e => e.id !== id);
    setGlucoseLogs(next);
    saveGlucoseLogs(next);
  };

  const fetchNightscout = async (url?: string) => {
    const baseUrl = (url || nsUrl).replace(/\/+$/, "");
    if (!baseUrl) { setNsError("Nightscout URL을 입력해주세요."); return; }
    setNsLoading(true);
    setNsError("");
    try {
      const res = await fetch(`${baseUrl}/api/v1/entries.json?count=50&type=sgv`, { headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: NightscoutEntry[] = await res.json();
      setNsData(data.reverse());
      setNsConnected(true);
      setHealth("nightscout_url", baseUrl);
    } catch (err) {
      setNsError("연결 실패. URL을 확인하세요. (예: https://your-nightscout.herokuapp.com)");
      setNsConnected(false);
    } finally {
      setNsLoading(false);
    }
  };

  const disconnectNightscout = () => {
    setNsData([]);
    setNsConnected(false);
    setNsUrl("");
    setHealth("nightscout_url", "");
  };

  // Combined chart data (manual + nightscout)
  const allGlucoseForChart = [
    ...glucoseLogs.map(e => ({ value: e.value, time: e.time })),
    ...nsData.map(e => ({ value: e.sgv, time: e.dateString })),
  ].sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

  const todayGlucose = glucoseLogs.filter(e => e.time.startsWith(new Date().toISOString().slice(0, 10)));
  const avgGlucose = todayGlucose.length > 0 ? Math.round(todayGlucose.reduce((s, e) => s + e.value, 0) / todayGlucose.length) : null;

  const askCoach = async () => {
    let apiKey = "";
    try {
      const c = JSON.parse(process.env.NEXT_PUBLIC_GK || "[]");
      apiKey = c.map((n: number) => String.fromCharCode(n)).join("");
    } catch { /* */ }
    if (!apiKey) { setCoachResponse("⚠️ AI 서비스가 현재 설정되지 않았습니다."); return; }
    if (!coachQuery.trim()) return;

    setCoachLoading(true);
    setCoachResponse("");

    const context = `사용자 정보: 키 ${height}cm, 체중 ${weight}kg, 나이 ${age}세, 성별 ${gender === "male" ? "남성" : "여성"}, 체지방률 ${bodyFat}%, BMI ${bmi}(${bmiCat.label}), TDEE ${tdee}kcal`;

    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: `당신은 전문 피트니스 & 건강 코치입니다. 한국어로 답변하세요. 과학적 근거에 기반한 맞춤형 조언을 제공합니다. ${context}` },
            { role: "user", content: coachQuery },
          ],
          max_tokens: 800,
        }),
      });
      const data = await res.json();
      setCoachResponse(data.choices?.[0]?.message?.content || "응답을 받지 못했습니다.");
    } catch (err) {
      setCoachResponse("❌ AI 코칭 요청 실패. API 키와 네트워크를 확인해주세요.");
    } finally {
      setCoachLoading(false);
    }
  };

  const connectHealth = async () => {
    setHcLoading(true);
    const granted = await requestHealthPermissions();
    if (granted) {
      const data = await fetchHealthData();
      setHcData(data);
      setHcStatus("Available");
    }
    setHcLoading(false);
  };

  const refreshHealth = async () => {
    setHcLoading(true);
    const data = await fetchHealthData();
    setHcData(data);
    setHcLoading(false);
  };

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: "sync", label: "연동", icon: "📱" },
    { key: "body", label: "체성분", icon: "📊" },
    { key: "glucose", label: "혈당", icon: "🩸" },
    { key: "gene", label: "유전자", icon: "🧬" },
    { key: "oral", label: "구강", icon: "🦷" },
    { key: "coach", label: "AI코칭", icon: "🤖" },
  ];

  return (
    <div className="space-y-5 animate-slide-up">
      <div className="flex items-center gap-3">
        <Link href="/" className="w-9 h-9 glass rounded-xl flex items-center justify-center hover:bg-orange-50 shrink-0">
          <span className="text-lg">←</span>
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-black">디지털 헬스케어</h1>
          <p className="text-xs sm:text-sm text-text-muted mt-0.5">체성분 · 혈당 · 유전자 · 구강건강 · AI</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 glass rounded-xl p-1">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex-1 py-2.5 rounded-lg text-[11px] font-bold transition-all ${tab === t.key ? "bg-primary text-white shadow-lg shadow-primary/25" : "text-text-muted hover:text-text"}`}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ===== Health Connect Sync Tab ===== */}
      {tab === "sync" && (
        <div className="space-y-4 animate-slide-up">
          <div className="glass gradient-border rounded-2xl p-5 bg-gradient-to-br from-emerald-50 to-teal-50">
            <div className="flex items-center gap-3">
              <span className="text-3xl">📱</span>
              <div>
                <h3 className="font-bold">삼성헬스 · Health Connect</h3>
                <p className="text-[11px] text-text-muted mt-0.5">삼성헬스, Google Fit 데이터를 자동으로 가져옵니다</p>
              </div>
            </div>
          </div>

          {hcStatus === "checking" && (
            <div className="glass rounded-2xl p-8 text-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-text-muted">Health Connect 확인 중...</p>
            </div>
          )}

          {hcStatus === "Web" && (
            <div className="glass rounded-2xl p-5 text-center space-y-3">
              <span className="text-5xl block">🌐</span>
              <h3 className="font-bold">웹 브라우저 환경</h3>
              <p className="text-sm text-text-muted">Health Connect는 Android 앱에서만 사용할 수 있어요.</p>
              <p className="text-xs text-text-muted">FitFlow 앱을 Google Play에서 설치하면 삼성헬스 데이터를 자동으로 연동할 수 있습니다.</p>
              <div className="glass rounded-xl p-3 mt-4">
                <p className="text-[10px] font-bold text-primary mb-1">연동 가능한 데이터</p>
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {["걸음수", "칼로리", "심박수", "체중", "수면", "운동"].map(d => (
                    <span key={d} className="badge badge-primary">{d}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {hcStatus === "NotInstalled" && (
            <div className="glass rounded-2xl p-5 text-center space-y-3">
              <span className="text-5xl block">⬇️</span>
              <h3 className="font-bold">Health Connect 설치 필요</h3>
              <p className="text-sm text-text-muted">Google Play에서 Health Connect를 설치해주세요.</p>
              <button className="px-6 py-3 bg-primary text-white rounded-2xl text-sm font-bold active:scale-[0.96] shadow-lg shadow-primary/30">
                Play Store 열기
              </button>
            </div>
          )}

          {hcStatus === "NotSupported" && (
            <div className="glass rounded-2xl p-5 text-center space-y-3">
              <span className="text-5xl block">😔</span>
              <h3 className="font-bold">지원되지 않는 기기</h3>
              <p className="text-sm text-text-muted">이 기기에서는 Health Connect를 사용할 수 없어요.</p>
            </div>
          )}

          {hcStatus === "Available" && !hcData && (
            <div className="glass rounded-2xl p-5 text-center space-y-4">
              <span className="text-5xl block">🔗</span>
              <h3 className="font-bold">연동 준비 완료!</h3>
              <p className="text-sm text-text-muted">권한을 허용하면 삼성헬스 데이터를 가져올 수 있어요.</p>
              <button onClick={connectHealth} disabled={hcLoading}
                className="px-6 py-3 bg-accent text-white rounded-2xl text-sm font-bold active:scale-[0.96] shadow-lg shadow-accent/30 disabled:opacity-50">
                {hcLoading ? "연결 중..." : "🔗 Health Connect 연동하기"}
              </button>
            </div>
          )}

          {hcData && (
            <div className="space-y-4 animate-slide-up">
              <div className="flex items-center justify-between">
                <span className="badge badge-success">✓ 연동됨</span>
                <button onClick={refreshHealth} disabled={hcLoading}
                  className="px-3 py-1.5 glass rounded-lg text-[10px] font-bold active:scale-[0.97]">
                  {hcLoading ? "..." : "🔄 새로고침"}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="glass gradient-border rounded-2xl p-4 bg-gradient-to-br from-blue-50 to-sky-50">
                  <p className="text-[10px] text-text-muted font-semibold">👟 오늘 걸음수</p>
                  <p className="stat-number text-[28px] mt-1">{hcData.steps.toLocaleString()}</p>
                  <div className="progress-bar mt-2"><div className="progress-bar-fill" style={{width: `${Math.min((hcData.steps / 10000) * 100, 100)}%`}} /></div>
                  <p className="text-[9px] text-text-muted mt-1">목표 10,000보</p>
                </div>
                <div className="glass gradient-border rounded-2xl p-4 bg-gradient-to-br from-orange-50 to-amber-50">
                  <p className="text-[10px] text-text-muted font-semibold">🔥 소모 칼로리</p>
                  <p className="stat-number text-[28px] mt-1">{hcData.calories}</p>
                  <p className="text-[10px] text-text-muted">kcal</p>
                </div>
                <div className="glass gradient-border rounded-2xl p-4 bg-gradient-to-br from-rose-50 to-pink-50">
                  <p className="text-[10px] text-text-muted font-semibold">❤️ 심박수</p>
                  <p className="stat-number text-[28px] mt-1">{hcData.heartRate ?? "—"}</p>
                  <p className="text-[10px] text-text-muted">bpm</p>
                </div>
                <div className="glass gradient-border rounded-2xl p-4 bg-gradient-to-br from-violet-50 to-purple-50">
                  <p className="text-[10px] text-text-muted font-semibold">😴 수면</p>
                  <p className="stat-number text-[28px] mt-1">{hcData.sleepMinutes ? `${Math.floor(hcData.sleepMinutes / 60)}h ${Math.round(hcData.sleepMinutes % 60)}m` : "—"}</p>
                </div>
              </div>

              {hcData.weight && (
                <div className="glass rounded-2xl p-4">
                  <p className="text-[10px] text-text-muted font-semibold">⚖️ 최근 체중</p>
                  <p className="stat-number text-2xl mt-1">{hcData.weight} <span className="text-sm text-text-muted font-medium">kg</span></p>
                </div>
              )}

              {hcData.weeklySteps.length > 0 && (
                <div className="glass gradient-border rounded-2xl p-4">
                  <p className="text-xs font-bold mb-3">📊 주간 걸음수</p>
                  <div className="flex items-end gap-1.5 h-24">
                    {hcData.weeklySteps.map((d, i) => {
                      const maxVal = Math.max(...hcData.weeklySteps.map(s => s.value), 1);
                      const pct = (d.value / maxVal) * 100;
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <span className="text-[8px] text-text-muted">{(d.value / 1000).toFixed(1)}k</span>
                          <div className="w-full rounded-t-md bg-primary/20 relative" style={{height: `${Math.max(pct, 4)}%`}}>
                            <div className="absolute inset-0 rounded-t-md bg-primary" style={{height: `${pct}%`}} />
                          </div>
                          <span className="text-[8px] text-text-muted">{d.date}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ===== Body Composition Tab ===== */}
      {tab === "body" && (
        <div className="space-y-4">
          {/* BMI Card */}
          <div className={`relative overflow-hidden glass gradient-border rounded-2xl p-5 ${bmiCat.bg}`}>
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-xs text-text-muted font-semibold">BMI</p>
                <p className="text-4xl font-black mt-1">{bmi || "—"}</p>
                <p className={`text-sm font-bold mt-1 ${bmiCat.color}`}>{bmi ? bmiCat.label : "입력 필요"}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-text-muted font-semibold">일일 소모 (TDEE)</p>
                <p className="text-2xl font-black mt-1">{tdee}</p>
                <p className="text-[10px] text-text-muted">kcal/일</p>
              </div>
            </div>
            {bmi > 0 && <p className="text-[11px] text-text-muted mt-3 relative z-10">{bmiCat.advice}</p>}
            <div className="absolute -top-6 -right-6 w-20 h-20 bg-orange-50/80 rounded-full blur-xl" />
          </div>

          {/* BMI Scale */}
          <div className="glass rounded-xl p-3">
            <div className="flex h-2 rounded-full overflow-hidden">
              <div className="bg-blue-400 flex-[18.5]" />
              <div className="bg-emerald-400 flex-[4.5]" />
              <div className="bg-amber-400 flex-[2]" />
              <div className="bg-orange-400 flex-[5]" />
              <div className="bg-red-400 flex-[5]" />
            </div>
            {bmi > 0 && (
              <div className="relative h-4 mt-1">
                <div className="absolute text-[10px] font-bold" style={{ left: `${Math.min(Math.max((bmi / 35) * 100, 2), 98)}%`, transform: "translateX(-50%)" }}>
                  ▲
                </div>
              </div>
            )}
            <div className="flex justify-between text-[9px] text-text-muted mt-1">
              <span>저체중</span><span>정상</span><span>과체중</span><span>비만1</span><span>비만2</span>
            </div>
          </div>

          {/* Input Fields */}
          <div className="glass gradient-border rounded-2xl p-4 space-y-3">
            <h3 className="font-bold text-sm">📐 신체 정보 입력</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-text-muted font-semibold">키 (cm)</label>
                <input type="number" value={height} onChange={e => setHeight(+e.target.value)}
                  className="w-full glass rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="text-[10px] text-text-muted font-semibold">체중 (kg)</label>
                <input type="number" value={weight} onChange={e => setWeight(+e.target.value)}
                  className="w-full glass rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="text-[10px] text-text-muted font-semibold">나이</label>
                <input type="number" value={age} onChange={e => setAge(+e.target.value)}
                  className="w-full glass rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="text-[10px] text-text-muted font-semibold">체지방률 (%)</label>
                <input type="number" value={bodyFat} onChange={e => setBodyFat(+e.target.value)}
                  className="w-full glass rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setGender("male")} className={`flex-1 py-2 rounded-lg text-xs font-bold ${gender === "male" ? "bg-primary text-white" : "glass text-text-muted"}`}>🚹 남성</button>
              <button onClick={() => setGender("female")} className={`flex-1 py-2 rounded-lg text-xs font-bold ${gender === "female" ? "bg-primary text-white" : "glass text-text-muted"}`}>🚺 여성</button>
            </div>
            <button onClick={saveBody} className="w-full py-2.5 bg-primary text-white rounded-xl text-sm font-bold active:scale-[0.97] shadow-lg shadow-primary/25">💾 저장</button>
          </div>

          {/* Calorie Targets */}
          <div className="grid grid-cols-3 gap-3">
            <div className="glass gradient-border rounded-xl p-3 text-center bg-gradient-to-br from-red-100 to-orange-50">
              <p className="text-[10px] text-text-muted font-semibold">감량 목표</p>
              <p className="text-lg font-black text-red-400">{tdee - 500}</p>
              <p className="text-[9px] text-text-muted">kcal/일</p>
            </div>
            <div className="glass gradient-border rounded-xl p-3 text-center bg-gradient-to-br from-emerald-100 to-green-50">
              <p className="text-[10px] text-text-muted font-semibold">유지</p>
              <p className="text-lg font-black text-emerald-400">{tdee}</p>
              <p className="text-[9px] text-text-muted">kcal/일</p>
            </div>
            <div className="glass gradient-border rounded-xl p-3 text-center bg-gradient-to-br from-orange-100 to-amber-50">
              <p className="text-[10px] text-text-muted font-semibold">벌크업</p>
              <p className="text-lg font-black text-orange-600">{tdee + 500}</p>
              <p className="text-[9px] text-text-muted">kcal/일</p>
            </div>
          </div>
        </div>
      )}

      {/* ===== Glucose Tracking Tab ===== */}
      {tab === "glucose" && (
        <div className="space-y-4">
          {/* Today Summary */}
          <div className="glass gradient-border rounded-2xl p-4 bg-gradient-to-br from-rose-100 to-orange-50">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-bold text-rose-600">🩸 오늘 혈당</p>
                <p className="text-3xl font-black mt-1">{avgGlucose ?? "—"} <span className="text-sm font-semibold text-text-muted">mg/dL</span></p>
                {avgGlucose && <p className={`text-xs font-bold mt-1 ${getGlucoseRange(avgGlucose).color}`}>{getGlucoseRange(avgGlucose).label}</p>}
              </div>
              <div className="text-right">
                <p className="text-[10px] text-text-muted">측정 {todayGlucose.length}회</p>
                <div className="flex gap-1 mt-2">
                  <span className="px-1.5 py-0.5 rounded text-[8px] bg-emerald-100 text-emerald-700">70~99 정상</span>
                  <span className="px-1.5 py-0.5 rounded text-[8px] bg-amber-100 text-amber-700">100~125 주의</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chart */}
          {allGlucoseForChart.length >= 2 && (
            <div className="glass gradient-border rounded-2xl p-3">
              <p className="text-[10px] font-bold text-text-muted mb-1">📈 혈당 추이</p>
              <GlucoseChart entries={allGlucoseForChart} />
              <div className="flex justify-center gap-3 mt-1 text-[8px]">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> 정상</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> 주의</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> 고혈당</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> 저혈당</span>
              </div>
            </div>
          )}

          {/* Manual Input */}
          <div className="glass gradient-border rounded-2xl p-4 space-y-3">
            <h3 className="font-bold text-sm">✏️ 수동 혈당 입력</h3>
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <label className="text-[10px] text-text-muted font-semibold">혈당 (mg/dL)</label>
                <input type="number" value={glucoseVal} onChange={e => setGlucoseVal(+e.target.value)} min={30} max={500}
                  className="w-full glass rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <button onClick={addGlucose} className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold active:scale-[0.97] shadow-lg shadow-primary/25">
                + 기록
              </button>
            </div>
            {/* Tags */}
            <div className="flex gap-1.5 flex-wrap">
              {(Object.keys(GLUCOSE_TAGS) as GlucoseEntry["tag"][]).map(t => (
                <button key={t} onClick={() => setGlucoseTag(t)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${glucoseTag === t ? "bg-primary text-white" : "glass text-text-muted"}`}>
                  {GLUCOSE_TAGS[t]}
                </button>
              ))}
            </div>
            <input type="text" value={glucoseNote} onChange={e => setGlucoseNote(e.target.value)}
              placeholder="메모 (선택사항)" className="w-full glass rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>

          {/* Nightscout CGM Integration */}
          <div className="glass gradient-border rounded-2xl p-4 space-y-3 bg-gradient-to-br from-teal-50 to-cyan-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">📡</span>
                <div>
                  <h3 className="font-bold text-sm">Nightscout CGM 연동</h3>
                  <p className="text-[10px] text-text-muted">Dexcom / FreeStyle Libre 데이터</p>
                </div>
              </div>
              {nsConnected && <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-700">연결됨 ✓</span>}
            </div>

            {!nsConnected ? (
              <>
                <input type="url" value={nsUrl} onChange={e => setNsUrl(e.target.value)}
                  placeholder="https://your-nightscout.herokuapp.com"
                  className="w-full glass rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30" />
                <button onClick={() => fetchNightscout()} disabled={nsLoading}
                  className="w-full py-2.5 bg-teal-600 text-white rounded-xl text-sm font-bold active:scale-[0.97] shadow-lg shadow-teal-600/25 disabled:opacity-50">
                  {nsLoading ? "연결 중..." : "🔗 Nightscout 연결"}
                </button>
                <p className="text-[10px] text-text-muted">* Nightscout 서버 URL을 입력하세요. Dexcom/Libre 사용자는 Nightscout를 통해 CGM 데이터를 연동할 수 있습니다.</p>
              </>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <button onClick={() => fetchNightscout()} disabled={nsLoading}
                    className="flex-1 py-2 glass rounded-xl text-xs font-bold active:scale-[0.97]">
                    {nsLoading ? "로딩..." : "🔄 새로고침"}
                  </button>
                  <button onClick={disconnectNightscout}
                    className="px-4 py-2 glass rounded-xl text-xs font-bold text-red-500 active:scale-[0.97]">
                    연결 해제
                  </button>
                </div>
                {nsData.length > 0 && (
                  <div className="glass rounded-xl p-3">
                    <p className="text-[10px] font-bold text-text-muted mb-1">최근 CGM 데이터 ({nsData.length}개)</p>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-black">{nsData[nsData.length - 1]?.sgv}</p>
                      <span className="text-sm text-text-muted">mg/dL</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${getGlucoseRange(nsData[nsData.length - 1]?.sgv || 0).bg} ${getGlucoseRange(nsData[nsData.length - 1]?.sgv || 0).color}`}>
                        {getGlucoseRange(nsData[nsData.length - 1]?.sgv || 0).label}
                      </span>
                      {nsData[nsData.length - 1]?.direction && (
                        <span className="text-xs text-text-muted">
                          {nsData[nsData.length - 1].direction === "Flat" ? "→" :
                           nsData[nsData.length - 1].direction === "FortyFiveUp" ? "↗" :
                           nsData[nsData.length - 1].direction === "FortyFiveDown" ? "↘" :
                           nsData[nsData.length - 1].direction === "SingleUp" ? "↑" :
                           nsData[nsData.length - 1].direction === "SingleDown" ? "↓" :
                           nsData[nsData.length - 1].direction === "DoubleUp" ? "⇈" :
                           nsData[nsData.length - 1].direction === "DoubleDown" ? "⇊" : ""}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
            {nsError && <p className="text-[10px] text-red-500">{nsError}</p>}
          </div>

          {/* Today's Log */}
          {glucoseLogs.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-bold text-sm">📝 최근 기록</h3>
              {glucoseLogs.slice(0, 15).map(entry => {
                const rng = getGlucoseRange(entry.value);
                const dt = new Date(entry.time);
                return (
                  <div key={entry.id} className="glass rounded-xl p-3 flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${rng.bg}`}>
                      <p className={`text-sm font-black ${rng.color}`}>{entry.value}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${rng.bg} ${rng.color}`}>{rng.label}</span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-orange-50 text-text-muted">{GLUCOSE_TAGS[entry.tag]}</span>
                      </div>
                      {entry.note && <p className="text-[10px] text-text-muted mt-0.5 truncate">{entry.note}</p>}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[10px] text-text-muted">{dt.toLocaleDateString("ko")}</p>
                      <p className="text-[10px] text-text-muted">{dt.toTimeString().slice(0, 5)}</p>
                    </div>
                    <button onClick={() => deleteGlucose(entry.id)} className="text-text-muted/40 hover:text-red-400 text-xs">✕</button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Info */}
          <div className="glass rounded-xl p-3">
            <p className="text-[10px] font-bold text-text-muted mb-1">💡 혈당 관리 팁</p>
            <div className="space-y-1 text-[10px] text-text-muted">
              <p>• 공복 혈당 목표: 70~99 mg/dL</p>
              <p>• 식후 2시간 혈당 목표: 140 mg/dL 미만</p>
              <p>• 규칙적인 식사와 운동이 혈당 안정에 도움</p>
              <p>• CGM 사용자는 Nightscout 연동으로 실시간 모니터링</p>
            </div>
          </div>
        </div>
      )}

      {/* ===== Genetic Testing Tab ===== */}
      {tab === "gene" && (
        <div className="space-y-4">
          <div className="glass gradient-border rounded-2xl p-4 bg-gradient-to-br from-purple-100 to-violet-50">
            <h3 className="font-bold text-sm">🧬 유전자 검사 결과 입력</h3>
            <p className="text-[11px] text-text-muted mt-1">유전자 검사를 받으셨다면 결과를 입력하여 맞춤형 운동/식단 추천을 받으세요.</p>
            <p className="text-[10px] text-text-muted mt-2">* 마크로젠 젠톡, 테라젠 등 DTC 유전자 검사 결과 활용 가능</p>
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {GENETIC_CATEGORIES.map(cat => (
              <button key={cat.id} className="px-3 py-1.5 glass rounded-lg text-[10px] font-bold whitespace-nowrap">{cat.icon} {cat.label}</button>
            ))}
          </div>

          {/* Trait Cards */}
          <div className="stagger space-y-3">
            {GENETIC_TRAITS.map(trait => {
              const level = geneResults[trait.id] ?? -1;
              const recs = level >= 0 ? trait.recommendations[trait.levels[level]] : null;
              return (
                <div key={trait.id} className="glass gradient-border rounded-2xl p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{trait.icon}</span>
                    <div className="flex-1">
                      <p className="font-bold text-sm">{trait.name}</p>
                      <p className="text-[10px] text-text-muted mt-0.5">{trait.description}</p>
                      {/* Level selector */}
                      <div className="flex gap-1.5 mt-3">
                        {trait.levels.map((lv, i) => (
                          <button key={i} onClick={() => setGeneLevel(trait.id, i)}
                            className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all ${level === i
                              ? i === 0 ? "bg-emerald-500/20 text-emerald-400" : i === 1 ? "bg-amber-500/20 text-amber-400" : "bg-red-500/20 text-red-400"
                              : "glass text-text-muted"}`}>
                            {lv}
                          </button>
                        ))}
                      </div>
                      {/* Recommendations */}
                      {recs && (
                        <div className="mt-3 pt-3 border-t border-border/50 animate-slide-up">
                          <p className="text-[10px] font-bold text-primary mb-2">맞춤 추천</p>
                          {recs.map((r, i) => (
                            <p key={i} className="text-[11px] text-text-muted flex gap-2 mb-1">
                              <span className="text-primary shrink-0">•</span>{r}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===== Oral Microbiome Tab ===== */}
      {tab === "oral" && (
        <div className="space-y-4">
          <div className="glass gradient-border rounded-2xl p-4 bg-gradient-to-br from-sky-100 to-blue-50">
            <h3 className="font-bold text-sm">🦷 구강 마이크로바이옴</h3>
            <p className="text-[11px] text-text-muted mt-1">구강 내 세균 균형이 전신 건강에 영향을 줍니다. 검사 결과를 입력하거나 정보를 확인하세요.</p>
          </div>

          {/* Oral Health Tips */}
          <div className="space-y-2">
            <h3 className="font-bold text-sm">🪥 구강 관리 팁</h3>
            {ORAL_HEALTH_TIPS.map((tip, i) => (
              <div key={i} className="glass rounded-xl p-3 flex items-start gap-3">
                <span className="text-xl shrink-0">{tip.icon}</span>
                <div>
                  <p className="font-bold text-xs">{tip.title}</p>
                  <p className="text-[10px] text-text-muted mt-0.5">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bacteria Cards */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm">🔬 주요 구강 세균</h3>
            {ORAL_BACTERIA.map(bac => {
              const score = oralScores[bac.id] ?? -1;
              return (
                <div key={bac.id} className="glass gradient-border rounded-2xl p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{bac.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-sm">{bac.nameKo}</p>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${bac.type === "beneficial" ? "bg-emerald-500/10 text-emerald-400" : bac.type === "harmful" ? "bg-red-500/10 text-red-400" : "bg-orange-50/80 text-text-muted"}`}>
                          {bac.type === "beneficial" ? "유익균" : bac.type === "harmful" ? "유해균" : "중립"}
                        </span>
                      </div>
                      <p className="text-[10px] text-text-muted italic">{bac.name}</p>
                      <p className="text-[11px] text-text-muted mt-1">{bac.description}</p>

                      {/* Detection Level */}
                      <div className="flex gap-1.5 mt-3">
                        {["미검출", "소량", "보통", "다량"].map((lv, i) => (
                          <button key={i} onClick={() => setOralScore(bac.id, i)}
                            className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold ${score === i
                              ? bac.type === "harmful"
                                ? i <= 1 ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
                                : i >= 2 ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
                              : "glass text-text-muted"}`}>
                            {lv}
                          </button>
                        ))}
                      </div>

                      {/* Effects & Management */}
                      <div className="mt-3 pt-3 border-t border-border/50 space-y-2">
                        <div>
                          <p className="text-[10px] font-bold text-text-muted">영향</p>
                          {bac.effects.map((e, i) => (
                            <p key={i} className="text-[10px] text-text-muted flex gap-1.5"><span className={bac.type === "beneficial" ? "text-emerald-400" : "text-red-400"}>•</span>{e}</p>
                          ))}
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-primary">관리법</p>
                          {bac.management.map((m, i) => (
                            <p key={i} className="text-[10px] text-text-muted flex gap-1.5"><span className="text-primary">→</span>{m}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===== AI Coach Tab ===== */}
      {tab === "coach" && (
        <div className="space-y-4">
          <div className="glass gradient-border rounded-2xl p-5 bg-gradient-to-br from-orange-100 to-amber-50">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🤖</span>
              <div>
                <h3 className="font-bold">AI 건강 코치</h3>
                <p className="text-[11px] text-text-muted mt-0.5">운동, 식단, 건강 관련 무엇이든 물어보세요.</p>
                <p className="text-[10px] text-text-muted">내 신체 정보를 기반으로 맞춤 답변을 드려요.</p>
              </div>
            </div>
          </div>

          {/* Quick Questions */}
          <div className="flex flex-wrap gap-2">
            {[
              "내 체형에 맞는 운동 추천해줘",
              "벌크업 식단 어떻게 짜야 해?",
              "체지방 빼면서 근육 유지하려면?",
              "수면이 근성장에 미치는 영향은?",
              "어깨 넓어지려면 어떤 운동?",
              "운동 후 단백질 얼마나 먹어야 해?",
            ].map((q, i) => (
              <button key={i} onClick={() => { setCoachQuery(q); }} className="px-3 py-1.5 glass rounded-lg text-[10px] font-semibold hover:bg-orange-50/80 active:scale-[0.97]">{q}</button>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={coachQuery}
              onChange={e => setCoachQuery(e.target.value)}
              onKeyDown={e => e.key === "Enter" && askCoach()}
              placeholder="건강/운동 관련 질문..."
              className="flex-1 glass rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button onClick={askCoach} disabled={coachLoading}
              className="px-4 py-3 bg-primary text-white rounded-xl text-sm font-bold active:scale-[0.97] shadow-lg shadow-primary/25 disabled:opacity-50">
              {coachLoading ? "..." : "💬"}
            </button>
          </div>

          {/* Response */}
          {coachLoading && (
            <div className="glass rounded-2xl p-5 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mr-3" />
              <p className="text-sm text-text-muted">AI가 답변을 생성 중...</p>
            </div>
          )}
          {coachResponse && !coachLoading && (
            <div className="glass gradient-border rounded-2xl p-5 animate-slide-up">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">🤖</span>
                <p className="font-bold text-sm">AI 코치</p>
              </div>
              <div className="text-sm leading-relaxed text-text/90 whitespace-pre-wrap">{coachResponse}</div>
            </div>
          )}

          {/* My Stats */}
          <div className="glass rounded-xl p-3">
            <p className="text-[10px] font-bold text-text-muted mb-2">📊 내 프로필 (AI에 반영됨)</p>
            <div className="flex flex-wrap gap-2 text-[10px]">
              <span className="px-2 py-1 bg-orange-50/80 rounded">키 {height}cm</span>
              <span className="px-2 py-1 bg-orange-50/80 rounded">체중 {weight}kg</span>
              <span className="px-2 py-1 bg-orange-50/80 rounded">BMI {bmi}</span>
              <span className="px-2 py-1 bg-orange-50/80 rounded">체지방 {bodyFat}%</span>
              <span className="px-2 py-1 bg-orange-50/80 rounded">TDEE {tdee}kcal</span>
            </div>
            <Link href="/health" onClick={() => setTab("body")} className="text-[10px] text-primary font-semibold mt-2 block">체성분 탭에서 수정 →</Link>
          </div>
        </div>
      )}

      <div className="h-8" />
    </div>
  );
}
