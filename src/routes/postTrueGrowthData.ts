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
     isWeekly
    } = req.body;

    const trueGrowthData = await trueGrowthModel.findOne({ username });
    // True Growth Data not found Create new one
    let newTrueGrowthData: any;
    if (!trueGrowthData) {
      // If isWeekly is True which means's The True Growth is Monthly
      if(isWeekly){
        newTrueGrowthData = new trueGrowthModel({
          username,
          weekTrueGrowth: [
            {
              date,
              followYou,
              unFollowYou,
              netChange,
              issue,
            },
          ],
        }); 
      } // If isWeekly is False which means's The True Growth is Monthly
      else if(isWeekly === false) {
        newTrueGrowthData = new trueGrowthModel({
          username,
          MonthlyTrueGrowth: [
            {
              date,
              followYou,
              unFollowYou,
              netChange,
              issue,
            },
          ],
        });
      }
 
      await newTrueGrowthData.save();
      return res
        .status(201)
        .json({ success: true, message: "Data saved successfully" });
    } else {
      // Ensure accountInfo is initialized
      if(isWeekly){
        if (!trueGrowthData.weekTrueGrowth) {
          trueGrowthData.weekTrueGrowth = []; // Initialize if it's undefined
        }
        trueGrowthData.weekTrueGrowth.push({
     
          date,
          followYou,
          unFollowYou,
          netChange,
          issue,
        });
        await trueGrowthData.save(); // Save the updated document
      }
     else if(isWeekly === false){
        if (!trueGrowthData.MonthlyTrueGrowth) {
          trueGrowthData.MonthlyTrueGrowth = []; // Initialize if it's undefined
        }
        trueGrowthData.MonthlyTrueGrowth.push({
          date,
          followYou,
          unFollowYou,
          netChange,
          issue,
        });
        await trueGrowthData.save(); // Save the updated document
      }
   
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
