import { Router, Request, Response } from "express";
import paymentModel from "../model/paymentModel";
import { Payments } from "../model/paymentModel";
const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { subscriptionId, group, rate } = req.body;

    if (!subscriptionId || !group)
      return res.status(400).json({
        success: false,
        message: "Please provide both subscriptionId and group",
      });
    const paymentData: Payments = await paymentModel.findOne({
      subscriptionId,
    });

    if (paymentData) {
      paymentData.group = group;
      if (rate) {
        paymentData.rate = rate;
      }
      await paymentData.save();
      return res.json({
        success: true,
        message: `Subscription Updagade Successfully ${subscriptionId}`,
      });
    } else
      return res.status(404).json({
        success: false,
        message: "Subscription not found. Could not upgrade subscription.",
      });
  } catch (e: any) {
    return res.json({
      success: false,
      message: `Error : Could not able to updagrde subscription : ${e.message}`,
    });
  }
});

export default router;
