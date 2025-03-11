/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    // Default values for critical environment variables
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL ||
      "https://sticky-notes-server-blue.vercel.app",
    NEXTAUTH_URL:
      process.env.NEXTAUTH_URL || "https://sticky-notes-client.vercel.app",
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "your-nextauth-secret",
    SECRET_KEY: process.env.SECRET_KEY || "your-jwt-secret-key",
  },
  // Optional: Add any other Next.js configuration options here
};

module.exports = nextConfig;
