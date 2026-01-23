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
  // Turbopack is enabled to keep parity with Next.js defaults while still allowing
  // the custom webpack aliases below. Remove this override once translations are restored.
  turbopack: {},
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
