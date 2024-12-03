import { Router, Request, Response } from "express";
import AccountModel from "../model/accountModel";
const router = Router();

router.delete("/", async (req: Request, res: Response) => {
  try {
    const { mainDocumentId, documentId } = req.body;
    const accountData = await AccountModel.findOne({
      _id: mainDocumentId,
    });

    // // getting main DocumentId and id of particular array from trueGrowth info from client side
    if (!mainDocumentId && !documentId) {
      res.json({ success: false, message: "Invalid input" });
    }
    await AccountModel.updateOne(
      { _id: mainDocumentId },
      { $pull: { accountInfo: { _id: documentId } } }
    );
    res.json({
      success: true,
      message: "True growth data is delete",
      accountData,
    });
  } catch (error: any) {
    res.json({ success: false, message: "Could not able to true growth" });
  }
});
export default router;
