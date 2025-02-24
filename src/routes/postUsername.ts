import { Router, Request, Response } from "express";
import usernameModel from "../model/UsernameModel";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { subscriptionId, username } = req.body;
    if (subscriptionId === "" || username === "") {
      return res.json({
        success: false,
        message: "Subscription ID and Username can not be blank",
      });
    }

    const usernameData = await usernameModel.findOne({ subscriptionId });

    if (usernameData) {
      return res.json({
        success: false,
        message: `Usename ${username} is already exist`,
      });
    }

    const newUsername = new usernameModel({
      subscriptionId,
      username,
    });
    await newUsername.save();
    return res.json({
      success: true,
      message: "Successfully added Username in Database",
    });
  } catch (e: any) {
    return res.json({
      success: false,
      message: `Could able to add Username in Database ${e.message}`,
    });
  }
});

export default router;
