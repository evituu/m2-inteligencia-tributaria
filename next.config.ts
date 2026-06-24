import type { NextConfig } from "next";

const r2PublicUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL ?? "";
const r2Hostname = r2PublicUrl ? new URL(r2PublicUrl).hostname : "";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: r2Hostname
      ? [{ protocol: "https", hostname: r2Hostname }]
      : [],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },
};

// middlewareClientMaxBodySize is a Next.js 16 route-handler body limit config
// not yet reflected in the NextConfig type definition
export default {
  ...nextConfig,
  middlewareClientMaxBodySize: 100 * 1024 * 1024,
};
