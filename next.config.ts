import type { NextConfig } from "next";

const API_URL = process.env.API_URL ?? "http://localhost:4000";

const nextConfig: NextConfig = {
  // Properti ini memerlukan protokol dan port lengkap (misal: http://...)
  // Gunakan IP Wi-Fi laptop Anda (192.168.1.63) agar HP diizinkan mengakses
  allowedDevOrigins: ["http://192.168.1.63:3000", "192.168.1.2"],
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
