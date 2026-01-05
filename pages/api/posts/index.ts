import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../db'; // Adjust this path if needed
import { articles } from '../../../db/schema'; // We are importing the NEW table
import { desc, eq } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  
  // --- POST: Create a New Article ---
  if (req.method === 'POST') {
    try {
      const { title, slug, excerpt, content, coverImage, videoUrl, isPublished } = req.body;

      // 1. Validation
      if (!title || !slug || !content) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // 2. Check for duplicate slug
      const existing = await db
        .select({ slug: articles.slug })
        .from(articles)
        .where(eq(articles.slug, slug))
        .limit(1);

      if (existing.length > 0) {
        return res.status(409).json({ message: 'Slug already exists' });
      }

      // 3. Insert into the 'articles' table
      const [newPost] = await db.insert(articles).values({
        title,
        slug,
        excerpt,
        content,
        coverImage,
        videoUrl, // <--- Saving the YouTube URL here
        isPublished: isPublished || false,
      }).returning();

      return res.status(201).json(newPost);

    } catch (error) {
      console.error('Error creating post:', error);
      return res.status(500).json({ message: 'Error creating post' });
    }
  }

  // --- GET: Fetch All Articles ---
  else if (req.method === 'GET') {
    try {
      const allPosts = await db
        .select()
        .from(articles)
        .orderBy(desc(articles.createdAt));
      
      return res.status(200).json(allPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      return res.status(500).json({ message: 'Error fetching posts' });
    }
  } 
  
  else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}