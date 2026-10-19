import mongoose from "mongoose";
import { ImageModel } from "../infrastructure/schema/image.schema.ts";

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/image-upload-db";

export async function connectDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    await ImageModel.init();
    console.log("Successfully connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}
