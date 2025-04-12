// pages/api/store-message.ts
import { v4 as uuidv4 } from 'uuid';
import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  if (typeof message !== 'string' || message.trim() === '') {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const messagesCollection = db.collection('messages');

    const token = uuidv4().split('-')[0]; // <-- generate a fresh token here!
    const expiresAt = Date.now() + 5 * 60 * 1000;

    // Save to DB
    await messagesCollection.insertOne({ token, message, expiresAt });

    console.log(`✅ Stored token: ${token}`);
    res.status(200).json({ token });
  } catch (error) {
    console.error('❌ DB error while storing:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
