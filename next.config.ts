import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // 👈 esto evita que Vercel bloquee el build por errores de ESLint
  },
  images: {
    domains: ['placehold.co'], // 👈 aquí mantienes tu configuración de imágenes
  },
};

export default nextConfig;
