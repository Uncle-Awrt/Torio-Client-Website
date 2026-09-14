import type { NextConfig } from "next";

const basePath = process.env.NODE_ENV === "production" ? "/Torio-Client-Website" : "";

const nextConfig: NextConfig = {
  devIndicators: false,
  output: "export",
  basePath,
  assetPrefix: basePath ? `${basePath}/` : "",
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;