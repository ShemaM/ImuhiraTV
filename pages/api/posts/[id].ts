// pages/api/posts/[id].ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../db';
import { articles } from '../../../db/schema';
import { eq } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  // ID Validation: Check for string (UUID)
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  // === DELETE ===
  if (req.method === 'DELETE') {
    try {
      await db.delete(articles).where(eq(articles.id, id));
      
      return res.status(200).json({ message: 'Article deleted' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to delete article' });
    }
  }

  // === GET (For Edit Page) ===
  if (req.method === 'GET') {
    try {
      const result = await db.select().from(articles).where(eq(articles.id, id));
      
      if (result.length === 0) {
        return res.status(404).json({ error: 'Article not found' });
      }
      
      return res.status(200).json(result[0]);

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to fetch article' });
    }
  }

  // === PUT (Update Article) ===
  if (req.method === 'PUT') {
    try {
      const { 
        title, 
        slug, 
        excerpt,
        content,
        coverImage,
        videoUrl,
        isPublished
      } = req.body;

      await db.update(articles)
        .set({
          title,
          slug,
          excerpt,
          content,
          coverImage,
          videoUrl,
          isPublished,
          updatedAt: new Date(),
        })
        .where(eq(articles.id, id));

      return res.status(200).json({ message: 'Updated successfully' });

    } catch (error) {
      console.error('Update Error:', error);
      return res.status(500).json({ error: 'Failed to update article' });
    }
  }

  // Method Not Allowed
  return res.status(405).end();
}
