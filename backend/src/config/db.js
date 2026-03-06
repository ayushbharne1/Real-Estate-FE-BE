import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MongoDB connection failed: MONGODB_URI is not defined.\n" +
      "Please create a .env file in the backend folder with a valid connection string,\n" +
      "for example: MONGODB_URI=mongodb://localhost:27017/yourdb");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

export default connectDB;