import type { NextApiRequest, NextApiResponse } from 'next';
import { db, debates, debateArguments } from '../../../db';
import { eq } from 'drizzle-orm';
import { filterValidArguments, transformArgumentsForInsert, formatErrorResponse } from '../../../lib/debate-utils';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const debateId = parseInt(id as string, 10);

  if (isNaN(debateId)) {
    return res.status(400).json({ error: 'Invalid debate ID' });
  }

  if (req.method === 'GET') {
    try {
      const [debate] = await db
        .select()
        .from(debates)
        .where(eq(debates.id, debateId));

      if (!debate) {
        return res.status(404).json({ error: 'Debate not found' });
      }

      const args = await db
        .select()
        .from(debateArguments)
        .where(eq(debateArguments.debateId, debateId));

      return res.status(200).json({
        ...debate,
        arguments: {
          idubu: args.filter(a => a.faction === 'idubu'),
          akagara: args.filter(a => a.faction === 'akagara'),
        },
      });
    } catch (error) {
      console.error('Error fetching debate:', error);
      return res.status(500).json(formatErrorResponse(error, 'Failed to fetch debate'));
    }
  }

  if (req.method === 'PUT') {
    try {
      const { 
        title, 
        slug, 
        topic, 
        summary, 
        verdict, 
        youtubeVideoId, 
        youtubeVideoTitle,
        mainImageUrl,
        authorName,
        status,
        idubuArguments,
        akagaraArguments 
      } = req.body;

      // First, get the existing debate to check current publishedAt
      const [existingDebate] = await db
        .select()
        .from(debates)
        .where(eq(debates.id, debateId));

      if (!existingDebate) {
        return res.status(404).json({ error: 'Debate not found' });
      }

      // Only set publishedAt if it's being published for the first time
      const publishedAt = status === 'published' 
        ? (existingDebate.publishedAt || new Date())
        : null;

      // Update the debate
      const [updatedDebate] = await db
        .update(debates)
        .set({
          title,
          slug,
          topic,
          summary,
          verdict,
          youtubeVideoId,
          youtubeVideoTitle,
          mainImageUrl,
          authorName,
          status,
          updatedAt: new Date(),
          publishedAt,
        })
        .where(eq(debates.id, debateId))
        .returning();

      // Delete existing arguments and insert new ones
      await db.delete(debateArguments).where(eq(debateArguments.debateId, debateId));

      // Insert updated Idubu arguments (filter out empty arguments)
      const validIdubuArgs = filterValidArguments(idubuArguments);
      if (validIdubuArgs.length > 0) {
        await db.insert(debateArguments).values(
          transformArgumentsForInsert(validIdubuArgs, debateId, 'idubu')
        );
      }

      // Insert updated Akagara arguments (filter out empty arguments)
      const validAkagaraArgs = filterValidArguments(akagaraArguments);
      if (validAkagaraArgs.length > 0) {
        await db.insert(debateArguments).values(
          transformArgumentsForInsert(validAkagaraArgs, debateId, 'akagara')
        );
      }

      // Fetch updated arguments
      const args = await db
        .select()
        .from(debateArguments)
        .where(eq(debateArguments.debateId, debateId));

      return res.status(200).json({
        ...updatedDebate,
        arguments: {
          idubu: args.filter(a => a.faction === 'idubu'),
          akagara: args.filter(a => a.faction === 'akagara'),
        },
      });
    } catch (error) {
      console.error('Error updating debate:', error);
      return res.status(500).json(formatErrorResponse(error, 'Failed to update debate'));
    }
  }

  if (req.method === 'DELETE') {
    try {
      const [deletedDebate] = await db
        .delete(debates)
        .where(eq(debates.id, debateId))
        .returning();

      if (!deletedDebate) {
        return res.status(404).json({ error: 'Debate not found' });
      }

      return res.status(200).json({ message: 'Debate deleted successfully' });
    } catch (error) {
      console.error('Error deleting debate:', error);
      return res.status(500).json(formatErrorResponse(error, 'Failed to delete debate'));
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
