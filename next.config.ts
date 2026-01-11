import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
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
  webpack: (config) => {
    config.resolve.alias["next-i18next"] = path.resolve(__dirname, "lib/noop-i18n.ts");
    config.resolve.alias["next-i18next/serverSideTranslations"] = path.resolve(
      __dirname,
      "lib/noop-serverSideTranslations.ts",
    );
    return config;
  },
};

export default nextConfig;
