import { Router, Request, Response } from "express";
import trueGrowthModel from "../model/trueGrowthModel";
const router = Router();

router.delete("/", async (req: Request, res: Response) => {
  try {
    const { mainDocumentId, documentId } = req.body;
    const trueGrowthData = await trueGrowthModel.findOne({
      _id: mainDocumentId,
    });

    // // getting main DocumentId and id of particular array from trueGrowth info from client side
    if (!mainDocumentId && !documentId) {
      res.json({ success: false, message: "Invalid input" });
    }

    // Removing Data from weeklyTrueGrowthData
    await trueGrowthModel.updateOne(
      { _id: mainDocumentId },
      { $pull: { weekTrueGrowth: { _id: documentId } } }
    );
    res.json({
      success: true,
      message: "True growth data is delete",
      trueGrowthData,
    });
  } catch (error: any) {
    res.json({ success: false, message: "Could not able to true growth" });
  }
});
export default router;


