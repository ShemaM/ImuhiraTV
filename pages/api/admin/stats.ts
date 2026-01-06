import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../db';
import { debates, articles, comments } from '../../../db/schema';
import { count, eq, desc, or, isNull } from 'drizzle-orm';

interface StatsResponse {
  totalDebates: number;
  totalArticles: number;
  totalComments: number;
  publishedDebates: number;
  publishedArticles: number;
  pendingComments: number;
  recentDebates: Array<{
    id: string;
    title: string;
    slug: string | null;
    isPublished: boolean | null;
    createdAt: string | null;
  }>;
  recentArticles: Array<{
    id: string;
    title: string;
    slug: string;
    isPublished: boolean | null;
    createdAt: string | null;
  }>;
  recentComments: Array<{
    id: string;
    authorName: string;
    content: string;
    isApproved: boolean | null;
    createdAt: string | null;
  }>;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StatsResponse | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get total counts
    const [debateCount] = await db.select({ count: count() }).from(debates);
    const [articleCount] = await db.select({ count: count() }).from(articles);
    const [commentCount] = await db.select({ count: count() }).from(comments);

    // Get published counts
    const [publishedDebateCount] = await db
      .select({ count: count() })
      .from(debates)
      .where(eq(debates.isPublished, true));
    
    const [publishedArticleCount] = await db
      .select({ count: count() })
      .from(articles)
      .where(eq(articles.isPublished, true));

    // Get pending (not approved) comments count - includes false and null values
    const [pendingCommentCount] = await db
      .select({ count: count() })
      .from(comments)
      .where(or(eq(comments.isApproved, false), isNull(comments.isApproved)));

    // Get recent debates
    const recentDebatesRaw = await db
      .select({
        id: debates.id,
        title: debates.title,
        slug: debates.slug,
        isPublished: debates.isPublished,
        createdAt: debates.createdAt,
      })
      .from(debates)
      .orderBy(desc(debates.createdAt))
      .limit(5);

    // Get recent articles
    const recentArticlesRaw = await db
      .select({
        id: articles.id,
        title: articles.title,
        slug: articles.slug,
        isPublished: articles.isPublished,
        createdAt: articles.createdAt,
      })
      .from(articles)
      .orderBy(desc(articles.createdAt))
      .limit(5);

    // Get recent comments
    const recentCommentsRaw = await db
      .select({
        id: comments.id,
        authorName: comments.authorName,
        content: comments.content,
        isApproved: comments.isApproved,
        createdAt: comments.createdAt,
      })
      .from(comments)
      .orderBy(desc(comments.createdAt))
      .limit(5);

    // Serialize dates to ISO strings for consistent JSON response
    const stats: StatsResponse = {
      totalDebates: debateCount.count,
      totalArticles: articleCount.count,
      totalComments: commentCount.count,
      publishedDebates: publishedDebateCount.count,
      publishedArticles: publishedArticleCount.count,
      pendingComments: pendingCommentCount.count,
      recentDebates: recentDebatesRaw.map(d => ({
        ...d,
        createdAt: d.createdAt?.toISOString() ?? null,
      })),
      recentArticles: recentArticlesRaw.map(a => ({
        ...a,
        createdAt: a.createdAt?.toISOString() ?? null,
      })),
      recentComments: recentCommentsRaw.map(c => ({
        ...c,
        createdAt: c.createdAt?.toISOString() ?? null,
      })),
    };

    return res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return res.status(500).json({ error: 'Failed to fetch statistics' });
  }
}
