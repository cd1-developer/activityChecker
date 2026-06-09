import mongoose from "mongoose";

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  try {
    const connection = await mongoose.connect(`${process.env.DB_URI}`);
    console.log(`DB connected successfully ${connection.connection.host}`);
  } catch (error: any) {
    console.log(`Error in Connecting to DB ${error.message}`);
    throw error;
  }
};
export default connectDB;
