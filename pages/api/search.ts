import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../db';
import { debates } from '../../db/schema';
import { or, ilike } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { query } = req.query;

    if (!query || typeof query !== 'string' || query.length < 2) {
      return res.status(400).json({ message: 'Query must be at least 2 characters long' });
    }

    try {
      const results = await db.select()
        .from(debates)
        .where(
          or(
            ilike(debates.title, `%${query}%`),
            ilike(debates.summary, `%${query}%`)
          )
        )
        .execute();

      const articles = results.map(a => ({
        ...a,
        category: {
          name: a.topic,
          href: `/category/${a.topic.toLowerCase()}`,
        },
        content: a.summary ? a.summary.split('\n') : [],
        excerpt: a.summary ? a.summary.slice(0, 150) : '',
      }));

      res.status(200).json(articles);
    } catch (error) {
      console.error('Error searching articles:', error);
      res.status(500).json({ message: 'Error searching articles' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
