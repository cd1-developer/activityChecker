import { Router, Request, Response } from "express";
import paymentModel from "../model/paymentModel";
import avModel from "../model/avEmailModel";
import getTrialPeriodDate from "../helper/getTrialPeriod";
import addLogs from "../helper/addLogs";

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
    if (allMailData.length > 0) {
      let newRecurringMail = allMailData.filter(
        (mailInfo: MailInfo) => mailInfo.mailType === "New Client"
      );
      if (newRecurringMail.length > 0) {
        newRecurringMail = newRecurringMail.map((mailInfo: MailInfo) => {
          let { subscriptionId, amount, invoiceDate, recivedDate } = mailInfo;

          return {
            subscriptionId,
            memberShip: "Trial",
            access: "Enabled",
            rebill: "Active",
            rate: amount,
            group: ["$119", "$139", "$129"].includes(amount)
              ? "Starter"
              : ["$179", "$199", "$135", "$189"].includes(amount)
              ? "Turbo"
              : "",
            start: new Date(invoiceDate),
            expiry: getTrialPeriodDate(invoiceDate),
            logs: `${recivedDate} new Client`,
            updatedAt: [new Date()],
          };
        });
        
        let newAvUsernameData = newRecurringMail.map((mailInfo:MailInfo)=> ({
          subscriptionId:mailInfo.subscriptionId,
          avEmail:mailInfo.email,
          avUsername:mailInfo.login
        }))

        // sending all new recurring mail's payment data in datebase
        await paymentModel.insertMany(newRecurringMail);
        // sending all new recurring mail's avUsername data in database
        const messages = newRecurringMail.map(
          (mailInfo: MailInfo) =>
            `Trial provided to the subscriptionId ${mailInfo.subscriptionId}`
        );
        return res.json({ success: true, messages });
      }
      let leftOverMails = allMailData.filter(
        (mailInfo: MailInfo) => mailInfo.mailType !== "New Client"
      );

      if (leftOverMails.length > 0) {
        for (const mailInfo of leftOverMails) {
          let { subscriptionId, mailType, expiredDate, recivedDate } = mailInfo;
          let paymentData = await paymentModel.findOne({ subscriptionId });
          if (paymentData) {
            let { logs, updatedAt } = paymentData;
            if (mailType === "Monthly Payment") {
              paymentData.access = "Enabled";
              paymentData.rebill = "Active";
              paymentData.expiry = expiredDate;
            } else if (mailType === "Client Cancelled") {
              paymentData.rebill = "Cancelled";
            } else if (mailType === "Transaction Failed") {
              paymentData.access = "Expired";
              paymentData.rebill = "Payment Failed";
            }

            paymentData.logs = addLogs(logs, `${recivedDate} ${mailType}`);
            paymentData.updatedAt = [new Date(), ...updatedAt];
            await paymentData.save();
            return res.json({
              success: true,
              message: `subscriptionId ${subscriptionId} && ${mailType}`,
            });
          } else {
            return res.json({
              success: false,
              message: `Subscription ID ${subscriptionId} not found`,
            });
          }
        }
      } else {
        return res.json({ success: false, message: "No Left Over Mails" });
      }
    } else
      return res.json({
        success: false,
        message: "Please provide payment Data ",
      });
  } catch (e: any) {
    return res.json({
      success: false,
      message: `Could not able to update payment ${e.message}`,
    });
  }
});

export default router
