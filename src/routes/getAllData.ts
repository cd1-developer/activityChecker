import { Router, Request, Response } from "express";
import AccountModel from "../model/accountModel";
const router = Router();
router.get("/", async (req: Request, res: Response) => {
    const allData = await AccountModel.find({});
    const allUsernames = allData.map(data => data.username)
    res.json(allUsernames)
});
export default router;