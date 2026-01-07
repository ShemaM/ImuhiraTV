// pages/api/debates/[id].ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { db, debates } from '../../../db';
import { eq } from 'drizzle-orm';
import { 
  isValidYouTubeVideoId, 
  isValidImageUrl, 
  getAllowedImageHostnames 
} from '../../../lib/url-validation';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  // 🟢 1. ID Validation: Check for string (UUID) instead of Number
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  // === DELETE ===
  if (req.method === 'DELETE') {
    try {
      // 🟢 Simply delete the debate. No need to delete arguments separately anymore.
      await db.delete(debates).where(eq(debates.id, id));
      
      return res.status(200).json({ message: 'Debate deleted' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to delete debate' });
    }
  }

  // === GET (For Edit Page) ===
  if (req.method === 'GET') {
    try {
      const result = await db.select().from(debates).where(eq(debates.id, id));
      
      if (result.length === 0) {
        return res.status(404).json({ error: 'Debate not found' });
      }
      
      // 🟢 Return the data directly. 
      // The frontend edit form should now expect 'proposerArguments' as a string, not an array.
      return res.status(200).json(result[0]);

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to fetch debate' });
    }
  }

  // === PUT (Update Debate) ===
  if (req.method === 'PUT') {
    try {
      // 🟢 Destructure the NEW schema fields from the request body
      const { 
        title, 
        slug, 
        category,        // was 'topic'
        summary, 
        
        proposerName,    // was 'faction1Label'
        opposerName,     // was 'faction2Label'
        
        proposerArguments, // now a single HTML string
        opposerArguments,  // now a single HTML string

        youtubeVideoId, 
        mainImageUrl, 
        isPublished      // was 'status'
      } = req.body;

      // 🔒 Validate URL fields to prevent SSRF attacks
      if (youtubeVideoId && !isValidYouTubeVideoId(youtubeVideoId)) {
        return res.status(400).json({
          error: 'Invalid YouTube video ID. Must be exactly 11 characters (alphanumeric, dash, or underscore).'
        });
      }

      if (mainImageUrl && !isValidImageUrl(mainImageUrl)) {
        return res.status(400).json({
          error: `Invalid image URL. Only HTTPS URLs from trusted hosts are allowed: ${getAllowedImageHostnames().join(', ')}`
        });
      }

      // 🟢 Update query - No transaction needed anymore!
      await db.update(debates)
        .set({
          title,
          slug,
          category,
          summary,
          proposerName,
          opposerName,
          proposerArguments,
          opposerArguments,
          youtubeVideoId: youtubeVideoId || null,
          mainImageUrl: mainImageUrl || null,
          isPublished,
          updatedAt: new Date(), // Always update the timestamp
        })
        .where(eq(debates.id, id));

      return res.status(200).json({ message: 'Updated successfully' });

    } catch (error) {
      console.error('Update Error:', error);
      return res.status(500).json({ error: 'Failed to update debate' });
    }
  }

  // Method Not Allowed
  return res.status(405).end();
}