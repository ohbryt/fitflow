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

function _dk(): string {
  try {
    const c = JSON.parse(process.env.NEXT_PUBLIC_GK || "[]");
    return c.map((n: number) => String.fromCharCode(n)).join("");
  } catch { return ""; }
}
const GROQ_API_KEY = _dk();

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
  const [imageData, setImageData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<FoodResult[] | null>(null);
  const [error, setError] = useState("");
  const [todayLogs, setTodayLogs] = useState<MealLog[]>([]);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
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
    if (!GROQ_API_KEY) {
      setError("AI 서비스가 현재 설정되지 않았습니다.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.2-90b-vision-preview",
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
      <div className="flex items-center gap-3">
        <Link href="/" className="w-9 h-9 glass rounded-xl flex items-center justify-center hover:bg-orange-50 shrink-0">
          <span className="text-lg">←</span>
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-black">AI 식단 스캐너</h1>
          <p className="text-xs sm:text-sm text-text-muted mt-0.5">음식 사진 → 칼로리 자동 계산</p>
        </div>
      </div>

      {/* Today's Summary */}
      <div className="glass gradient-border rounded-2xl p-4 bg-gradient-to-br from-emerald-100 to-green-50">
        <p className="text-[10px] font-bold text-emerald-600 mb-2">📊 오늘 섭취량</p>
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center">
            <p className="text-lg font-black">{todayTotal.calories}</p>
            <p className="text-[10px] text-text-muted">kcal</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-black text-blue-600">{todayTotal.protein}g</p>
            <p className="text-[10px] text-text-muted">단백질</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-black text-amber-600">{todayTotal.carbs}g</p>
            <p className="text-[10px] text-text-muted">탄수화물</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-black text-rose-600">{todayTotal.fat}g</p>
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
            className="block w-full aspect-[4/3] rounded-2xl glass gradient-border flex flex-col items-center justify-center cursor-pointer hover:bg-orange-50/60 active:scale-[0.98]"
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
              <div className="py-3 glass rounded-xl text-sm font-bold text-center active:scale-[0.97] cursor-pointer hover:bg-orange-50/60">
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
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
                <div className="w-10 h-10 border-3 border-white border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-sm font-bold text-white">AI 분석 중...</p>
                <p className="text-[11px] text-white/70 mt-1">음식을 식별하고 있습니다</p>
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="glass rounded-xl p-4 border border-red-300 bg-red-50">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Results */}
          {results && (
            <div className="space-y-3 animate-slide-up">
              <h3 className="font-bold">🍽️ 분석 결과</h3>

              {/* Total */}
              <div className="glass gradient-border rounded-xl p-4 bg-gradient-to-br from-orange-100 to-amber-50">
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div>
                    <p className="text-xl font-black">{results.reduce((s, f) => s + f.calories, 0)}</p>
                    <p className="text-[10px] text-text-muted">총 칼로리</p>
                  </div>
                  <div>
                    <p className="text-xl font-black text-blue-600">{results.reduce((s, f) => s + f.protein, 0)}g</p>
                    <p className="text-[10px] text-text-muted">단백질</p>
                  </div>
                  <div>
                    <p className="text-xl font-black text-amber-600">{results.reduce((s, f) => s + f.carbs, 0)}g</p>
                    <p className="text-[10px] text-text-muted">탄수화물</p>
                  </div>
                  <div>
                    <p className="text-xl font-black text-rose-600">{results.reduce((s, f) => s + f.fat, 0)}g</p>
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
                        food.confidence === "high" ? "bg-green-100 text-green-700" :
                        food.confidence === "medium" ? "bg-amber-100 text-amber-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {food.confidence === "high" ? "높은 정확도" :
                         food.confidence === "medium" ? "보통 정확도" : "낮은 정확도"}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-2 text-[10px]">
                    <span className="text-blue-600">P {food.protein}g</span>
                    <span className="text-amber-600">C {food.carbs}g</span>
                    <span className="text-rose-600">F {food.fat}g</span>
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
                  <div className="flex-1 py-3 bg-emerald-100 text-emerald-700 rounded-xl text-sm font-bold text-center">
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
      <Link href="/diet" className="block w-full py-3 glass rounded-xl text-sm font-bold text-center active:scale-[0.97] hover:bg-orange-50/60">
        📋 식단 가이드 보기
      </Link>

      {/* Bottom spacing */}
      <div className="h-8" />
    </div>
  );
}
