import type { Metadata, Viewport } from "next";
import "./globals.css";
import { BottomNav } from "./components/BottomNav";
import { AuthWrapper } from "./components/AuthWrapper";

export const metadata: Metadata = {
  title: "FitFlow - 스마트 운동 트래커",
  description: "나만의 운동 루틴을 만들고, 기록하고, 성장하세요.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "FitFlow",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0a0a0b",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen">
        <BottomNav />
        <main className="max-w-lg mx-auto px-4 pt-[calc(52px+env(safe-area-inset-top)+16px)] pb-8">
          <AuthWrapper>{children}</AuthWrapper>
        </main>
        {/* Footer */}
        <footer className="text-center py-6 pb-8 text-xs text-text-muted/60 font-medium tracking-wide">
          © {new Date().getFullYear()} Brown Bioteck Inc.
        </footer>
      </body>
    </html>
  );
}
