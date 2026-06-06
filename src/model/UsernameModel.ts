import mongoose, { Schema, Document } from "mongoose";

export interface Username extends Document {
  subscriptionId: string;
  username: string;
  updatedBy: string;
  logs: string;
}

const usernameSchema: Schema = new Schema({
  subscriptionId: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
  updatedBy: {
    type: String,
    default: "",
  },
  logs: {
    type: String,
    defult: "",
  },
});

const usernameModel =
  (mongoose.models.Username as mongoose.Model<Username>) ||
  mongoose.model<Username>("Username", usernameSchema);
export default usernameModel;
