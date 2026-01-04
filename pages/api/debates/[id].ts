import type { NextApiRequest, NextApiResponse } from 'next';
import { db, debates, debateArguments } from '../../../db';
import { eq, asc } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const debateId = Number(id);

  if (isNaN(debateId)) return res.status(400).json({ error: 'Invalid ID' });

  // DELETE
  if (req.method === 'DELETE') {
    try {
      await db.delete(debateArguments).where(eq(debateArguments.debateId, debateId));
      await db.delete(debates).where(eq(debates.id, debateId));
      return res.status(200).json({ message: 'Debate deleted' });
    } catch {
      return res.status(500).json({ error: 'Failed to delete debate' });
    }
  }

  // GET (For Edit Page)
  if (req.method === 'GET') {
    try {
      const result = await db.select().from(debates).where(eq(debates.id, debateId));
      if (result.length === 0) return res.status(404).json({ error: 'Debate not found' });
      
      // Fetch arguments ordered by index
      const args = await db
        .select()
        .from(debateArguments)
        .where(eq(debateArguments.debateId, debateId))
        .orderBy(asc(debateArguments.orderIndex));

      // 🟢 Return data mapped to our new schema
      return res.status(200).json({
        ...result[0],
        arguments: {
          faction1: args.filter(a => a.faction === 'faction1'),
          faction2: args.filter(a => a.faction === 'faction2'),
        }
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to fetch debate' });
    }
  }

  // PUT (Update Debate)
  if (req.method === 'PUT') {
    try {
      const { 
        title, slug, topic, summary, 
        faction1Label, faction2Label,
        youtubeVideoId, youtubeVideoTitle, mainImageUrl, 
        authorName, status, 
        faction1Arguments, faction2Arguments 
      } = req.body;

      await db.transaction(async (tx) => {
        // 1. Update Debate Fields
        await tx.update(debates)
          .set({
            title, slug, topic, summary,
            faction1Label, faction2Label,
            youtubeVideoId, youtubeVideoTitle, mainImageUrl,
            authorName, status,
            publishedAt: status === 'published' ? new Date() : null, // Reset date if republishing
          })
          .where(eq(debates.id, debateId));

        // 2. Replace Arguments (Delete all & Re-insert)
        // This is the safest way to handle reordering and edits
        await tx.delete(debateArguments).where(eq(debateArguments.debateId, debateId));

        if (faction1Arguments?.length) {
          await tx.insert(debateArguments).values(
            faction1Arguments.map((arg: string, index: number) => ({
              debateId, faction: 'faction1', argument: arg, orderIndex: index
            }))
          );
        }

        if (faction2Arguments?.length) {
          await tx.insert(debateArguments).values(
            faction2Arguments.map((arg: string, index: number) => ({
              debateId, faction: 'faction2', argument: arg, orderIndex: index
            }))
          );
        }
      });

      return res.status(200).json({ message: 'Updated successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to update debate' });
    }
  }
}