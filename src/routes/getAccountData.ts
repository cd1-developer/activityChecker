import { Router, Request, Response } from "express";
import AccountModel from "../model/accountModel";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const { username } = req.query;  // Using query parameters

    if (!username) {
      return res.status(400).json({ success: false, message: "Username is required" });
    }

    const accountData = await AccountModel.find({ username: username });

    if (!accountData || accountData.length === 0) {
      return res.status(404).json({ success: false, message: "Username not found" });
    }

    return res.status(200).json({ success: true, message: accountData });
  } catch (e) {
    console.log("Error fetching account data: " + e.message);
    return res.status(500).json({ success: false, message: "Could not retrieve data from database" });
  }
});

export default router;
