import { Router, Request, Response } from "express";
import paymentModel from "../model/paymentModel";

const router = Router();


router.post("/", async (req: Request, res: Response) => {
  try {
    const { paymentData } = req.body;

    if (!paymentData || paymentData.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No payment data provided.",
      });
    }

    // Prepare data for bulk insert
    const currentDate = new Date().toISOString();
    const paymentsToInsert = paymentData.map((data: any) => ({
      subscriptionId: data.subscriptionId,
      memberShip: data.memberShip,
      access: data.access,
      rebill: data.rebill,
      rate: data.rate,
      group: data.group,
      start: new Date(data.start).toISOString(),
      expiry: new Date(data.expiry).toISOString(),
      logs: data.logs,
      updatedAt: [currentDate],
    }));

    // Insert all records at once using insertMany
    await paymentModel.insertMany(paymentsToInsert);

    return res.status(201).json({
      success: true,
      message: `Successfully inserted ${paymentsToInsert.length} payment records.`,
    });
  } catch (e: any) {
    return res.status(500).json({
      success: false,
      message: `Error inserting data: ${e.message}`,
    });
  }
});

export default router;




