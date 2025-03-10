import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/GigaGears";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("🚀 Successfully MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};

export default connectDB;
