const path = require("path");
const fs = require("fs");
const { parse } = require("dotenv");

// Load env from parent directory
const loadEnvFromParent = () => {
  try {
    const envPath = path.resolve(__dirname, "../.env");
    const envConfig = parse(fs.readFileSync(envPath));

    // Add parsed variables to process.env
    for (const k in envConfig) {
      process.env[k] = envConfig[k];
    }
  } catch (error) {
    console.warn("Could not load parent .env file", error);
  }
};

// Load env before Next.js config runs
loadEnvFromParent();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your existing Next.js config here
  reactStrictMode: true,
  // Other config options...
};

module.exports = nextConfig;
