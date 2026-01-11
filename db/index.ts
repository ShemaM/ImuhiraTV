import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL;

// 1. Safe client initialization
// We use a fallback string or check during runtime instead of throwing at the top level
const client = postgres(connectionString || '', { 
  prepare: false,
  // Optional: adds a small timeout so the build doesn't hang if the DB is unreachable
  connect_timeout: 10 
});

export const db = drizzle(client, { schema });
export * from './schema';

// 2. Log a warning instead of throwing an error
if (!connectionString && process.env.NODE_ENV === 'production') {
  console.warn('⚠️ DATABASE_URL is not defined. Database queries will fail at runtime.');
}