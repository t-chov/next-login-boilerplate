import * as schema from "@repo/db/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const connectionString =
  process.env.DATABASE_URL || "postgresql://postgres:password@localhost:25432/gibbon_writer";
const client = postgres(connectionString);
const db = drizzle(client, { schema });

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:13200",
  secret: process.env.BETTER_AUTH_SECRET || "default-secret-key",
});
