import mongoose from "mongoose";

// Define interface for mongoose cache
interface MongooseCache {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
}

// Update the global declaration
declare global {
  // eslint-disable-next-line no-var
  var mongoose:
    | {
        conn: mongoose.Connection | null;
        promise: Promise<mongoose.Connection> | null;
      }
    | undefined;
}

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MONGODB_URI to .env.local");
}

const MONGODB_URI = process.env.MONGODB_URI;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// Add proper typing for the cache
const mongooseCache = cached as MongooseCache;

export async function connectToDatabase() {
  if (mongooseCache.conn) {
    return mongooseCache.conn;
  }

  if (!mongooseCache.promise) {
    const opts = {
      bufferCommands: false,
    };

    console.log("Creating new connection to MongoDB...");
    mongooseCache.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log("Successfully connected to MongoDB");
        return mongoose.connection;
      });
  }

  try {
    mongooseCache.conn = await mongooseCache.promise;
  } catch (e) {
    console.error("Failed to connect to MongoDB:", e);
    mongooseCache.promise = null;
    throw e;
  }

  return mongooseCache.conn;
}
