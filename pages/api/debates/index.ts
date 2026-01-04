// pages/api/debates/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { db, debates, debateArguments } from '../../../db';
import { eq, desc, inArray } from 'drizzle-orm'; // Added inArray
import { filterValidArguments, transformArgumentsForInsert, formatErrorResponse } from '../../../lib/debate-utils';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      // 1. Fetch all debates first
      const allDebates = await db
        .select()
        .from(debates)
        .orderBy(desc(debates.createdAt));

      // Optimization: If no debates exist, return empty array immediately
      if (allDebates.length === 0) {
        return res.status(200).json([]);
      }
      
      // 2. Extract IDs to fetch arguments in ONE query (Solves N+1 Problem)
      const debateIds = allDebates.map(d => d.id);

      const allArguments = await db
        .select()
        .from(debateArguments)
        .where(inArray(debateArguments.debateId, debateIds));

      // 3. Map arguments to debates in memory (Much faster than DB calls)
      const debatesWithArguments = allDebates.map((debate) => {
        const debateArgs = allArguments.filter(a => a.debateId === debate.id);
        
        return {
          ...debate,
          arguments: {
            idubu: debateArgs.filter(a => a.faction === 'idubu'),
            akagara: debateArgs.filter(a => a.faction === 'akagara'),
          },
        };
      });

      return res.status(200).json(debatesWithArguments);
    } catch (error) {
      console.error('Error fetching debates:', error);
      return res.status(500).json(formatErrorResponse(error, 'Failed to fetch debates'));
    }
  }

  if (req.method === 'POST') {
    try {
      const { 
        title, slug, topic, summary, verdict, 
        youtubeVideoId, youtubeVideoTitle, mainImageUrl, 
        authorName, status, idubuArguments, akagaraArguments 
      } = req.body;

      // Validate required fields
      if (!title || !slug || !topic) {
        return res.status(400).json({ 
          error: 'Missing required fields: title, slug, and topic are required' 
        });
      }

      // Transaction: Ensures Debate AND Arguments are created together, or not at all
      const result = await db.transaction(async (tx) => {
        // 1. Insert Debate
        const [newDebate] = await tx
          .insert(debates)
          .values({
            title, slug, topic, summary,
            youtubeVideoId, youtubeVideoTitle, mainImageUrl,
            authorName: authorName || 'Imuhira Staff',
            status: status || 'draft',
            publishedAt: status === 'published' ? new Date() : null,
          })
          .returning();

        // 2. Insert Idubu arguments using `tx`
        const validIdubuArgs = filterValidArguments(idubuArguments);
        if (validIdubuArgs.length > 0) {
          await tx.insert(debateArguments).values(
            transformArgumentsForInsert(validIdubuArgs, newDebate.id, 'idubu')
          );
        }

        // 3. Insert Akagara arguments using `tx`
        const validAkagaraArgs = filterValidArguments(akagaraArguments);
        if (validAkagaraArgs.length > 0) {
          await tx.insert(debateArguments).values(
            transformArgumentsForInsert(validAkagaraArgs, newDebate.id, 'akagara')
          );
        }

        return newDebate;
      });

      // Fetch the created arguments to return full object (Optional, but good for UI)
      const args = await db
        .select()
        .from(debateArguments)
        .where(eq(debateArguments.debateId, result.id));

      return res.status(201).json({
        ...result,
        arguments: {
          idubu: args.filter(a => a.faction === 'idubu'),
          akagara: args.filter(a => a.faction === 'akagara'),
        },
      });

    } catch (error) {
      console.error('Error creating debate:', error);
      return res.status(500).json(formatErrorResponse(error, 'Failed to create debate'));
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}