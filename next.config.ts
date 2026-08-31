import type { NextConfig } from "next";

const API_URL = process.env.API_URL ?? "http://192.168.1.2:4000";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.2"],
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
