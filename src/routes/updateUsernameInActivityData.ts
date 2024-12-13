import { Router, Response, Request } from "express";
import AccountModel from "../model/accountModel";

const router = Router();

router.put("/", async (req: Request, res: Response) => {
  try {
    const { username, UpdatedUsername } = req.body;

    if (!username || !UpdatedUsername) {
      return res.json({ success: false, message: "Please add Username" });
    }

    const accountData = await AccountModel.findOne({ username });
    
    if (!accountData) {
      return res.json({ success: false, message: "Account not found" });
    }

    

    accountData.username = UpdatedUsername;
    await accountData.save();
    
    res.json({ success: true, message: "Username in Activity Model is Updated" });

  } catch (e: any) {
    console.error(`Error in updating Username, ${e.stack || e.message}`);
    res.json({ success: false, message: "Error in updating Username in Activity Model" });
  }
});

export default router;
