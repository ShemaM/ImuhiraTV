import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL;
type DBClient = ReturnType<typeof drizzle>;

// Only initialize the client when a connection string is provided
let dbInstance: DBClient | null = null;
if (connectionString) {
  const client = postgres(connectionString, { 
    prepare: false,
    connect_timeout: 10 
  });
  dbInstance = drizzle(client, { schema });
} else if (process.env.NODE_ENV === 'production') {
  console.warn('⚠️ DATABASE_URL is not defined. Database queries will fail at runtime.');
}

const noopError = () => {
  throw new Error('Database is not configured. Please set DATABASE_URL.');
};

const createNoopDb = (): DBClient =>
  new Proxy({} as DBClient, {
    get() {
      return noopError as unknown as DBClient[keyof DBClient];
    },
  });

export const db: DBClient = dbInstance ?? createNoopDb();
export * from './schema';
