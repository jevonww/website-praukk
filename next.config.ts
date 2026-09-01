import type { NextConfig } from "next";

const API_URL = process.env.API_URL ?? "http://192.168.1.2:4000";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["localhost", "127.0.0.1", "*.ngrok-free.app", "*.ngrok.io"],
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `http://localhost:4000/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
