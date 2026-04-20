import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: ["127.0.0.1"],
  async redirects() {
    return [
      {
        source: "/",
        destination: "/zh",
        permanent: false
      }
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      },
      {
        protocol: "https",
        hostname: "images.pexels.com"
      },
      {
        protocol: "https",
        hostname: "cdn.pixabay.com"
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io"
      },
      {
        protocol: "https",
        hostname: "mist-architects-media.oss-cn-shenzhen.aliyuncs.com"
      },
      {
        // Future CDN fronting the OSS bucket. Kept here so switching
        // to a production domain only requires flipping NEXT_PUBLIC_MEDIA_BASE.
        protocol: "https",
        hostname: "media.mistarchitects.com"
      }
    ]
  }
};

export default nextConfig;
