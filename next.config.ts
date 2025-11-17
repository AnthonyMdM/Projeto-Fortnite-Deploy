import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fortnite-api.com",
        pathname: "/**", // permite todas as rotas de imagem
      },
      {
        protocol: "https",
        hostname: "cdn.fortnite-api.com",
        pathname: "/**", // permite todas as rotas de imagem
      },
    ],
  },
};

export default nextConfig;
