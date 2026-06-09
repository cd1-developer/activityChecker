import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/db/index";
import postAccountData from "./src/routes/postAccountData";
import getAccountData from "./src/routes/getAccountData";
import postTrueGrowthData from "./src/routes/postTrueGrowthData";
import getTruwGrowthData from "./src/routes/getTrueGrowthData";
import deleteTrueGrowth from "./src/routes/deleteTrueGrowth";
import deleteActivityData from "./src/routes/deleteActivityData";
import updateUsername from "./src/routes/updateUsername";
import updateUsernameInAcitivityData from "./src/routes/updateUsernameInActivityData";
import signUp from "./src/routes/signUp";
import signIn from "./src/routes/signIn";
import userInfo from "./src/routes/userInfo";
import cors from "cors";
import logout from "./src/routes/logout";
// import addPlacement from "./src/routes/addPlacemenet";
import bookPlacement from "./src/routes/bookPlacement";
import getPlacementData from "./src/routes/getPlacementData";
import postPayment from "./src/routes/postPaymenets";
import postAvUsername from "./src/routes/postAvUsername";
import updatePayments from "./src/routes/updatePayments";
import getPaymentData from "./src/routes/getPaymentData";
import getCoreAVData from "./src/routes/getAvEmailData";
import postUsernameData from "./src/routes/postUsername";
import getUsernameData from "./src/routes/getUsernameData";
import replaceSubscriptionID from "./src/routes/replaceSubscriptionID";
import extendSubscription from "./src/routes/extendSubscription";
import upgradeSubscription from "./src/routes/upgradeSubscription";
import replaceAvUsername from "./src/routes/replaceAvUsername";
import deleteUsername from "./src/routes/deleteUsername";
import postTicketIn from "./src/routes/postTicketInData";
import getTicketInData from "./src/routes/getTicketInData";
import addMessage from "./src/routes/addMessage";
import updateTicket from "./src/routes/UpdateTicket";
import changePaymentStatus from "./src/routes/ChangePaymentStatus";
import postAvGrowth from "./src/routes/postAvGrowth";
import getAvGrowthData from "./src/routes/getAvGrowthData";

dotenv.config({
  path: ".env",
});

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  }),
);
app.use(express.json({ limit: "50mb" }));

// Ensure DB is connected before handling any request
app.use(async (_req, _res, next) => {
  await connectDB();
  next();
});

app.use("/api/postAccountData", postAccountData);
app.use("/api/getAccountData", getAccountData);
app.use("/api/postTrueGrowthData", postTrueGrowthData);
app.use("/api/getTruwGrowthData", getTruwGrowthData);
app.use("/api/deleteTrueGrowth", deleteTrueGrowth);
app.use("/api/deleteActivityData", deleteActivityData);
app.use("/api/updateUsername", updateUsername);
app.use("/api/updateUsernameInAcitivityData", updateUsernameInAcitivityData);
app.use("/api/signup", signUp);
app.use("/api/signIn", signIn);
app.use("/api/userInfo", userInfo);
app.use("/api/logout", logout);
app.use("/api/bookPlacement", bookPlacement);
app.use("/api/getPlacementData", getPlacementData);
app.use("/api/postPayment", postPayment);
app.use("/api/postAvUsername", postAvUsername);
app.use("/api/updatePayments", updatePayments);
app.use("/api/getPaymentData", getPaymentData);
app.use("/api/getCoreAVData", getCoreAVData);
app.use("/api/postUsernameData", postUsernameData);
app.use("/api/getUsernameData", getUsernameData);
app.use("/api/replaceSubscriptionID", replaceSubscriptionID);
app.use("/api/extendSubscription", extendSubscription);
app.use("/api/upgradeSubscription", upgradeSubscription);
app.use("/api/replaceAvUsername", replaceAvUsername);
app.use("/api/deleteUsername", deleteUsername);
app.use("/api/postTicketIn", postTicketIn);
app.use("/api/getTicketIn", getTicketInData);
app.use("/api/updateTicket", updateTicket);
app.use("/api/addMessage", addMessage);
app.use("/api/changePaymentStatus", changePaymentStatus);
app.use("/api/av-growth", postAvGrowth);
app.use("/api/getAvGrowthData", getAvGrowthData);

// Local dev only
if (process.env.NODE_ENV !== "production") {
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`);
  });
}

export default app;
