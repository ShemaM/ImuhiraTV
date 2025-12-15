// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

// Use 'globalThis' which works better in modern Node environments
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// We pass explicit options ({}) to satisfy the strict initialization check
// We also add logging so you can see queries in your terminal (helpful for debugging)
export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: ['query', 'error', 'warn'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;