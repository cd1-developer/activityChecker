import { Router, Request, Response } from "express";
import trueGrowthModel from "../model/trueGrowthModel";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const { username } = req.query;  // Using query parameters

    if (!username) {
      return res.status(400).json({ success: false, message: "Username is required" });
    }

    const trueGrowthData = await trueGrowthModel.find({ username: username });

    if (!trueGrowthData || trueGrowthData.length === 0) {
      return res.status(404).json({ success: false, message: "Username not found" });
    }

    return res.status(200).json({ success: true, message: trueGrowthData });
  } catch (e) {
    console.log("Error fetching account data: " + e.message);
    return res.status(500).json({ success: false, message: "Could not retrieve true growth data from database" });
  }
});

export default router;
