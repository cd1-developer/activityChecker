import ticketInModel from "../model/TicketInModel";
import { Router, Request, Response } from "express";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const { id, message } = req.body;
  const ticket = await ticketInModel.findOne({ _id: id });
  if (!ticket) {
    return res.json({ success: false, message: "Ticket not found" });
  }
  ticket.yourMessage = [...ticket.yourMessage, message];
  await ticket.save();
  return res.json({ success: true, message: "Your message added",ticketInData:ticket });
});
export default router;
