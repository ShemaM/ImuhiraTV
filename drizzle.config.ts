// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

// 🔴 WE ARE HARDCODING THIS TEMPORARILY TO BYPASS ENV ISSUES
// This URL uses Port 5432 (Direct) which allows "serial" types.
const DIRECT_URL = "postgresql://postgres.cjyzedldilwkfmitkrnw:lCLXmWZYlvHGOkvs@aws-1-eu-west-1.pooler.supabase.com:5432/postgres";

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: DIRECT_URL,
    ssl: true, // Direct connections to Supabase often require this
  },
});