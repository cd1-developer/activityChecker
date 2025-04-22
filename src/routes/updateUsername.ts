import { Router, Response, Request } from "express";
import trueGrowthModel from "../model/trueGrowthModel";
import usernameModel from "../model/UsernameModel";
import addLogs from "../helper/addLogs";
import formatDate from "../helper/formateDate";

const router = Router();

router.put("/", async (req: Request, res: Response) => {
  try {
    const { subscriptionId, username, updatedUsername, updatedBy } = req.body;

    // Validation check
    if (!username || !updatedUsername || !subscriptionId) {
      return res
        .status(400)
        .json({ success: false, message: "Please add Username" });
    }

    // Fetch data from models
    const trueGrowthData = await trueGrowthModel.findOne({ username });
    const usernameData = await usernameModel.findOne({ subscriptionId });

    let updated = false;

    if (usernameData) {
      if (usernameData.username === username) {
        usernameData.username = updatedUsername;
        usernameData.updatedBy = updatedBy;
        usernameData.logs = addLogs(
          usernameData.logs || "",
          `${formatDate(new Date().toString())} old Username ${
            usernameData.username
          } updated to ${updatedUsername} and Updated By ${updatedBy}`
        );
        await usernameData.save();
        updated = true;
      }
    }

    if (trueGrowthData) {
      trueGrowthData.username = updatedUsername;
      await trueGrowthData.save();
      updated = true;
    }

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "No matching records found for update",
      });
    }

    res.json({
      success: true,
      message:
        "Username in TrueGrowth Model and UsernameModel Updated Successfully",
    });
  } catch (error: any) {
    console.error(`Error in updating Username: ${error.message}`);
    res
      .status(500)
      .json({ success: false, message: "Error in updating Username" });
  }
});

export default router;
