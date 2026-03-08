"use client";

import { useState, useEffect } from "react";
import { hasAccess, getTrialDaysLeft, isLoggedIn, getUser, logout } from "@/lib/auth";
import Link from "next/link";

export function TrialBanner() {
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [user, setUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    setDaysLeft(getTrialDaysLeft());
    setUser(getUser());
  }, []);

  if (daysLeft === null) return null;

  // Logged in user - show welcome
  if (user) {
    return (
      <div className="flex items-center justify-between glass rounded-xl px-4 py-2.5 mb-4">
        <span className="text-xs font-medium text-text-muted">
          👋 <span className="font-bold text-text">{user.name}</span>님 환영합니다
        </span>
        <button
          onClick={() => { logout(); window.location.reload(); }}
          className="text-[10px] text-text-muted hover:text-red-500 font-medium"
        >
          로그아웃
        </button>
      </div>
    );
  }

  // Trial active
  if (daysLeft > 0) {
    return (
      <div className="flex items-center justify-between glass rounded-xl px-4 py-2.5 mb-4">
        <span className="text-xs text-text-muted">
          🎁 무료 체험 <span className="font-bold text-primary">{daysLeft}일</span> 남음
        </span>
        <Link
          href="/auth"
          className="text-[10px] bg-primary text-white px-3 py-1 rounded-lg font-semibold hover:bg-primary-dark"
        >
          회원가입
        </Link>
      </div>
    );
  }

  return null;
}

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [access, setAccess] = useState<boolean | null>(null);

  useEffect(() => {
    setAccess(hasAccess());
  }, []);

  // Loading
  if (access === null) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Has access (logged in or trial active)
  if (access) return <>{children}</>;

  // Trial expired - must sign up
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6 animate-slide-up">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-100 to-amber-50 flex items-center justify-center mb-6">
        <span className="text-4xl">🔒</span>
      </div>
      <h2 className="text-2xl font-black mb-2">체험 기간 만료</h2>
      <p className="text-sm text-text-muted mb-2 leading-relaxed">
        7일 무료 체험이 끝났습니다.<br />
        계속 사용하려면 무료 회원가입을 해주세요!
      </p>
      <p className="text-xs text-text-muted/70 mb-8">
        회원가입은 무료이며, 모든 기능을 이용할 수 있습니다.
      </p>
      <div className="flex gap-3">
        <Link
          href="/auth"
          className="px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-sm shadow-lg shadow-orange-300/30 active:scale-[0.97]"
        >
          무료 회원가입
        </Link>
        <Link
          href="/auth?mode=login"
          className="px-6 py-3 glass rounded-xl font-semibold text-sm hover:bg-orange-50 active:scale-[0.97]"
        >
          로그인
        </Link>
      </div>
    </div>
  );
}
