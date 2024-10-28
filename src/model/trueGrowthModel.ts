import mongoose, { Schema, Document } from "mongoose";

// Define the TypeScript interface for typing
interface TrueGrowth extends Document {
  username: string;
  trueGrowthInfo: Array<{
    date: string;
    followYou: string;
    unFollowYou: string;
    netChange: string;
    issue: string;

  }>;
}

// Create the Mongoose schema
const trueGrowthSchema: Schema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true, // Optional: Consider adding this if usernames should be unique
  },
  trueGrowthInfo: [
    {
      date: {
        type: String,
        required: true,
      },
      followYou: {
        type: String,
        
      },
      unFollowYou: {
        type: String,
   
      },
      netChange: {
        type: String,
        
      },
      issue: {
        type: String,
      }
    },
  ],
});

// Create the Mongoose model
const trueGrowthModel = mongoose.model<TrueGrowth>("TrueGrowth", trueGrowthSchema);

export default trueGrowthModel;
