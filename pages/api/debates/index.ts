import type { NextApiRequest, NextApiResponse } from 'next';
import { db, debates, debateArguments } from '../../../db';
import { eq, desc } from 'drizzle-orm';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const allDebates = await db
        .select()
        .from(debates)
        .orderBy(desc(debates.createdAt));
      
      // Fetch arguments for each debate
      const debatesWithArguments = await Promise.all(
        allDebates.map(async (debate) => {
          const args = await db
            .select()
            .from(debateArguments)
            .where(eq(debateArguments.debateId, debate.id));
          
          return {
            ...debate,
            arguments: {
              idubu: args.filter(a => a.faction === 'idubu'),
              akagara: args.filter(a => a.faction === 'akagara'),
            },
          };
        })
      );

      return res.status(200).json(debatesWithArguments);
    } catch (error) {
      console.error('Error fetching debates:', error);
      return res.status(500).json({ error: 'Failed to fetch debates' });
    }
  }

  if (req.method === 'POST') {
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

      // Validate required fields
      if (!title || !slug || !topic || !verdict) {
        return res.status(400).json({ 
          error: 'Missing required fields: title, slug, topic, and verdict are required' 
        });
      }

      // Insert the debate
      const [newDebate] = await db
        .insert(debates)
        .values({
          title,
          slug,
          topic,
          summary,
          verdict,
          youtubeVideoId,
          youtubeVideoTitle,
          mainImageUrl,
          authorName: authorName || 'Imuhira Staff',
          status: status || 'draft',
          publishedAt: status === 'published' ? new Date() : null,
        })
        .returning();

      // Insert Idubu arguments
      if (idubuArguments && idubuArguments.length > 0) {
        await db.insert(debateArguments).values(
          idubuArguments.map((arg: { speakerName?: string; argument: string }, index: number) => ({
            debateId: newDebate.id,
            faction: 'idubu' as const,
            speakerName: arg.speakerName,
            argument: arg.argument,
            orderIndex: index,
          }))
        );
      }

      // Insert Akagara arguments
      if (akagaraArguments && akagaraArguments.length > 0) {
        await db.insert(debateArguments).values(
          akagaraArguments.map((arg: { speakerName?: string; argument: string }, index: number) => ({
            debateId: newDebate.id,
            faction: 'akagara' as const,
            speakerName: arg.speakerName,
            argument: arg.argument,
            orderIndex: index,
          }))
        );
      }

      // Fetch the complete debate with arguments
      const args = await db
        .select()
        .from(debateArguments)
        .where(eq(debateArguments.debateId, newDebate.id));

      return res.status(201).json({
        ...newDebate,
        arguments: {
          idubu: args.filter(a => a.faction === 'idubu'),
          akagara: args.filter(a => a.faction === 'akagara'),
        },
      });
    } catch (error) {
      console.error('Error creating debate:', error);
      return res.status(500).json({ error: 'Failed to create debate' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
