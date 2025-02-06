import { Router, Request, Response } from "express";
import paymentModel from "../model/paymentModel";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      subscriptionId,
      memberShip,
      access,
      rebill,
      rate,
      group,
      start,
      expiry,
      logs,
    } = req.body;

    const newPaymentData = new paymentModel({
      subscriptionId,
      memberShip,
      access,
      rebill,
      rate,
      group,
      start,
      expiry,
      logs,
      updatedAt: [new Date()],
    });
    await newPaymentData.save();
    return res.json({
      success: true,
      message: `Subscription ${subscriptionId}`,
    });
  } catch (e: any) {
    return res.status(500).json({
      success: false,
      message: `Error inserting data: ${e.message}`,
    });
  }
});

export default router;
