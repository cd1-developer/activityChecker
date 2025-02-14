import { Router, Request, Response } from "express";
import usernameModel from "../model/UsernameModel";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { usernameData } = req.body;

    await usernameModel.insertMany(usernameData);
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
