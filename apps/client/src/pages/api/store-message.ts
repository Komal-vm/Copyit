import { v4 as uuidv4 } from 'uuid';
import type { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';
import clientPromise from '../../lib/mongodb';

// CORS configuration
const cors = Cors({
  methods: ['POST', 'OPTIONS'], // Include OPTIONS for preflight
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://copyit-alpha.vercel.app' 
    : 'http://localhost:3000', // Safer origin handling
  allowedHeaders: ['Content-Type'],
});

// Middleware runner
const runMiddleware = (req: NextApiRequest, res: NextApiResponse, fn: Function) => 
  new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });

// Input validation
interface RequestBody {
  message: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Run CORS middleware
    await runMiddleware(req, res, cors);

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
      res.setHeader('Allow', ['POST']);
      return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }

    // Validate content type
    if (req.headers['content-type'] !== 'application/json') {
      return res.status(415).json({ error: 'Content-Type must be application/json' });
    }

    // Validate request body
    const { message }: RequestBody = req.body;
    
    if (typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Message must be a non-empty string',
        details: {
          maxLength: 1000, // Consider adding maximum length
          minLength: 1
        }
      });
    }

    // Database operations
    const client = await clientPromise;
    const db = client.db();
    const messagesCollection = db.collection('messages');

    // Generate token and expiration
    const token = uuidv4().split('-')[0]; // First segment of UUID
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes from now

    // Insert document
    await messagesCollection.insertOne({
      token,
      message: message.trim(), // Clean up whitespace
      expiresAt,
      createdAt: new Date(),
    });

    // Success response
    return res.status(201).json({ 
      token,
      expiresAt: new Date(expiresAt).toISOString() // Return human-readable expiry
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      requestId: req.headers['x-request-id'] // Helpful for debugging
    });
  }
}