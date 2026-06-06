import mongoose, { Schema, Document } from "mongoose";

interface Password extends Document {
  placement: string;
  username: string;
  password: string;
  twoFactorCode: string;
  isfree: Boolean;
  deviceId: String;
}
const passwordSchema: Schema = new Schema({
  placement: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  twoFactorCode: {
    type: String,
  },
  isfree: {
    type: Boolean,
    required: true,
    default: true,
  },
  deviceId: {
    type: String,
    default: null,
  },
});
const passwordModel =
  (mongoose.models.Password as mongoose.Model<Password>) ||
  mongoose.model<Password>("Password", passwordSchema);
export default passwordModel;
