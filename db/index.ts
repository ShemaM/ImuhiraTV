import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL;

type DbType = ReturnType<typeof drizzle<typeof schema>>;

let dbInstance: DbType | null = null;
if (connectionString) {
  const client = postgres(connectionString, { prepare: false, connect_timeout: 10 });
  dbInstance = drizzle(client, { schema });
} else if (process.env.NODE_ENV === 'production') {
  console.warn('⚠️ DATABASE_URL is not defined. Database queries will fail at runtime.');
}

export const db: DbType | null = dbInstance;
export * from './schema';
