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

// Manual CORS function (no external helpers)
const runCors = (req: NextApiRequest, res: NextApiResponse) =>
  new Promise<void>((resolve, reject) => {
    Cors({
      methods: ['GET', 'POST'], // Add other methods as needed
      origin: 'https://copyit-alpha.vercel.app', // Allow your frontend domain
      allowedHeaders: ['Content-Type'], // Optional: Specify any headers you need to allow
      credentials: true, // If you're passing cookies or authentication tokens
    })(req, res, (result) => {
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

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const rawToken = req.query.token;
  const token = Array.isArray(rawToken) ? rawToken[0] : rawToken;
  console.log("🔍 Normalized token:", token);

  if (!token || typeof token !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing token' });
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const messagesCollection = db.collection('messages');

    const record = await messagesCollection.findOne({ token });

    if (!record) {
      console.log("❌ Message not found for token:", token);
      return res.status(404).json({ error: 'Message not found' });
    }

    if (Date.now() > record.expiresAt) {
      await messagesCollection.deleteOne({ token });
      return res.status(410).json({ error: 'Message expired' });
    }

    return res.status(200).json({ message: record.message });
  } catch (error) {
    console.error("🔥 DB fetch error:", error);
    return res.status(500).json({ error: 'Database error' });
  }
}
