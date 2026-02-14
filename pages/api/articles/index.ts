import { NextApiRequest, NextApiResponse } from 'next';
import { articles } from '../../../db/schema';
import { desc, eq } from 'drizzle-orm';

const DEFAULT_AUTHOR = 'Imuhira Staff';
const DEFAULT_CATEGORY = { name: 'News', href: '/category/news' };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Return empty array if database is not configured
    if (!process.env.DATABASE_URL) {
      return res.status(200).json([]);
    }

    try {
      // Dynamic import to avoid initialization errors when DATABASE_URL is not set
      const { db } = await import('../../../db');
      
      const allArticles = await db
        .select()
        .from(articles)
        .where(eq(articles.isPublished, true))
        .orderBy(desc(articles.createdAt))
        .execute();
      
      const serialized = allArticles.map(a => ({
        ...a,
        author_name: DEFAULT_AUTHOR,
        summary: a.content || a.excerpt || '',
        category: DEFAULT_CATEGORY,
        content: a.content || '',
        excerpt: a.excerpt || (a.content ? a.content.slice(0, 150) : ''),
      }));

      res.status(200).json(serialized);
    } catch (error) {
      console.error('Error fetching articles:', error);
      res.status(500).json({ message: 'Error fetching articles' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
