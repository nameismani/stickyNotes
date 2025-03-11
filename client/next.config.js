/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your existing Next.js config here
  reactStrictMode: true,
  // Define environment variables with fallbacks
  env: {
    // Default values for critical environment variables
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || "https://your-api-url.com",
    SECRET_KEY: process.env.SECRET_KEY || "default-secret-key-for-development",
    // Add other environment variables as needed
  },
};

module.exports = nextConfig;
