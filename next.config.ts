import type { NextConfig } from "next";
import i18nextConfig from "./next-i18next.config.js";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  i18n: i18nextConfig.i18n,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.youtube.com",
        port: "",
        pathname: "/vi/**",
      },
    ],
  },
};

export default nextConfig;
