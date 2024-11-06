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
    const duplicateData = [];
    const allData = await AccountModel.find({});

    // Finding duplicate dates in accountInfo
    allData.forEach((data) => {
      const accountInfo = data.accountInfo;
      for (let i = 0; i < accountInfo.length - 1; i++) {
        if (formatDate(accountInfo[i].date) === formatDate(accountInfo[i + 1].date)) {
          duplicateData.push({ documentId: data._id, info: accountInfo[i + 1] });
        }
      }
    });

    // Removing duplicates from accountInfo based on collected duplicate data
    for (const duplicate of duplicateData) {
      await AccountModel.findByIdAndUpdate(
        duplicate.documentId,
        { $pull: { accountInfo: { _id: duplicate.info._id } } }
      );
    }

    res.json({ message: "Selected duplicate accountInfo items deleted successfully." });
  } catch (error) {
    console.error("Error deleting accountInfo items:", error);
    res.status(500).json({ error: "An error occurred while deleting accountInfo items." });
  }
});

export default router;
