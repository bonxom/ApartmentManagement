import mongoose from "mongoose";

const DEFAULT_ATLAS_URI = process.env.MONGO_URI;
const DB_NAME = process.env.MONGO_DB_NAME;

if (!DEFAULT_ATLAS_URI) {
  throw new Error("Missing MONGO_URI environment variable");
}

let isConnected = false; // global flag

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  try {
    const conn = await mongoose.connect(DEFAULT_ATLAS_URI, DB_NAME ? { dbName: DB_NAME } : {});
    isConnected = mongoose.connection.readyState === 1;
    console.log(`Database connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (err) {
    console.error("Database connection error:", err?.message || err);
    throw err; 
  }
};

export default connectDB;
