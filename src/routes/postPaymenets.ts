import { Router, Request, Response } from "express";
import paymentModel from "../model/paymentModel";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { paymentsData } = req.body;

    if (paymentsData.length > 0) {
      paymentsData.forEach(async (data: any) => {
        let {
          subscriptionId,
          memberShip,
          access,
          rebill,
          rate,
          group,
          start,
          expiry,
          logs,
        } = data;
        const currentDate = new Date();
        const updatedAt = [currentDate];
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
          updatedAt: [new Date(), ...updatedAt],
        });

        await newPaymentData.save();
        return res.json({
          success: true,
          message: `Paymenet Data is updated for subscriptionID ${subscriptionId}`,
        });
      });
    }
  } catch (e: any) {
    return res.json({
      success: false,
      message: `Error in sending Data in database ${e.message}`,
    });
  }
});

export default router
