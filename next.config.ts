import type { NextConfig } from "next";

const repoBase = process.env.VERCEL ? "" : "/HotelManagment-WebAPI";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_BASE_PATH: repoBase,
  },
  output: "export",
  trailingSlash: true,
  basePath: repoBase,
  assetPrefix: repoBase,
  images: {
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
  },
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
