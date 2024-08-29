import { defineConfig } from 'drizzle-kit'
import dotenv from 'dotenv';

dotenv.config()

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  driver:'pg',
  dbCredentials: {
    connectionString: process.env.DB_URL as string
  },
  tablesFilter: ["pesu_research_*"],
});