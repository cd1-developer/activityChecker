import { Router, Request, Response } from "express";
import usernameModel from "../model/UsernameModel";
import { Username } from "../model/UsernameModel";
import addLogs from "../helper/addLogs";
import formatDate from "../helper/formateDate";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { oldSubscriptionId, newSubsriptionId } = req.body;
    if (!oldSubscriptionId || !newSubsriptionId) {
      return res.json({
        success: false,
        message: "New and old Subscription Id are requried",
      });
    }
    const usernameData: Username = await usernameModel.findOne({
      subscriptionId: oldSubscriptionId,
    });
    if (usernameData) {
      usernameData.subscriptionId = newSubsriptionId;
      usernameData.logs = addLogs(
        usernameData.logs || "",
        `${formatDate(
          new Date().toString()
        )} - susbcription Id replace with ${oldSubscriptionId} to ${newSubsriptionId}`
      );
      await usernameData.save();
      return res.json({
        success: true,
        message: `Old Subcription ID : ${oldSubscriptionId} replace with New Subscription ID : ${newSubsriptionId} Successfully`,
      });
    } else
      return res.json({
        success: false,
        message: `Could not able to replace Old Subcription ID : ${oldSubscriptionId} with New Subscription ID : ${newSubsriptionId} `,
      });
  } catch (e: any) {
    return res.json({
      success: false,
      message: `Error : Could not able to replace username in DB ${e.message} `,
    });
  }
});
export default router;
