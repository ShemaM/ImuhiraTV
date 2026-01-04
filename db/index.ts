import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Ensure the connection string is available
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined');
}

// Disable prefetch/prepared statements for Supabase Transaction Pooler
const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema });
export * from './schema';
 