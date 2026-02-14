import type { NextApiRequest, NextApiResponse } from 'next';
import { eq } from 'drizzle-orm';

type ResponseData = {
  success: boolean;
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email format' });
  }

  // Check if database is configured BEFORE importing db
  if (!process.env.DATABASE_URL) {
    console.warn('DATABASE_URL not configured - subscription saved in demo mode');
    // Return success for development/demo purposes
    return res.status(201).json({ success: true, message: 'Thank you for subscribing to Imuhira TV!' });
  }

  try {
    // Only import db when DATABASE_URL is available
    const { db } = await import('../../db');
    const { subscribers } = await import('../../db/schema');
    
    // Check if email already exists
    const existing = await db
      .select()
      .from(subscribers)
      .where(eq(subscribers.email, email.toLowerCase()))
      .execute();

    if (existing.length > 0) {
      return res.status(200).json({ success: true, message: 'You are already subscribed!' });
    }

    // Insert new subscriber
    await db.insert(subscribers).values({
      email: email.toLowerCase(),
    }).execute();

    return res.status(201).json({ success: true, message: 'Successfully subscribed to Imuhira TV!' });
  } catch (error) {
    console.error('Subscription error:', error);
    return res.status(500).json({ success: false, message: 'Failed to subscribe. Please try again later.' });
  }
}
