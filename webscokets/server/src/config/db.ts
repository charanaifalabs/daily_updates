import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/chat-app"
    );
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("DB Connection Failed", err);
    process.exit(1);
  }
};
