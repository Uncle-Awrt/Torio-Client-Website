import fs from "node:fs";
import type { NextConfig } from "next";

// Docs are local-only until finished (public-docs.json is gitignored), so CI builds hide them.
const docsEnabled = fs.existsSync("data/public-docs.json");

// Served from the root of a custom domain, so no basePath is needed.
const basePath = "";

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
    NEXT_PUBLIC_DOCS_ENABLED: docsEnabled ? "1" : "",
  },
};

export default nextConfig;