import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../db';
import { articles } from '../../../db/schema';
import { desc, eq } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const allArticles = await db
        .select()
        .from(articles)
        .where(eq(articles.isPublished, true))
        .orderBy(desc(articles.createdAt))
        .execute();
      
      const serialized = allArticles.map(a => ({
        ...a,
        author_name: 'Imuhira Staff',
        summary: a.content || a.excerpt || '',
        category: {
          name: 'News',
          href: '/category/news',
        },
        content: a.content ? [a.content] : [],
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
