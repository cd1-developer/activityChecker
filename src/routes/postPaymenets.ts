import { Router, Request, Response } from "express";
import paymentModel from "../model/paymentModel";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { paymentsData } = req.body;
    return res.json({ success: true, data: paymentsData });
    // const currentDate = new Date();

    // // Prepare the data for bulk insert
    // const formattedPayments = paymentsData.map((data: any) => ({
    //   subscriptionId: data.subscriptionId,
    //   memberShip: data.memberShip,
    //   access: data.access,
    //   rebill: data.rebill,
    //   rate: data.rate,
    //   group: data.group,
    //   expiry: data.expiry,
    //   logs: data.logs || "",
    //   updatedAt: [currentDate], // Add timestamp array
    // }));

    // // Insert all records at once using insertMany()
    // await paymentModel.insertMany(formattedPayments);
  } catch (e: any) {
    return res.status(500).json({
      success: false,
      message: `Error inserting data: ${e.message}`,
    });
  }
});

export default router;
