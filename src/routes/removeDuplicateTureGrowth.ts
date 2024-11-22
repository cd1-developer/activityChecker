import { Router, Request, Response } from "express";
import trueGrowthModel from "../model/trueGrowthModel";

const router = Router();

// Utility function to format dates
function formatDate(dateString) {
  const dateInfo = new Date(dateString);
  const date = String(dateInfo.getDate()).padStart(2, "0");
  const month = String(dateInfo.getMonth() + 1).padStart(2, "0");
  const year = dateInfo.getFullYear();
  return `${date}/${month}/${year}`;
}

router.get("/", async (req: Request, res: Response) => {
  try {
    const usernames = [
      "nicollette.de.decker",
      "holistic_ink",
      "gyopo.polo.viaje",
      "littleruthbooks",
      "amazing_gracesn",
      "mrtvlifts",
      "vithelp",
      "kxtray",
      "taylorharkey2",
      "lostsaintsmusic",
      "brandonbnelson",
      "william_ruiz_hardwood_floors",
      "synlawnvanisle",
      "drtimsproule",
      "outdoorswithpreets",
      "adelynraeofficial",
      "becca_alexaa",
    ];

    const duplicateData = [];
    const allData = await trueGrowthModel.find({});

    // Finding duplicate dates in accountInfo

    allData.forEach(async (data) => {
      let shouldUpdate = false;
      const trueGrowthInfo = data.trueGrowthInfo;

      for (let i = 0; i < trueGrowthInfo.length; i++) {
        for (let j = 0; j < usernames.length; j++) {
          let username = usernames[j];
          if (username === data.username) {
            if (trueGrowthInfo[i].date === "NaN undefined NaN") {
              duplicateData.push({
                documentId: data._id,
                info: trueGrowthInfo[i],
              });

              // Update the date in-memory
              trueGrowthInfo[i].date = "18/11/2024";
              shouldUpdate = true;
            }
          }
        }
      }
      // Save updated document back to MongoDB
      if (shouldUpdate) {
        await trueGrowthModel.updateOne(
          { _id: data._id },
          { $set: { trueGrowthInfo } }
        );
      }
    });

    return res.json({ duplicateData });

   
  } catch (error) {
    console.error("Error deleting accountInfo items:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting accountInfo items." });
  }
});

export default router;
