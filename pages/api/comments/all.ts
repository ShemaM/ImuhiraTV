import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../db';
import { comments } from '../../../db/schema';
import { desc } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end();

  try {
    // 🟢 Drizzle "Query" API is perfect for fetching relations
    const allComments = await db.query.comments.findMany({
      orderBy: [desc(comments.createdAt)],
      with: {
        debate: {
          columns: {
            title: true,
            slug: true,
          }
        }
      },
      limit: 50, // Limit to recent 50 for performance
    });

    return res.status(200).json(allComments);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch admin comments' });
  }
}