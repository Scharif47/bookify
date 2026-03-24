import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) throw new Error("MONGODB_URI is not defined in environment variables");

declare global {
  var mongooseCache: {
    conn: mongoose.Connection | null;
    promise: Promise<typeof mongoose> | null;
  };
}

const cached = globalThis.mongooseCache || (globalThis.mongooseCache = { conn: null, promise: null });

export const connectToDatabase = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false });
  }

  try {
    const mongooseInstance = await cached.promise;
    cached.conn = mongooseInstance.connection;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  console.info("Connected to MongoDB");
  return cached.conn;
};
