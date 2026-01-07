// pages/api/debates/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../db';
import { debates } from '../../../db/schema';
import { desc } from 'drizzle-orm';
import { 
  isValidYouTubeVideoId, 
  isValidImageUrl, 
  getAllowedImageHostnames 
} from '../../../lib/url-validation';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // === GET: Fetch All Debates ===
  if (req.method === 'GET') {
    try {
      // 🟢 Simply fetch from the single table
      const allDebates = await db
        .select()
        .from(debates)
        .orderBy(desc(debates.createdAt));

      // Return raw data (the arguments are already strings in the new schema)
      return res.status(200).json(allDebates);
    } catch (error) {
      console.error('Error fetching debates:', error);
      return res.status(500).json({ error: 'Failed to fetch debates' });
    }
  }

  // === POST: Create New Debate ===
  if (req.method === 'POST') {
    try {
      const data = req.body;

      // 1. Validate Required Fields
      if (!data.title || !data.slug || !data.category) {
        return res.status(400).json({ 
          error: 'Missing required fields: title, slug, and category are required' 
        });
      }

      // 2. Validate URL fields to prevent SSRF attacks
      if (data.youtubeVideoId && !isValidYouTubeVideoId(data.youtubeVideoId)) {
        return res.status(400).json({
          error: 'Invalid YouTube video ID. Must be exactly 11 characters (alphanumeric, dash, or underscore).'
        });
      }

      if (data.mainImageUrl && !isValidImageUrl(data.mainImageUrl)) {
        return res.status(400).json({
          error: `Invalid image URL. Only HTTPS URLs from trusted hosts are allowed: ${getAllowedImageHostnames().join(', ')}`
        });
      }

      // 3. Insert (No Transaction Needed anymore)
      const [newDebate] = await db.insert(debates).values({
        title: data.title,
        slug: data.slug,
        category: data.category, // was 'topic'
        summary: data.summary,
        
        // 🟢 New Merged Columns
        proposerName: data.proposerName || 'Proposer',
        proposerArguments: data.proposerArguments || '', // HTML String
        
        opposerName: data.opposerName || 'Opposer',
        opposerArguments: data.opposerArguments || '', // HTML String
        
        youtubeVideoId: data.youtubeVideoId || null,
        mainImageUrl: data.mainImageUrl || null,
        
        // Map 'status' to boolean if needed, or expect boolean from frontend
        isPublished: data.isPublished ?? (data.status === 'published'),
      })
      .returning();

      return res.status(201).json({
        message: 'Debate created successfully',
        debate: newDebate
      });

    } catch (error: unknown) {
      console.error('Error creating debate:', error);
      
      // Handle Unique Constraint (Slug collision)
      if (error && typeof error === 'object' && 'code' in error && error.code === '23505') {
         return res.status(409).json({ error: 'A debate with this slug already exists.' });
      }
      return res.status(500).json({ error: 'Failed to create debate' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}