import { Router, Request, Response } from "express";
import avModel from "../model/avEmailModel";
import usernameModel from "../model/UsernameModel";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { subscriptionId, username } = req.json();
    if (!subscriptionId || !username)
      return res.json({
        success: false,
        message:
          "Please provide all input feild like subscription Id and username",
      });

    await usernameModel.findOneAndDelete({ username });
    return res.json({ success: true, message: `username ${username} deleted` });
  } catch (e: any) {
    console.log("Error in deleting username");
    return res.json({
      success: false,
      message: `Error in deleting username : ${e.message}`,
    });
  }
});

export default router;
