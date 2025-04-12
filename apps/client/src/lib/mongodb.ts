import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI!, {
  // No need to use deprecated options anymore
});

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so the MongoDB client is reused across hot reloads
  let globalWithMongo = global as any;
  if (!globalWithMongo._mongoClientPromise) {
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  clientPromise = client.connect();
}

export default clientPromise;
