import mongoose, { Schema, Document } from "mongoose";

// Define the TypeScript interface for typing
interface Account extends Document {
  username: string;
  accountInfo: Array<{
    date: string;
    accountStatus: string;
    redRibbon: string;
    plannedF: string;
    usedF: string;
    plannedUF: string;
    usedUF: string;
  }>;
}

// Create the Mongoose schema
const accountSchema: Schema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true, // Optional: Consider adding this if usernames should be unique
  },
  accountInfo: [
    {
      date: {
        type: String,
        required: true,
      },
      accountStatus: {
        type: String,
        required: true,
      },
      redRibbon: {
        type: String,
        required: true,
      },
      plannedF: {
        type: String,
        required: true,
      },
      usedF: {
        type: String,
        required: true,
      },
      plannedUF: {
        type: String,
        required: true,
      },
      usedUF: {
        type: String,
        required: true,
      },
    },
  ],
});

// Create the Mongoose model
const AccountModel = mongoose.model<Account>("Account", accountSchema);

export default AccountModel;
