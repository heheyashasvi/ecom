import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
const MOCK_MODE = process.env.MOCK_MODE === 'true';

interface MongooseCache {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
}

declare global {
  var mongoose: MongooseCache;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (MOCK_MODE) {
    console.log("Mock Mode: Skipping DB connection");
    return null;
  }

  if (!MONGODB_URI) {
    console.warn("MONGODB_URI not defined. Defaulting to Mock Mode.");
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: true, // Allow buffering for serverless
      serverSelectionTimeoutMS: 10000, // 10 second timeout
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      return mongoose.connection;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    console.error("Failed to connect to DB, falling back:", e);
    cached.promise = null;
    return null; // Return null to indicate failure/mock mode
  }

  return cached.conn;
}

export default connectToDatabase;
