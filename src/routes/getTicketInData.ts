import { Router, Request, Response } from "express";
import ticketInModel from "../model/TicketInModel";
const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const ticketInData = await ticketInModel.find({});
    return res.json({
      success: true,
      message: "Data retrieved successfully",
      ticketInData,
    });
  } catch (error) {
    console.error("Error fetching ticket data:", error);
    return res.status(500).json({
      success: false,
      message: "❌ An error occurred while fetching data",
      error: error.message,
    });
  }
});

export default router;
