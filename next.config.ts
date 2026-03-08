import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "export",  // Capacitor 빌드 시 활성화
  images: { unoptimized: true },
};

export default nextConfig;
