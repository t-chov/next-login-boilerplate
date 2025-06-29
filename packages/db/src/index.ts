import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema/index.js";

const connectionString = process.env.DATABASE_URL || "postgresql://localhost:5432/gibbon_writer";

const client = postgres(connectionString);
export const db = drizzle(client, { schema });

export * from "./schema/index.js";
export type { InferSelectModel, InferInsertModel } from "drizzle-orm";