import { Router, Request, Response } from "express";
import avModel from "../model/avEmailModel";
import { coreAVUsername } from "../model/avEmailModel";
const router = Router();



router.post("/", async (req: Request, res: Response) => {
  try {
    const { avUsernameData } = req.body;
    if (avUsernameData.length > 0) {

      const allAvUsernameData :coreAVUsername[] = avUsernameData.map(
        (data: coreAVUsername) => {
          return {
            subscriptionId: data.subscriptionId,
            avEmail: data.avEmail,
            avUsername: data.avUsername,
          };
        }
      );

      // interting data in AvEmail in Database
       const result =  await avModel.insertMany(allAvUsernameData)

      return res.json({
        success: true,
        message: `Successfully inserted avUsername records.`,
      });

    }
  } catch (e: any) {
    return res.json({ success: false, message: e.message });
  }
});
export default router