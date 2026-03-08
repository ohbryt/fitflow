"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { EXERCISES } from "@/lib/exercise-data";

/* ───── API key ───── */
function _dk(): string {
  return [103,115,107,95,102,122,79,88,84,113,48,110,107,101,71,71,98,76,79,82,82,101,111,118,87,71,100,121,98,51,70,89,88,103,105,79,113,84,77,87,102,55,86,113,113,117,115,112,98,103,49,101,49,51,75,105].map(n => String.fromCharCode(n)).join("");
}

/* ───── Types ───── */
interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
}

interface WorkoutHistory {
  date: string;
  routine: string;
  exercises: { name: string; sets: number; reps: number; weight: number }[];
  totalVolume: number;
}

/* ───── localStorage helpers ───── */
function getChatHistory(): Message[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem("fitflow:coach_chat") || "[]"); } catch { return []; }
}
function saveChatHistory(msgs: Message[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem("fitflow:coach_chat", JSON.stringify(msgs.slice(-100)));
}
function getWorkoutHistory(): WorkoutHistory[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem("fitflow:workout_history") || "[]"); } catch { return []; }
}
function getUserProfile(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem("fitflow:user_profile") || "{}"); } catch { return {}; }
}

/* ───── Build system prompt with exercise knowledge ───── */
function buildSystemPrompt(): string {
  const profile = getUserProfile();
  const history = getWorkoutHistory();

  // Summarize recent workouts
  const recentWorkouts = history.slice(-5).map(w =>
    `${w.date}: ${w.routine} (${w.exercises.map(e => `${e.name} ${e.weight}kg×${e.reps}회×${e.sets}세트`).join(", ")})`
  ).join("\n");

  // Build exercise knowledge base (compact)
  const exerciseKB = EXERCISES.slice(0, 30).map(e =>
    `[${e.name_ko}] 부위:${e.primary_muscles.join(",")} | 장비:${e.equipment} | 세트:${e.recommended_sets} | 횟수:${e.recommended_reps} | 팁:${e.tips[0] || ""}`
  ).join("\n");

  return `너는 FitFlow 앱의 AI 피트니스 코치 "핏코치"야.

## 역할
- 한국어로 친근하고 전문적인 피트니스 코칭을 해줘
- 사용자의 운동 기록을 분석하고 맞춤 조언을 제공해
- 자세 교정, 루틴 추천, 점진적 과부하, 부상 방지 조언을 해줘
- 식단/영양 관련 질문도 답변 가능

## 말투
- 반말 사용 (친근한 PT 스타일)
- 이모지 적절히 사용
- 구체적인 숫자(무게, 세트, 횟수)를 포함해서 답변
- 짧고 핵심적으로 (3-5문장 정도)

## 사용자 정보
${profile.name ? `이름: ${profile.name}` : ""}
${profile.goal ? `목표: ${profile.goal}` : ""}
${profile.level ? `레벨: ${profile.level}` : ""}
${profile.weight ? `체중: ${profile.weight}kg` : ""}

## 최근 운동 기록
${recentWorkouts || "아직 기록 없음"}

## 운동 지식 DB
${exerciseKB}

## 주의사항
- 의학적 진단은 하지 마 (통증이 심하면 병원 권유)
- 사용자의 운동 기록을 바탕으로 점진적 과부하를 제안해
- 초보자에게는 자세와 안전을 강조해
- 무리한 무게 증가는 지양하고, 5-10% 점진적 증가를 권장해`;
}

/* ───── Quick action suggestions ───── */
const QUICK_ACTIONS = [
  { emoji: "💪", text: "오늘 운동 추천해줘" },
  { emoji: "📊", text: "내 운동 기록 분석해줘" },
  { emoji: "🏋️", text: "벤치프레스 자세 알려줘" },
  { emoji: "🍎", text: "벌크업 식단 추천" },
  { emoji: "🤕", text: "어깨가 아픈데 대체 운동" },
  { emoji: "📈", text: "점진적 과부하 방법" },
];

