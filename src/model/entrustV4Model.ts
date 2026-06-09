import mongoose, { Schema, Document } from "mongoose";
import { Types } from "mongoose";

export interface IAvGrowthInfo {
  subId: string;
  placement: string;
  status: string;
  avUsername: string;
  access: string;
  rebill: string;
  startDate: Date;
  expiryDate?: Date;
  executive: string;
  teamId: string;
  createdAt: Date;
}

export interface AvGrowth extends Document {
  usernameId: Types.ObjectId;
  avGrowthInfo: IAvGrowthInfo[];
}

const avGrowthSchema = new Schema<AvGrowth>({
  usernameId: {
    type: Schema.Types.ObjectId,
    ref: "Username",
    required: true,
    unique: true,
  },

  avGrowthInfo: [
    {
      subId: {
        type: String,
        required: true,
      },

      placement: {
        type: String,
        required: true,
      },

      status: {
        type: String,
        required: true,
      },

      avUsername: {
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

      startDate: {
        type: Date,
        required: true,
      },

      expiryDate: {
        type: Date,
      },

      executive: {
        type: String,
        required: true,
      },

      teamId: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const avGrowthModel =
  (mongoose.models.AvGrowth as mongoose.Model<AvGrowth>) ||
  mongoose.model<AvGrowth>("AvGrowth", avGrowthSchema);

export default avGrowthModel;
