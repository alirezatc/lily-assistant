import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;
// Lazy/guarded so the app can build without a DB during early scaffolding.
const client = connectionString ? postgres(connectionString) : undefined;
export const db = client ? drizzle(client, { schema }) : (undefined as any);
export { schema };
