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
      expiry,
      logs,
      updatedAt,
    } = req.body;

    // Prepare the data for bulk insert

    const currentDate = new Date();

    const newPaymentData = new paymentModel({
      subscriptionId,
      memberShip,
      access,
      rebill,
      rate,
      group,
      expiry,
      logs,
      updatedAt: [currentDate, ...updatedAt],
    });
    await newPaymentData.save();
    return res.json({
      success: true,
      message: `Susbcription Id ${subscriptionId} is added Successfully $`,
    });
  } catch (e: any) {
    return res.json({
      success: false,
      message: `Error in sending data to the database: ${e.message}`,
    });
  }
});

export default router;
