import mongoose from "mongoose";

const connectDB = async (uri: string) => {
  if (!uri) throw new Error("MONGO_URI is required");
  await mongoose.connect(uri);
  console.log("MongoDB connected");
};

export default connectDB;
