"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface FoodResult {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving: string;
  confidence: string;
}

interface MealLog {
  id: number;
  date: string;
  time: string;
  foods: FoodResult[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  imageData?: string;
}

function getApiKey(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("fitflow:api_key") || "";
}

function setApiKey(key: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("fitflow:api_key", key);
  }
}

function getMealLogs(): MealLog[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("fitflow:meal_logs") || "[]");
  } catch { return []; }
}

function saveMealLog(log: MealLog) {
  const logs = getMealLogs();
  logs.unshift(log);
  localStorage.setItem("fitflow:meal_logs", JSON.stringify(logs.slice(0, 100)));
}

function getTodayLogs(): MealLog[] {
  const today = new Date().toISOString().split("T")[0];
  return getMealLogs().filter(l => l.date === today);
}

export default function ScannerPage() {
  const [apiKey, setApiKeyState] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [imageData, setImageData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<FoodResult[] | null>(null);
  const [error, setError] = useState("");
  const [todayLogs, setTodayLogs] = useState<MealLog[]>([]);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setApiKeyState(getApiKey());
    setTodayLogs(getTodayLogs());
  }, []);

  const todayTotal = todayLogs.reduce((acc, log) => ({
    calories: acc.calories + log.totalCalories,
    protein: acc.protein + log.totalProtein,
    carbs: acc.carbs + log.totalCarbs,
    fat: acc.fat + log.totalFat,
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setResults(null);
    setError("");
    setSaved(false);

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      setImageData(reader.result as string);
      analyzeFood(base64);
    };
    reader.readAsDataURL(file);
  };

  const analyzeFood = async (base64: string) => {
    const key = getApiKey();
    if (!key) {
      setError("API 키를 설정해주세요. (설정 버튼 클릭)");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${key}`,
        },
        body: JSON.stringify({
          model: "qwen-vl-plus",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "image_url",
                  image_url: { url: `data:image/jpeg;base64,${base64}` },
                },
                {
                  type: "text",
                  text: `이 음식 사진을 분석해주세요. 사진에 보이는 모든 음식을 식별하고 각각의 영양 정보를 추정해주세요.

반드시 아래 JSON 형식으로만 답변해주세요 (다른 텍스트 없이):
[
  {
    "name": "음식 이름 (한국어)",
    "calories": 예상 칼로리 (숫자),
    "protein": 단백질 g (숫자),
    "carbs": 탄수화물 g (숫자),
    "fat": 지방 g (숫자),
    "serving": "예상 1인분 기준량",
    "confidence": "high/medium/low"
  }
]

음식이 아닌 사진이면 빈 배열 []을 반환해주세요.`,
                },
              ],
            },
          ],
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData?.error?.message || `API 오류: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || "";

      // Parse JSON from response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const foods: FoodResult[] = JSON.parse(jsonMatch[0]);
        setResults(foods.length > 0 ? foods : null);
        if (foods.length === 0) setError("음식을 인식하지 못했습니다. 다른 사진을 시도해보세요.");
      } else {
        setError("분석 결과를 해석할 수 없습니다. 다시 시도해주세요.");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "알 수 없는 오류";
      setError(`분석 실패: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!results) return;
    const now = new Date();
    const log: MealLog = {
      id: Date.now(),
      date: now.toISOString().split("T")[0],
      time: now.toTimeString().slice(0, 5),
      foods: results,
      totalCalories: results.reduce((s, f) => s + f.calories, 0),
      totalProtein: results.reduce((s, f) => s + f.protein, 0),
      totalCarbs: results.reduce((s, f) => s + f.carbs, 0),
      totalFat: results.reduce((s, f) => s + f.fat, 0),
      imageData: imageData || undefined,
    };
    saveMealLog(log);
    setTodayLogs(getTodayLogs());
    setSaved(true);
  };

  const handleReset = () => {
    setImageData(null);
    setResults(null);
    setError("");
    setSaved(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="space-y-5 animate-slide-up">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-black">AI 식단 스캐너</h1>
          <p className="text-sm text-text-muted mt-1">음식 사진 → 칼로리 자동 계산</p>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="px-3 py-2 glass rounded-xl text-xs font-semibold"
        >
          ⚙️
        </button>
      </div>

      {/* API Key Settings */}
      {showSettings && (
        <div className="glass gradient-border rounded-2xl p-4 animate-slide-up">
          <h3 className="font-bold text-sm mb-2">🔑 API 설정</h3>
          <p className="text-[11px] text-text-muted mb-3">DashScope API 키를 입력하면 AI가 음식을 분석합니다</p>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => {
              setApiKeyState(e.target.value);
              setApiKey(e.target.value);
            }}
            placeholder="DashScope API Key"
            className="w-full glass rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <p className="text-[10px] text-text-muted mt-2">* 키는 이 기기에만 저장됩니다 (로컬스토리지)</p>
        </div>
      )}

      {/* Today's Summary */}
      <div className="glass gradient-border rounded-2xl p-4 bg-gradient-to-br from-emerald-500/10 to-teal-500/5">
        <p className="text-[10px] font-bold text-emerald-400 mb-2">📊 오늘 섭취량</p>
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center">
            <p className="text-lg font-black">{todayTotal.calories}</p>
            <p className="text-[10px] text-text-muted">kcal</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-black text-blue-400">{todayTotal.protein}g</p>
            <p className="text-[10px] text-text-muted">단백질</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-black text-amber-400">{todayTotal.carbs}g</p>
            <p className="text-[10px] text-text-muted">탄수화물</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-black text-rose-400">{todayTotal.fat}g</p>
            <p className="text-[10px] text-text-muted">지방</p>
          </div>
        </div>
        {todayLogs.length > 0 && (
          <p className="text-[10px] text-text-muted mt-2 text-center">오늘 {todayLogs.length}끼 기록됨</p>
        )}
      </div>

      {/* Camera / Upload */}
      {!imageData && (
        <div className="space-y-3">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImage}
            className="hidden"
            id="food-camera"
          />
          <label
            htmlFor="food-camera"
            className="block w-full aspect-[4/3] rounded-2xl glass gradient-border flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 active:scale-[0.98]"
          >
            <div className="text-5xl mb-3">📷</div>
            <p className="font-bold text-sm">음식 사진 촬영 / 업로드</p>
            <p className="text-[11px] text-text-muted mt-1">터치하여 카메라 열기 또는 사진 선택</p>
          </label>

          <div className="flex gap-3">
            <label
              htmlFor="food-camera"
              className="flex-1 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-bold text-center active:scale-[0.97] shadow-lg shadow-primary/25 cursor-pointer"
            >
              📷 사진 촬영
            </label>
            <label className="flex-1 relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImage}
                className="hidden"
              />
              <div className="py-3 glass rounded-xl text-sm font-bold text-center active:scale-[0.97] cursor-pointer hover:bg-white/10">
                🖼️ 갤러리
              </div>
            </label>
          </div>
        </div>
      )}

      {/* Image Preview + Results */}
      {imageData && (
        <div className="space-y-4">
          {/* Image */}
          <div className="relative rounded-2xl overflow-hidden">
            <img src={imageData} alt="음식 사진" className="w-full aspect-[4/3] object-cover" />
            {loading && (
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
                <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-sm font-bold">AI 분석 중...</p>
                <p className="text-[11px] text-text-muted mt-1">음식을 식별하고 있습니다</p>
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="glass rounded-xl p-4 border border-red-500/20 bg-red-500/5">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Results */}
          {results && (
            <div className="space-y-3 animate-slide-up">
              <h3 className="font-bold">🍽️ 분석 결과</h3>

              {/* Total */}
              <div className="glass gradient-border rounded-xl p-4 bg-gradient-to-br from-indigo-500/10 to-violet-500/5">
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div>
                    <p className="text-xl font-black">{results.reduce((s, f) => s + f.calories, 0)}</p>
                    <p className="text-[10px] text-text-muted">총 칼로리</p>
                  </div>
                  <div>
                    <p className="text-xl font-black text-blue-400">{results.reduce((s, f) => s + f.protein, 0)}g</p>
                    <p className="text-[10px] text-text-muted">단백질</p>
                  </div>
                  <div>
                    <p className="text-xl font-black text-amber-400">{results.reduce((s, f) => s + f.carbs, 0)}g</p>
                    <p className="text-[10px] text-text-muted">탄수화물</p>
                  </div>
                  <div>
                    <p className="text-xl font-black text-rose-400">{results.reduce((s, f) => s + f.fat, 0)}g</p>
                    <p className="text-[10px] text-text-muted">지방</p>
                  </div>
                </div>
              </div>

              {/* Food Items */}
              {results.map((food, i) => (
                <div key={i} className="glass rounded-xl p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-sm">{food.name}</p>
                      <p className="text-[10px] text-text-muted">{food.serving}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{food.calories} kcal</p>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                        food.confidence === "high" ? "bg-green-500/10 text-green-400" :
                        food.confidence === "medium" ? "bg-amber-500/10 text-amber-400" :
                        "bg-red-500/10 text-red-400"
                      }`}>
                        {food.confidence === "high" ? "높은 정확도" :
                         food.confidence === "medium" ? "보통 정확도" : "낮은 정확도"}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-2 text-[10px]">
                    <span className="text-blue-400">P {food.protein}g</span>
                    <span className="text-amber-400">C {food.carbs}g</span>
                    <span className="text-rose-400">F {food.fat}g</span>
                  </div>
                </div>
              ))}

              {/* Save Button */}
              <div className="flex gap-3">
                {!saved ? (
                  <button
                    onClick={handleSave}
                    className="flex-1 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-bold active:scale-[0.97] shadow-lg shadow-primary/25"
                  >
                    ✅ 식사 기록 저장
                  </button>
                ) : (
                  <div className="flex-1 py-3 bg-emerald-500/20 text-emerald-400 rounded-xl text-sm font-bold text-center">
                    ✅ 저장 완료!
                  </div>
                )}
                <button
                  onClick={handleReset}
                  className="px-4 py-3 glass rounded-xl text-sm font-bold active:scale-[0.97]"
                >
                  🔄
                </button>
              </div>
            </div>
          )}

          {/* Retry/Reset */}
          {!loading && !results && (
            <button
              onClick={handleReset}
              className="w-full py-3 glass rounded-xl text-sm font-bold active:scale-[0.97]"
            >
              🔄 다시 촬영
            </button>
          )}
        </div>
      )}

      {/* Today's Meal Log */}
      {todayLogs.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-bold">📝 오늘의 식사 기록</h3>
          {todayLogs.map((log) => (
            <div key={log.id} className="glass rounded-xl p-3 flex items-center gap-3">
              {log.imageData && (
                <img src={log.imageData} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{log.foods.map(f => f.name).join(", ")}</p>
                <p className="text-[10px] text-text-muted">{log.time}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold text-sm">{log.totalCalories}</p>
                <p className="text-[10px] text-text-muted">kcal</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Link to diet plan */}
      <Link href="/diet" className="block w-full py-3 glass rounded-xl text-sm font-bold text-center active:scale-[0.97] hover:bg-white/5">
        📋 식단 가이드 보기
      </Link>

      {/* Bottom spacing */}
      <div className="h-8" />
    </div>
  );
}
