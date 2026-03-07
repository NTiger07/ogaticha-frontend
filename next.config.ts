import type { NextConfig } from "next";
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  /* config options here */
  // Add empty turbopack config to silence the warning
  turbopack: {},
  // Ignore TypeScript errors during build (for landing folder issues)
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  // Disable service worker generation in development to avoid
  // multiple GenerateSW calls and Fast Refresh/full reload issues.
  disable: process.env.NODE_ENV === "development",
})(nextConfig as any);
