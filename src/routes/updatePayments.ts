import { Router, Request, Response } from "express";
import paymentModel from "../model/paymentModel";
import avModel from "../model/avEmailModel";
import getTrialPeriodDate from "../helper/getTrialPeriod";
import addLogs from "../helper/addLogs";
import removeDuplicate from "../helper/removeDuplicate";

interface MailInfo {
  subscriptionId: string;
  mailType: string;
  amount?: string;
  invoiceDate?: string;
  recivedDate?: string;
  expiredDate?: string;
  email?: string;
  login?: string;
}

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { allMailData } = req.body;
    const messages: string[] = [];

    if (!allMailData || allMailData.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No payment data provided",
      });
    }

    // Process New Client emails
    const newClients = allMailData.filter(
      (mail: MailInfo) => mail.mailType === "New Client"
    );

    if (newClients.length > 0) {
      try {
        // Create payment records
        const newPayments = newClients.map((mail) => ({
          subscriptionId: mail.subscriptionId,
          memberShip: "Trial",
          access: "Enabled",
          rebill: "Active",
          rate: mail.amount,
          group: ["$119", "$139", "$129"].includes(mail.amount || "")
            ? "Starter"
            : ["$179", "$199", "$135", "$189"].includes(mail.amount || "")
            ? "Turbo"
            : "",
          start: new Date(mail.invoiceDate!),
          expiry: getTrialPeriodDate(mail.invoiceDate!),
          logs: `${mail.recivedDate} new Client`,
          updatedAt: [new Date()],
        }));

        await paymentModel.insertMany(removeDuplicate(newPayments));

        // Create AV records
        const avRecords = newClients.map((mail) => ({
          subscriptionId: mail.subscriptionId,
          avEmail: mail.email,
          avUsername: mail.login,
        }));

        await avModel.insertMany(removeDuplicate(avRecords));

        messages.push(
          ...newClients.map(
            (mail) =>
              `🎉 Trial activated for subscription ${mail.subscriptionId}`
          )
        );
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Failed to create new subscriptions",
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    // Process other email types
    const otherMails = allMailData.filter(
      (mail: MailInfo) => mail.mailType !== "New Client"
    );

    for (const mail of otherMails) {
      try {
        const payment = await paymentModel.findOne({
          subscriptionId: mail.subscriptionId,
        });

        if (!payment) {
          messages.push(`❌ Subscription ${mail.subscriptionId} not found`);
          continue;
        }

        const originalState = {
          membership: payment.memberShip,
          access: payment.access,
          rebill: payment.rebill,
        };

        // Update based on mail type
        switch (mail.mailType) {
          case "Monthly Payment":
            payment.memberShip = "Monthly";
            payment.access = "Enabled";
            payment.rebill = "Active";
            payment.expiry = mail.expiredDate;
            break;

          case "Client Cancelled":
            payment.rebill = "Cancelled";
            break;

          case "Transaction Failed":
            payment.access = "Expired";
            payment.rebill = "Payment Failed";
            break;
        }

        // Add logs only if state changed
        if (payment.isModified()) {
          payment.logs = addLogs(
            payment.logs,
            `${mail.recivedDate} ${mail.mailType}`
          );
          payment.updatedAt = [new Date(), ...payment.updatedAt];
          await payment.save();
          messages.push(`🔄 Updated ${mail.subscriptionId}: ${mail.mailType}`);
        } else {
          messages.push(
            `⏩ No changes for ${mail.subscriptionId}: ${mail.mailType}`
          );
        }
      } catch (error) {
        messages.push(
          `⚠️ Error processing ${mail.subscriptionId}: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }

    // Final response
    if (messages.length > 0) {
      return res.json({
        success: true,
        message: "Processing complete",
        details: messages,
        processedCount: messages.length,
      });
    }

    return res.status(404).json({
      success: false,
      message: "No actionable data found in request",
    });
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
