import { Router, Request, Response } from "express";
import usernameModel from "../model/UsernameModel";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const usernameData = await usernameModel.find();
    if (usernameData.length > 0) {
      return res.json({ success: true, usernameData });
    }
  } catch (error: any) {
    return res.json({
      success: false,
      message: `Could not able to get UsernameData ${error.message}`,
    });
  }
});

export default router;
