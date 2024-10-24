import mongoose, { Schema, Document } from "mongoose";

// Define the TypeScript interface for typing
interface Account extends Document {

    username: string;
    date:string;
    accountStatus: string;  // Corrected the typo
    redRibbon: string;      // Corrected the typo
    plannedF: string;
    usedF: string;
    plannedUF: string;
    usedUF: string;
}

// Create the Mongoose schema
const accountSchema: Schema = new Schema({
  
    username: {
        type: String,
        required: true
    },
    date:{
        type: String,
        required: true
    },
    accountStatus: {
        type: String,
        required: true
    },
    redRibbon: {
        type: String,
        required: false
    },
    plannedF: {
        type: String,
        required: true
    },
    usedF: {
        type: String,
        required: true
    },
    plannedUF: {
        type: String,
        required: true
    },
    usedUF: {
        type: String,
        required: true
    }
});

// Create the Mongoose model
const AccountModel = mongoose.model<Account>("Account", accountSchema);

export default AccountModel;
