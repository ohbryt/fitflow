"use client";

import { usePathname } from "next/navigation";
import { AuthGate, TrialBanner } from "./AuthGate";

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Auth page itself should always be accessible
  const isAuthPage = pathname === "/auth" || pathname?.startsWith("/auth");

  if (isAuthPage) return <>{children}</>;

  return (
    <AuthGate>
      <TrialBanner />
      {children}
    </AuthGate>
  );
}
