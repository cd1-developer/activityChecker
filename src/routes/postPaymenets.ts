import { Router, Request, Response } from "express";
import paymentModel from "../model/paymentModel";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { paymentsData } = req.body;

    if (paymentsData.length > 0) {
      // Prepare the data for bulk insert
      const paymentsToInsert = paymentsData.map((data: any) => {
        const currentDate = new Date();
        return {
          subscriptionId: data.subscriptionId,
          memberShip: data.memberShip,
          access: data.access,
          rebill: data.rebill,
          rate: data.rate,
          group: data.group,
          start: data.start,
          expiry: data.expiry,
          logs: data.logs,
          updatedAt: [currentDate],
        };
      });

      // Insert all data in a single operation
      await paymentModel.insertMany(paymentsToInsert);

      return res.json({
        success: true,
        message: `Successfully inserted ${paymentsData.length} payment records.`,
      });
    } else {
      return res.json({
        success: false,
        message: "No payment data provided.",
      });
    }
  } catch (e: any) {
    return res.json({
      success: false,
      message: `Error in sending data to the database: ${e.message}`,
    });
  }
});

export default router;
