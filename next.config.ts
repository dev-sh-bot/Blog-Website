import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { remotePatterns: [
    { protocol: "https", hostname: "images.unsplash.com" },
    { protocol: "https", hostname: "firebasestorage.googleapis.com" },
    { protocol: "https", hostname: "storage.googleapis.com" },
    { protocol: "https", hostname: "*.appspot.com" },
    { protocol: "https", hostname: "*.firebasestorage.app" },
    { protocol: "http", hostname: "127.0.0.1", port: "9199" },
    { protocol: "http", hostname: "localhost", port: "9199" },
  ] },
  poweredByHeader: false,
};

export default nextConfig;
