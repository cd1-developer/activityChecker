import { Router, Request, Response } from "express";
import paymentModel from "../model/paymentModel";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { subscriptionId, expiry } = req.body;

    if (!subscriptionId || !expiry)
      return res.json({
        success: false,
        message: "Could not able to Extend Subscription",
      });

    const paymentData = await paymentModel.findOne({ subscriptionId });

    if (paymentData) {
      paymentData.expiry = new Date(expiry);
      await paymentData.save();
      return res.json({
        success: true,
        message: `Sub_ID : ${subscriptionId} Subscription Expiry Date Updated Successfully`,
      });
    }
  } catch (error: any) {
    return res.json({
      success: false,
      message: `Could not able to Extend Subscription ${error.message}`,
    });
  }
});

export default router;
