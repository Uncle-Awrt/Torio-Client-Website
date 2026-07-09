import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  output: "export",
  basePath: process.env.NODE_ENV === "production" ? "/Torio-Client-Website" : "",
  assetPrefix: process.env.NODE_ENV === "production" ? "/Torio-Client-Website/" : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;