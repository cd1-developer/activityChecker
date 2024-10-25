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

    const accountData = await AccountModel.findOne({ username });

    if (!accountData) {
      const newAccountData = new AccountModel({
        username,
        accountInfo: [
          {
            date,
            accountStatus,
            redRibbon,
            plannedF,
            usedF,
            plannedUF,
            usedUF,
          },
        ],
      });
      await newAccountData.save();
      return res
        .status(201)
        .json({ success: true, message: "Data saved successfully" });
    } else {
      // Ensure accountInfo is initialized
      if (!accountData.accountInfo) {
        accountData.accountInfo = []; // Initialize if it's undefined
      }
      accountData.accountInfo.push({
        date,
        accountStatus,
        redRibbon,
        plannedF,
        usedF,
        plannedUF,
        usedUF,
      });
      await accountData.save(); // Save the updated document
      return res
        .status(200)
        .json({ success: true, message: "Data updated successfully" });
    }
  } catch (e) {
    console.log("Could not send data to database: " + e.message);
    return res.status(500).json({
      success: false,
      message: `Could not send data to database: ${e.stack}`,
    });
  }
});

export default router;
