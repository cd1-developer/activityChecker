import { Router, Response, Request } from "express";
import trueGrowthModel from "../model/trueGrowthModel";
import usernameModel from "../model/UsernameModel";

const router = Router();
router.put("/", async (req: Request, res: Response) => {
  try {
    const { subscriptionId, username, updatedUsername } = req.body;
    if (!username || !updatedUsername || !subscriptionId) {
      res.json({ success: false, message: "Please add Username" });
    }
    const trueGrowthData = await trueGrowthModel.findOne({ username });
    const usernameData = await usernameModel.findOne({ subscriptionId });

    if (usernameData) {
      if (username.username === username) {
        usernameData.username = updatedUsername;
        await usernameData.save();
      }
    }
    if (trueGrowthData) {
      trueGrowthData.username = updatedUsername;
      await trueGrowthData.save();
    }

    res.json({
      success: true,
      message:
        "Username in TrueGrowth Model and UsernameModel Updated Successfully",
    });
  } catch (error: any) {
    console.log(`Error in updating Username, ${error.message}`);
    res.json({ success: false, message: "Error in updating Username" });
  }
});
export default router;
