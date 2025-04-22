import addLogs from "../helper/addLogs";
import formatDate from "../helper/formateDate";
import paymentModel from "../model/paymentModel";
import { Router, Request, Response } from "express";

const router = Router();

router.put("/", async (req: Request, res: Response) => {
  try {
    const { subscriptionId, access, rebill } = req.body;
    if (!subscriptionId || !access || !rebill)
      return res.json({ success: false, message: "Invalid Inputs" });

    const paymentInfo = await paymentModel.findOne({ subscriptionId });
    if (!paymentInfo)
      return res.json({
        success: false,
        message: `${subscriptionId} - payment data is not found`,
      });

    paymentInfo.access = access;
    paymentInfo.rebill = rebill;
    paymentInfo.logs = addLogs(
      paymentInfo.logs,
      `${formatDate(new Date().toString())} -payment stauts updated  ${
        paymentInfo.access
      } --> ${access} ${paymentInfo.rebill} --> ${rebill}`
    );
    await paymentInfo.save();

    return res.json({
      success: true,
      message: `${subscriptionId} - payment info updated`,
    });
  } catch (error) {
    console.error("Error updating payment info:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

export default router;
