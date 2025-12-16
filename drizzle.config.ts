import { defineConfig } from "drizzle-kit";

// ⚠️ We are hardcoding the URL temporarily to bypass the cache issue
const FORCE_URL = "postgres://postgres.cjyzedldilwkfmitkrnw:DailyPulse2025@aws-0-eu-west-1.pooler.supabase.com:6543/postgres";

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: FORCE_URL,
    // This ignores the SSL error
    ssl: { rejectUnauthorized: false }
  },
});