import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/dashboard",
        destination: "/dashboard/interviews",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
