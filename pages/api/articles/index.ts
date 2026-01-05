import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../db';
import { debates } from '../../../db/schema';
import { desc } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const allArticles = await db.select().from(debates).orderBy(desc(debates.createdAt)).execute();
      
      const articles = allArticles.map(a => ({
        ...a,
        category: {
          name: a.category,
          href: `/category/${a.category.toLowerCase()}`,
        },
        content: a.summary ? a.summary.split('\n') : [],
        excerpt: a.summary ? a.summary.slice(0, 150) : '',
      })) ;

      res.status(200).json(articles);
    } catch (error) {
      console.error('Error fetching articles:', error);
      res.status(500).json({ message: 'Error fetching articles' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
