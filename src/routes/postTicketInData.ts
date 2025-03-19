import ticketInModel from "../model/TicketInModel";

import { Router, Request, Response } from "express";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      date,
      TicketId,
      status,
      priority,
      subscriptionId,
      avUsername,
      igUsername,
      placement,
      description,
      yourMessage,
      supportResponse,
      executive,
      dataRequest,
      teamId,
      assignTo,
      progressStatus,
      markDone,
    } = req.body;

    const newTicketInData = new ticketInModel({
      date,
      TicketId,
      status,
      priority,
      subscriptionId,
      avUsername,
      igUsername,
      placement,
      description,
      yourMessage,
      supportResponse,
      executive,
      dataRequest,
      teamId,
      assignTo,
      progressStatus,
      markDone,
    });
    await newTicketInData.save();
    return res.json({ success: true, message: "Ticket added successfully" });
  } catch (e: any) {
    console.log(`Error in setting Ticket In Data  ${e.message}`);
    return res.json({
      success: true,
      message: "Error in setting ticket in Data",
    });
  }
});
export default router;
