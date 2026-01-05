// pages/api/comments/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../db';
import { comments } from '../../../db/schema';
import { eq, desc } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  
  // GET: Fetch all comments for a debate
  if (req.method === 'GET') {
    const { debateId } = req.query;

    if (!debateId || typeof debateId !== 'string') {
      return res.status(400).json({ error: 'Missing debateId' });
    }

    try {
      const allComments = await db
        .select()
        .from(comments)
        .where(eq(comments.debateId, debateId))
        .orderBy(desc(comments.createdAt));

      return res.status(200).json(allComments);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to fetch comments' });
    }
  }

  // POST: Create a new comment OR reply
  if (req.method === 'POST') {
    const { debateId, parentId, authorName, content } = req.body;

    if (!debateId || !authorName || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const [newComment] = await db.insert(comments).values({
        debateId,
        parentId: parentId || null, // If parentId is sent, it's a reply
        authorName,
        content,
        likes: 0,
      }).returning();

      return res.status(201).json(newComment);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to post comment' });
    }
  }

  return res.status(405).end();
}