import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "ws",
    "bufferutil",
    "utf-8-validate",
    "@stream-io/node-sdk",
    "@stream-io/openai-realtime-api",
    "@stream-io/video-react-sdk"
  ],
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
