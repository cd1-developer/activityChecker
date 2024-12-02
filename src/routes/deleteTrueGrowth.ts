import { Router, Request, Response } from "express";
import trueGrowthModel from "../model/trueGrowthModel";
const router = Router();

router.delete("/", async (req: Request, res: Response) => {
  try {
    const { username } = req.body;
    const trueGrowthData = await trueGrowthModel.find({});
    res.json({ success: true, data: trueGrowthData });
  } catch (error: any) {
    res.json({ success: false, message: "Could not able to true growth" });
  }
});
export default router;
