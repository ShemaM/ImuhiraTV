// pages/api/comments/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../db';
import { comments } from '../../../db/schema';
import { eq, sql } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid ID' });
  }
  
  // PATCH: Increment Likes
  if (req.method === 'PATCH') {
    try {
      await db.update(comments)
        .set({ likes: sql`${comments.likes} + 1` })
        .where(eq(comments.id, id));
        
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to like comment' });
    }
  }

  // 🟢 NEW: DELETE Comment
  if (req.method === 'DELETE') {
    try {
      await db.delete(comments).where(eq(comments.id, id));
      return res.status(200).json({ message: 'Comment deleted' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to delete comment' });
    }
  }

  return res.status(405).end();
}