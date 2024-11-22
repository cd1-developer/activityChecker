import { Router, Request, Response } from "express";
import AccountModel from "../model/accountModel";

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
  "becca_alexaa"
    ];
    
    const duplicateData = [];
    const allData = await AccountModel.find({});

    // Finding duplicate dates in accountInfo
    allData.forEach((data) => {
      const accountInfo = data.accountInfo;
      for (let i = 0; i < accountInfo.length ; i++) {
        for(let j = 0; j < usernames.length; j++){
          let username = usernames[j];
          if(username === data.username){
           if(formatDate(accountInfo[i].date) === 'NaN undefined NaN'){
            duplicateData.push({ documentId: data._id, info: accountInfo[i] })
           }
          }
        }
        // if (formatDate(accountInfo[i].date) == "11/11/2024") {
        //   console.log(formatDate(accountInfo[i].date))
        //   duplicateData.push({ documentId: data._id, info: accountInfo[i + 1] });
        // }
      }
    });

    // Removing duplicates from accountInfo based on collected duplicate data
    // for (const duplicate of duplicateData) {
    //   await AccountModel.findByIdAndUpdate(
    //     duplicate.documentId,
    //     { $pull: { accountInfo: { _id: duplicate.info._id } } }
    //   );
    // }
    return res.json({duplicateData})
    

    res.json({ message: "Selected duplicate accountInfo items deleted successfully.", });
  } catch (error) {
    console.error("Error deleting accountInfo items:", error);
    res.status(500).json({ error: "An error occurred while deleting accountInfo items." });
  }
});

export default router;
