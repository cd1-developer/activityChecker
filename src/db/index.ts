import mongoose from "mongoose";
const connectDB = async()=>{


    try {
  
        const connection = await mongoose.connect(`${process.env.DB_URI}`)
        console.log(`DB connected successfully ${connection.connection.host}`)
    } catch (error:any) {
        console.log(`Error in Connecting to DB ${error.message}`)
        process.exit(1)
    }
}
export default connectDB;