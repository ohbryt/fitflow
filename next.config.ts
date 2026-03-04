import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/fitflow",
  images: { unoptimized: true },
};

export default nextConfig;
