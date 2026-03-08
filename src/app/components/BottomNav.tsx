"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "홈", icon: "home" },
  { href: "/videos", label: "영상", icon: "video" },
  { href: "/plans", label: "플랜", icon: "plan" },
  { href: "/exercises", label: "운동", icon: "dumbbell" },
  { href: "/coach", label: "코치", icon: "coach" },
];

const icons: Record<string, (active: boolean) => React.ReactNode> = {
  home: (active) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-[20px] h-[20px]" fill={active ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z" />
    </svg>
  ),
  dumbbell: (active) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-[20px] h-[20px]" fill={active ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h2v10H4zM18 7h2v10h-2zM6 9h2v6H6zM16 9h2v6h-2zM8 11h8v2H8z" />
    </svg>
  ),
  coach: (active) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-[20px] h-[20px]" fill={active ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
  ),
  video: (active) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-[20px] h-[20px]" fill={active ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  plan: (active) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-[20px] h-[20px]" fill={active ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  ),
};

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-lg mx-auto pt-[env(safe-area-inset-top)]" style={{ background: "rgba(10, 10, 11, 0.85)", backdropFilter: "blur(32px) saturate(1.5)", WebkitBackdropFilter: "blur(32px) saturate(1.5)" }}>
        {/* Top accent line */}
        <div className="h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="flex justify-around items-center h-[52px] px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex flex-col items-center justify-center gap-[3px] w-14 h-11 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "text-primary"
                    : "text-zinc-500 hover:text-zinc-300 active:scale-95"
                }`}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-primary/[0.08] rounded-xl" />
                )}
                {isActive && (
                  <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-6 h-[2px] rounded-full bg-primary shadow-[0_0_8px_rgba(255,107,43,0.5)]" />
                )}
                <span className="relative z-10">{icons[item.icon](isActive)}</span>
                <span className={`relative z-10 text-[9px] font-semibold tracking-wide ${
                  isActive ? "text-primary" : ""
                }`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
        {/* Bottom border */}
        <div className="h-[1px] bg-white/[0.04]" />
      </div>
    </nav>
  );
}
