import { Router, Request, Response } from "express";
import avModel from "../model/avEmailModel";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { subscriptionId, oldAvUsername, newAvUsername } = req.body;

    if (!subscriptionId || !oldAvUsername || !newAvUsername)
      return res.json({
        success: false,
        message:
          "Please provide all input feild like subscription Id, old AvUsername and new AvUsername",
      });

    const avData = await avModel.findOne({ subscriptionId });
    if (!avData)
      return res.json({
        success: false,
        message: `Av Username not found on this subscription Id ${subscriptionId}`,
      });

    if (avData.avEmail !== oldAvUsername)
      return res.json({
        success: false,
        message: `${oldAvUsername} not found`,
      });

    avData.avEmail = newAvUsername;
    return res.json({
      success: true,
      message: `${oldAvUsername} updated with ${newAvUsername}`,
    });
  } catch (error: any) {
    return res.json({
      success: false,
      message: `Error in Replacing AV Email : ${error.message}`,
    });
  }
});
export default router;
