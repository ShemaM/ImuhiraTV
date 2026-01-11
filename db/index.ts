import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL;

// Only initialize the client when a connection string is provided
let dbInstance: ReturnType<typeof drizzle> | null = null;
if (connectionString) {
  const client = postgres(connectionString, { 
    prepare: false,
    connect_timeout: 10 
  });
  dbInstance = drizzle(client, { schema });
} else if (process.env.NODE_ENV === 'production') {
  console.warn('⚠️ DATABASE_URL is not defined. Database queries will fail at runtime.');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const db = dbInstance as any;
export * from './schema';
