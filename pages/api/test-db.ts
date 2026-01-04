// pages/api/test-db.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../db'; // Adjust this path to point to your db configuration
import { sql } from 'drizzle-orm';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // 1. Run a raw SQL query "SELECT 1" - the standard way to ping a DB
    // This bypasses schemas/tables to just test the network connection
    const result = await db.execute(sql`SELECT 1 as "connection_test"`);

    return res.status(200).json({ 
      status: 'success', 
      message: 'Database connection is healthy 🟢', 
      timestamp: new Date().toISOString(),
      queryResult: result 
    });

  } catch (error: unknown) {
    console.error('Database Connection Failed:', error);
    
    return res.status(500).json({ 
      status: 'error', 
      message: 'Database connection failed 🔴',
      error: error instanceof Error ? error.message : 'Unknown error', // This will tell us if it's a password/host issue
    });
  }
}