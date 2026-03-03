import type { Metadata, Viewport } from "next";
import "./globals.css";
import { BottomNav } from "./components/BottomNav";

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
  themeColor: "#0f172a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen pb-20">
        <main className="max-w-lg mx-auto px-4 pt-6">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
