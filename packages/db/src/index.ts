import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema/index.js";

const connectionString =
  process.env.DATABASE_URL || "postgresql://localhost:25432/next_login_boilerplate";

const client = postgres(connectionString);
export const db = drizzle(client, { schema });

export type { InferInsertModel, InferSelectModel } from "drizzle-orm";
export * from "./schema/index.js";
