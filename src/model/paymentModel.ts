import mongoose, { Schema, Document } from "mongoose";

interface Payments extends Document {
  subscriptionId: string;
  memberShip: string;
  access: string;
  rebill: string;
  rate: string;
  group: string;
  start: Date;
  expiry: Date;
  logs: string;
  updatedAt: Date[];
}
const paymentSchema: Schema = new Schema({
  subscriptionId: {
    type: String,
    required: true,
    unique: true,
  },
  memberShip: {
    type: String,
    required: true,
  },
  access: {
    type: String,
    required: true,
  },
  rebill: {
    type: String,
    required: true,
  },
  rate: {
    type: String,
    required: true,
  },
  group: {
    type: String,
 
  },
  start: {
    type: Date,
    required: true,
  },
  expiry: {
    type: Date,
    required: true,
  },
  logs: {
    type: String,
  },
  updatedAt: {
    type: [Date],
    default: [],
  },
});
const paymentModel =
  (mongoose.models.Payment as mongoose.Model<Payments>) ||
  mongoose.model<Payments>("Payment", paymentSchema);

export default paymentModel;
