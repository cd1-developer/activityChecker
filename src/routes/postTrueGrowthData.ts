import { Router, Request, Response } from "express";
import trueGrowthModel from "../model/trueGrowthModel";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      username,
      date,
      followYou,
      unFollowYou,
      netChange,
      issue,
     
    } = req.body;

    const trueGrowthData = await trueGrowthModel.findOne({ username });

    if (!trueGrowthData) {
      const newTrueGrowthData = new trueGrowthModel({
        username,
        trueGrowthInfo: [
          {
         
            date,
      followYou,
      unFollowYou,
      netChange,
      issue,
          },
        ],
      });
      await newTrueGrowthData.save();
      return res
        .status(201)
        .json({ success: true, message: "Data saved successfully" });
    } else {
      // Ensure accountInfo is initialized
      if (!trueGrowthData.trueGrowthInfo) {
        trueGrowthData.trueGrowthInfo = []; // Initialize if it's undefined
      }
      trueGrowthData.trueGrowthInfo.push({
     
        date,
        followYou,
        unFollowYou,
        netChange,
        issue,
      });
      await trueGrowthData.save(); // Save the updated document
      return res
        .status(200)
        .json({ success: true, message: "true Growth updated successfully" });
    }
  } catch (e) {
    console.log("Could not send true Growth to database: " + e.message);
    return res.status(500).json({
      success: false,
      message: `Could not send true Growth to database: ${e.stack}`,
    });
  }
});

export default router;
