import { Router, Request, Response } from "express";
import passwordModel from "../model/passwordModel";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const { deviceId } = req.query;

    // If deviceId is found then return the Device Data
    if (deviceId) {
      let device = await passwordModel.findOne({ deviceId });
      if (device) {
        return res.json({ success: true, device });
      }
      // if Devices are not found then give me all free Placements
      let freeDevices = await passwordModel
        .find({ isfree: true })
        .select("-password -twoFactorCode");
      if (freeDevices.length > 0) {
        return res.json({ success: true, freeDevice: freeDevices });
      } else {
        return res.json({
          success: false,
          message: "No free devices available",
        });
      }
    } else {
      return res.json({ success: false, message: "Device Id not found" });
    }
  } catch (e: any) {
    console.log(`Error in gettng Free Placement ${e.message}`);
    return res.json({
      success: false,
      message: "Error in getting Free Placement",
    });
  }
});

export default router;
