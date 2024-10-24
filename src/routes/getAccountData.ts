import { Router, Request, Response } from "express";
import AccountModel from "../model/accountModel";
const router = Router();
router.get("/", async (req: Request, res: Response) => {
  try {
    const { username } = req.body;
    const accountData = await AccountModel.find({ username: username });
    if (!accountData) {
      return res
        .status(401)
        .json({ success: false, message: "Username not found" });
    }
    return res.status(201).json({ success: true, message: accountData });
  } catch (e) {
    console.log("Could not able to get data");
    return res
      .status(501)
      .json({ success: false, message: "Could not able to get data" });
  }
});
export default router;
