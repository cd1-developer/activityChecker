import { Router, Request, Response } from "express";
import AccountModel from "../model/accountModel";
const router = Router();
router.post("/", async (req: Request, res: Response) => {
  try {
    const {

      username,
      date,
      accountStatus,
      redRibbon,
      plannedF,
      usedF,
      plannedUF,
      usedUF,
    } = req.body;
    const newAccountData = new AccountModel({
 
      username,
      date,
      accountStatus,
      redRibbon,
      plannedF,
      usedF,
      plannedUF,
      usedUF,
    });
    await newAccountData.save();
    return res
      .status(201)
      .json({ success: true, message: "Data saved successfully" });
  } catch (e) {
    console.log("Could not able to send data to database " + e.message);

    return res
      .status(500)
      .json({
        success: false,
        message: "Could not able to send data to database",
      });
  }
});
export default router;
