import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // 👈 This single line allows images from ANY website
      },
    ],
  },
  experimental: {
    turbo: {
      resolveAlias: {
        "zod/v3": "zod",
      },
    },
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "zod/v3": "zod",
    };
    return config;
  },
};

export default nextConfig;
