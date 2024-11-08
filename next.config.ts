import type { NextConfig } from "next";

const nextConfig = {
  async redirects() {
    return [
      {
        source: '/login',
        destination: '/auth',
        permanent: true,
      },
    ]
  },
}

export default nextConfig;
