import mongoose from "mongoose";

const connectDb = async () => {
  console.log(process.env.MONGO_URI);
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Error", error.message);
    process.exit(1);
  }
};
export default connectDb;
