// import type { NextApiRequest, NextApiResponse } from 'next';
// import clientPromise from '../../lib/mongodb';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== 'GET') {
//     return res.status(405).json({ error: 'Method not allowed' });
//   }
  
//   const rawToken = req.query.token;

//   const token = Array.isArray(rawToken) ? rawToken[0] : rawToken;
//   console.log("🔍 Normalized token:", token);
  

//   if (!token || typeof token !== 'string') {
//     return res.status(400).json({ error: 'Invalid or missing token' });
//   }

//   try {
//     const client = await clientPromise;
//     const db = client.db();
//     const messagesCollection = db.collection('messages');

//     // console.log(`🔍 Looking for token: ${token}`);
   

//     const found = await messagesCollection.find({}).toArray();
// // console.log("🧠 All tokens in DB:", found.map(f => f.token));

//     const record = await messagesCollection.findOne({ token });
//     console.log(record)
//     if (!record) {
//       console.log("❌ Message not found for token:", token);
//       return res.status(404).json({ error: 'Message not found' });
//     }

//     if (Date.now() > record.expiresAt) {
//       await messagesCollection.deleteOne({ token });
//       return res.status(410).json({ error: 'Message expired' });
//     }

   

//     return res.status(200).json({ message: record.message });
//   } catch (error) {
//     console.error("🔥 DB fetch error:", error);
//     return res.status(500).json({ error: 'Database error' });
//   }
// }
import type { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';
import clientPromise from '../../lib/mongodb';

// Initialize CORS middleware
const cors = Cors({
  methods: ['GET', 'OPTIONS'], // Only allow GET and OPTIONS (for preflight)
  origin: [
    'https://copyit-alpha.vercel.app',
    'http://localhost:3000' // Add localhost for development
  ],
  allowedHeaders: ['Content-Type'],
  credentials: true
});

// Helper to run middleware
const runMiddleware = (req: NextApiRequest, res: NextApiResponse, fn: Function) => 
  new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Run CORS middleware
    await runMiddleware(req, res, cors);
    
    // Handle OPTIONS request (CORS preflight)
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    // Only allow GET requests
    if (req.method !== 'GET') {
      res.setHeader('Allow', ['GET', 'OPTIONS']);
      return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }

    // Validate token
    const rawToken = req.query.token;
    const token = Array.isArray(rawToken) ? rawToken[0] : rawToken;
    
    if (!token || typeof token !== 'string') {
      return res.status(400).json({ error: 'Invalid or missing token' });
    }

    // Database operations
    const client = await clientPromise;
    const db = client.db();
    const messagesCollection = db.collection('messages');

    const record = await messagesCollection.findOne({ token });

    if (!record) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Check expiration
    if (Date.now() > record.expiresAt) {
      await messagesCollection.deleteOne({ token });
      return res.status(410).json({ error: 'Message expired' });
    }

    // Success response
    return res.status(200).json({ message: record.message });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}