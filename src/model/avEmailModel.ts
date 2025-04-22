import mongoose, { Document, Schema } from "mongoose";

export interface coreAVUsername extends Document {
  subscriptionId: string;
  avEmail: string;
  avUsername: string;
  logs: string;
}

const coreAVUsernameModel: Schema = new Schema({
  subscriptionId: {
    type: String,
    required: true,
    unique: true,
  },
  avEmail: {
    type: String,
    default: "",
  },
  avUsername: {
    type: String,
    default: "",
  },
  logs: {
    type: String,
    default: "",
  },
});

const avModel: mongoose.Model<coreAVUsername> =
  mongoose.models.avUsername ||
  mongoose.model<coreAVUsername>("avUsername", coreAVUsernameModel);
export default avModel;
