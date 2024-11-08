import mongoose from "mongoose";

// Add this type declaration at the top of the file
declare global {
  var mongoose: { conn: any; promise: any } | undefined;
}

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MONGODB_URI to .env.local");
}

const MONGODB_URI = process.env.MONGODB_URI;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// Add this type assertion
const mongooseCache = cached as { conn: any; promise: any };

export async function connectToDatabase() {
  console.log("Connecting to MongoDB...", {
    hasConnection: !!mongooseCache.conn,
    hasPromise: !!mongooseCache.promise,
  });

  if (mongooseCache.conn) {
    console.log("Reusing existing connection");
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
        return mongoose;
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
