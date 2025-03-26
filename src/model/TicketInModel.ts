import mongoose, { Schema, Document } from "mongoose";

interface TicketIn extends Document {
  date: string;
  TicketId: string;
  status: string;
  priority: string;
  subscriptionId: string;
  avUsername: string;
  igUsername: string;
  placement: string;
  discription: string;
  yourMessage: string[];
  supportResponse: string;
  excecutive: string;
  dataRequest: string;
  teamId: string;
  assignTo: string;
  progressStatus: string;
  markDone: boolean;
}

const TicketSchema: Schema = new mongoose.Schema({
  date: { type: String },
  ticketId: { type: String },
  status: { type: String },
  priority: { type: String },
  subscriptionId: { type: String },
  avUsername: { type: String },
  igUsername: { type: String },
  placement: { type: String },
  description: { type: String },
  yourMessage: { type: [String] },
  supportResponse: { type: String },
  executive: { type: String },
  dataRequest: { type: String },
  teamId: { type: String },
  assignTo: { type: String },
  progressStatus: { type: String, default: "Todo" },
  markDone: { type: Boolean, default: false },
});

const ticketInModel = mongoose.model<TicketIn>("TicketIn", TicketSchema);

export default ticketInModel;
