import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    // Handle Supabase realtime-js critical dependency warnings
    config.ignoreWarnings = [
      {
        module: /node_modules\/@supabase\/realtime-js/,
        message: /Critical dependency: the request of a dependency is an expression/,
      },
      {
        module: /node_modules\/@supabase\/realtime-js\/dist\/main\/RealtimeClient\.js/,
        message: /Critical dependency: the request of a dependency is an expression/,
      },
      // Ignore all critical dependency warnings from Supabase realtime
      (warning: any) => {
        return warning.message.includes('Critical dependency') &&
               warning.module &&
               warning.module.includes('@supabase/realtime-js');
      },
    ];

    // Add fallbacks for Node.js modules in client-side bundles
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        util: false,
        buffer: false,
        events: false,
        path: false,
        os: false,
      };
    }

    return config;
  },
  // External packages for server components (moved from experimental in Next.js 15)
  serverExternalPackages: ['@supabase/supabase-js'],
};

export default nextConfig;
