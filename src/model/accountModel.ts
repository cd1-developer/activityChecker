import mongoose, { Schema, Document } from "mongoose";

// Define the TypeScript interface for typing
interface Account extends Document {
    subscriptionID: string;
    username: string;
    date:string;
    accountStatus: string;  // Corrected the typo
    redRibbon: string;      // Corrected the typo
    plannedF: number;
    usedF: number;
    plannedUF: number;
    usedUF: number;
}

// Create the Mongoose schema
const accountSchema: Schema = new Schema({
    subscriptionID: {
        type: String,
        required: true
    },
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
        type: Number,
        required: true
    },
    usedF: {
        type: Number,
        required: true
    },
    plannedUF: {
        type: Number,
        required: true
    },
    usedUF: {
        type: Number,
        required: true
    }
});

// Create the Mongoose model
const AccountModel = mongoose.model<Account>("Account", accountSchema);

export default AccountModel;
