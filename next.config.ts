import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // Temporal: deshabilita optimización mientras se reducen las imágenes
  },
};

export default nextConfig;
