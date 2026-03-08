"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signup, login, isLoggedIn, getTrialDaysLeft } from "@/lib/auth";

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [daysLeft, setDaysLeft] = useState(7);

  useEffect(() => {
    if (isLoggedIn()) router.replace("/");
    if (searchParams.get("mode") === "login") setMode("login");
    setDaysLeft(getTrialDaysLeft());
  }, [router, searchParams]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (mode === "signup") {
      if (password !== confirm) { setError("비밀번호가 일치하지 않습니다."); return; }
      const res = signup(email, name, password);
      if (!res.ok) { setError(res.error || "가입 실패"); return; }
    } else {
      const res = login(email, password);
      if (!res.ok) { setError(res.error || "로그인 실패"); return; }
    }

    router.replace("/");
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center animate-slide-up">
      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-orange-300/40">
          <span className="text-white text-2xl font-black">F</span>
        </div>
        <h1 className="text-2xl font-black gradient-text">FitFlow</h1>
        <p className="text-xs text-text-muted mt-1">스마트 운동 가이드 & 트래커</p>
      </div>

      {/* Trial info */}
      {daysLeft > 0 && mode === "signup" && (
        <div className="glass rounded-xl px-4 py-2.5 mb-5 text-center">
          <p className="text-xs text-text-muted">
            🎁 무료 체험 <span className="font-bold text-primary">{daysLeft}일</span> 남음 · 회원가입하면 무제한!
          </p>
        </div>
      )}
      {daysLeft <= 0 && (
        <div className="bg-red-50 rounded-xl px-4 py-2.5 mb-5 text-center border border-red-200">
          <p className="text-xs text-red-600 font-medium">
            ⏰ 체험 기간이 만료되었습니다. {mode === "signup" ? "가입하여" : "로그인하여"} 계속 이용하세요!
          </p>
        </div>
      )}

      {/* Mode tabs */}
      <div className="flex w-full max-w-xs glass rounded-xl p-1 mb-5">
        <button
          onClick={() => { setMode("signup"); setError(""); }}
          className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${mode === "signup" ? "bg-primary text-white shadow" : "text-text-muted"}`}
        >
          회원가입
        </button>
        <button
          onClick={() => { setMode("login"); setError(""); }}
          className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${mode === "login" ? "bg-primary text-white shadow" : "text-text-muted"}`}
        >
          로그인
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-3">
        {mode === "signup" && (
          <div>
            <label className="text-xs font-semibold text-text-muted mb-1 block">이름</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="이름 입력"
              className="w-full px-4 py-3 glass rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-text-muted/50"
              required
            />
          </div>
        )}

        <div>
          <label className="text-xs font-semibold text-text-muted mb-1 block">이메일</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="email@example.com"
            className="w-full px-4 py-3 glass rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-text-muted/50"
            required
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-text-muted mb-1 block">비밀번호</label>
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="비밀번호 입력"
              className="w-full px-4 py-3 glass rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-text-muted/50 pr-12"
              required
              minLength={4}
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted text-xs"
            >
              {showPw ? "숨김" : "보기"}
            </button>
          </div>
        </div>

        {mode === "signup" && (
          <div>
            <label className="text-xs font-semibold text-text-muted mb-1 block">비밀번호 확인</label>
            <input
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="비밀번호 재입력"
              className="w-full px-4 py-3 glass rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-text-muted/50"
              required
              minLength={4}
            />
          </div>
        )}

        {error && (
          <p className="text-xs text-red-500 font-medium text-center bg-red-50 rounded-lg py-2">{error}</p>
        )}

        <button
          type="submit"
          className="w-full py-3.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-sm shadow-lg shadow-orange-300/30 active:scale-[0.97] transition-all mt-2"
        >
          {mode === "signup" ? "무료 가입하기" : "로그인"}
        </button>
      </form>

      {/* Footer note */}
      <p className="text-[10px] text-text-muted/60 mt-6 text-center leading-relaxed">
        가입은 완전 무료이며, 모든 기능을 이용할 수 있습니다.<br />
        데이터는 기기에 안전하게 저장됩니다.
      </p>

      <Link href="/" className="mt-4 text-xs text-text-muted hover:text-primary font-medium">
        ← 홈으로 돌아가기
      </Link>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
      <AuthForm />
    </Suspense>
  );
}
