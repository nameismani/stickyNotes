const fs = require("fs");
const path = require("path");

// Copy .env from root to client
const rootEnvPath = path.resolve(__dirname, "../.env");
const clientEnvPath = path.resolve(__dirname, ".env.local");

try {
  const envContent = fs.readFileSync(rootEnvPath, "utf8");
  fs.writeFileSync(clientEnvPath, envContent);
  console.log("Successfully copied root .env to client/.env.local");
} catch (error) {
  console.error("Error copying environment file:", error);
}
