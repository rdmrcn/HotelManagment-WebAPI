import type { NextConfig } from "next";

const repoBase = "/HotelManagment-WebAPI";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: repoBase,
  assetPrefix: repoBase,
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
