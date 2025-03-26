import ticketInModel from "../model/TicketInModel";
import { Router, Request, Response } from "express";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const { id, progressStatus, markDone } = req.body;
  const ticket = await ticketInModel.findOne({ _id: id });
  if (!ticket) {
    return res.json({ success: false, message: "Ticket not found" });
  }
  if (ticket.progressStatus !== progressStatus) {
    ticket.progressStatus = progressStatus;
    if (markDone) {
      ticket.markDone = markDone;
    }
  }

  await ticket.save();
  return res.json({ success: true, message: "save" });
});
export default router;