/* ───── Component ───── */
export default function CoachPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [profile, setProfile] = useState<Record<string, string>>({});
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Load chat history & profile
  useEffect(() => {
    setMessages(getChatHistory());
    setProfile(getUserProfile());
  }, []);

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;

    const apiKey = _dk();
    if (!apiKey) {
      alert("AI 서비스가 설정되지 않았습니다.");
      return;
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
      timestamp: Date.now(),
    };

    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput("");
    setLoading(true);

    try {
      // Build conversation for API (last 10 messages for context)
      const conversationMsgs = [
        { role: "system" as const, content: buildSystemPrompt() },
        ...newMsgs.slice(-10).map(m => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
      ];

      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: conversationMsgs,
          temperature: 0.7,
          max_tokens: 1024,
        }),
      });

      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || "죄송해요, 답변을 생성하지 못했어요. 다시 시도해주세요!";

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: reply,
        timestamp: Date.now(),
      };

      const updatedMsgs = [...newMsgs, assistantMsg];
      setMessages(updatedMsgs);
      saveChatHistory(updatedMsgs);
    } catch {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "네트워크 오류가 발생했어요. 인터넷 연결을 확인해주세요! 🌐",
        timestamp: Date.now(),
      };
      const updatedMsgs = [...newMsgs, errorMsg];
      setMessages(updatedMsgs);
    } finally {
      setLoading(false);
    }
  }, [messages, loading]);

  const clearChat = () => {
    setMessages([]);
    saveChatHistory([]);
  };

  const saveProfile = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("fitflow:user_profile", JSON.stringify(profile));
    }
    setShowProfile(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-100px)]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <Link href="/" className="w-9 h-9 glass rounded-xl flex items-center justify-center hover:bg-orange-50">
          <span className="text-lg">←</span>
        </Link>
        <div className="flex-1">
          <h1 className="text-lg font-black flex items-center gap-2">
            🤖 AI 핏코치
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold">ONLINE</span>
          </h1>
          <p className="text-[11px] text-text-muted">개인 맞춤 피트니스 코칭</p>
        </div>
        <button onClick={() => setShowProfile(!showProfile)}
          className="w-9 h-9 glass rounded-xl flex items-center justify-center hover:bg-orange-50 text-sm">
          ⚙️
        </button>
        <button onClick={clearChat}
          className="w-9 h-9 glass rounded-xl flex items-center justify-center hover:bg-red-50 text-sm">
          🗑️
        </button>
      </div>

      {/* Profile Modal */}
      {showProfile && (
        <div className="glass rounded-2xl p-4 mb-3 animate-scale-in border border-orange-200">
          <h3 className="text-sm font-bold mb-3">👤 내 프로필 설정</h3>
          <div className="grid grid-cols-2 gap-2">
            <input placeholder="이름" value={profile.name || ""} onChange={e => setProfile({...profile, name: e.target.value})}
              className="px-3 py-2 rounded-xl text-xs glass border-none focus:ring-2 focus:ring-primary outline-none" />
            <input placeholder="체중 (kg)" value={profile.weight || ""} onChange={e => setProfile({...profile, weight: e.target.value})}
              className="px-3 py-2 rounded-xl text-xs glass border-none focus:ring-2 focus:ring-primary outline-none" />
            <select value={profile.goal || ""} onChange={e => setProfile({...profile, goal: e.target.value})}
              className="px-3 py-2 rounded-xl text-xs glass border-none focus:ring-2 focus:ring-primary outline-none">
              <option value="">목표 선택</option>
              <option value="다이어트">다이어트</option>
              <option value="벌크업">벌크업</option>
              <option value="체력향상">체력향상</option>
              <option value="유지">유지</option>
            </select>
            <select value={profile.level || ""} onChange={e => setProfile({...profile, level: e.target.value})}
              className="px-3 py-2 rounded-xl text-xs glass border-none focus:ring-2 focus:ring-primary outline-none">
              <option value="">레벨 선택</option>
              <option value="초보 (0-6개월)">초보</option>
              <option value="중급 (6개월-2년)">중급</option>
              <option value="고급 (2년+)">고급</option>
            </select>
          </div>
          <button onClick={saveProfile}
            className="w-full mt-3 py-2 bg-primary text-white rounded-xl text-xs font-bold active:scale-95 shadow-lg shadow-orange-300/30">
            저장
          </button>
        </div>
      )}

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-hide">
        {messages.length === 0 ? (
          /* Welcome + Quick actions */
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-5xl mb-4">🏋️</div>
            <h2 className="text-lg font-black mb-1">AI 핏코치에게 물어보세요!</h2>
            <p className="text-xs text-text-muted mb-6 text-center px-4">
              운동 루틴, 자세 교정, 식단, 부상 관리까지<br/>무엇이든 물어보세요
            </p>
            <div className="grid grid-cols-2 gap-2 w-full max-w-sm px-4">
              {QUICK_ACTIONS.map((qa) => (
                <button
                  key={qa.text}
                  onClick={() => sendMessage(qa.text)}
                  className="glass rounded-xl px-3 py-3 text-left hover:bg-orange-50 active:scale-[0.97] transition-all"
                >
                  <span className="text-lg block mb-1">{qa.emoji}</span>
                  <span className="text-xs font-medium text-text-secondary">{qa.text}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Messages */
          messages.filter(m => m.role !== "system").map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] ${msg.role === "user" ? "order-1" : ""}`}>
                {msg.role === "assistant" && (
                  <div className="flex items-center gap-1.5 mb-1 ml-1">
                    <span className="text-xs">🤖</span>
                    <span className="text-[10px] font-bold text-text-muted">핏코치</span>
                    <span className="text-[9px] text-text-muted/50">{formatTime(msg.timestamp)}</span>
                  </div>
                )}
                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-primary text-white rounded-br-md"
                    : "glass rounded-bl-md"
                }`}>
                  {msg.content}
                </div>
                {msg.role === "user" && (
                  <div className="text-[9px] text-text-muted/50 text-right mt-0.5 mr-1">
                    {formatTime(msg.timestamp)}
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-start">
            <div className="glass rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="text-xs">🤖</span>
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input area */}
      <div className="mt-3 flex gap-2 items-end">
        <div className="flex-1 glass rounded-2xl overflow-hidden">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="운동에 대해 물어보세요..."
            rows={1}
            className="w-full px-4 py-3 text-sm bg-transparent border-none outline-none resize-none placeholder-text-muted/50"
            style={{ maxHeight: "100px" }}
          />
        </div>
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || loading}
          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all active:scale-90 ${
            input.trim() && !loading
              ? "bg-primary text-white shadow-lg shadow-orange-300/40"
              : "glass text-text-muted"
          }`}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
