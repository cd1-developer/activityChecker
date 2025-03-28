import ticketInModel from "../model/TicketInModel";
import { Router, Request, Response } from "express";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { id, progressStatus, markDone } = req.body;

    const ticket = await ticketInModel.findOne({ _id: id });
    if (!ticket) {
      return res.status(404).json({ success: false, message: "Ticket not found" });
    }

    if (ticket.progressStatus !== progressStatus || ticket.markDone !== markDone) {
      ticket.progressStatus = progressStatus;
      ticket.markDone = markDone;
      await ticket.save();
      return res.json({ success: true, message: "Ticket updated successfully" });
    }

    return res.json({ success: false, message: "No changes detected" });
  } catch (error) {
    console.error("Error updating ticket:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export default router;
