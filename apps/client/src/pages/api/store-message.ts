import { v4 as uuidv4 } from 'uuid';
import type { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';
import clientPromise from '../../lib/mongodb';

// Manual CORS function (no external helpers)
const runCors = (req: NextApiRequest, res: NextApiResponse) =>
  new Promise<void>((resolve, reject) => {
    Cors({
      methods: ['POST'],
      origin: '*', // Set to your frontend domain in prod
    })(req, res, (result: any) => {
      if (result instanceof Error) return reject(result);
      return resolve();
    });
  });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await runCors(req, res);
  } catch (err) {
    return res.status(500).json({ error: 'CORS error' });
  }

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

    const token = uuidv4().split('-')[0]; // short token ftw
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 min expiry

    await messagesCollection.insertOne({ token, message, expiresAt });

    console.log(`✅ Stored token: ${token}`);
    res.status(200).json({ token });
  } catch (error) {
    console.error('❌ DB error while storing:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
