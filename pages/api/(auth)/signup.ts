// pages/api/auth/signup.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma'; // Import our helper
import { Role } from '@prisma/client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 1. We only want to allow POST requests (sending data)
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // 2. Get the data from the request body
    const { email, password, username } = req.body;

    // 3. Simple validation
    if (!email || !password || !username) {
      return res.status(400).json({ message: 'Missing email, password, or username' });
    }

    // 4. Create the user in the database
    // "prisma.user" was auto-generated from your schema!
    const user = await prisma.user.create({
      data: {
        email: email,
        password: password, // In a real app, we would hash this first!
        username: username,
        role: Role.SUBSCRIBER
      },
    });

    // 5. Send back the success message
    return res.status(201).json({ message: 'User created!', user });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong', error });
  }
}
