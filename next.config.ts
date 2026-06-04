import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: ["127.0.0.1"],
  async redirects() {
    return [
      {
        source: "/",
        destination: "/zh",
        permanent: true
      }
    ];
  },
  images: {
    localPatterns: [
      {
        pathname: "/api/media"
      }
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      },
      {
        protocol: "https",
        hostname: "mist-architects-media.oss-cn-shenzhen.aliyuncs.com"
      }
    ]
  }
};

export default nextConfig;
