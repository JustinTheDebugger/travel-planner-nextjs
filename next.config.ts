import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "r3d0m5hz6t.ufs.sh",
      },
    ],
  },
};

export default nextConfig;
