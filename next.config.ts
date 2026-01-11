import type { NextConfig } from "next";

// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
const i18nextConfig = require("./next-i18next.config.js");

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
