import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  
  /* config options here */
  eslint: {
    // Ignore ESLint during builds (you can run it separately)
    ignoreDuringBuilds: true,
    // Directories/files to ignore
    dirs: ['**/*.stories.tsx', '.storybook', 'storybook-static']
  }
};

export default nextConfig;
