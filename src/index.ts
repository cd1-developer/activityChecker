import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/index";
import bodyParser from "body-parser";
import postAccountData from "./routes/postAccountData";
import getAccountData from "./routes/getAccountData";
import postTrueGrowthData from "./routes/postTrueGrowthData";
import getTruwGrowthData from "./routes/getTrueGrowthData";
import deleteTrueGrowth from "./routes/deleteTrueGrowth";
import deleteActivityData from "./routes/deleteActivityData";
import updateUsername from "./routes/updateUsername";
import updateUsernameInAcitivityData from "./routes/updateUsernameInActivityData";
import signUp from "./routes/signUp";
import signIn from "./routes/signIn";
import userInfo from "./routes/userInfo";
import cors from "cors";
import cookieParser from "cookie-parser";
import logout from "./routes/logout";
import addPlacement from "./routes/addPlacemenet";
import bookPlacement from "./routes/bookPlacement";
import getPlacementData from "./routes/getPlacementData";
import postPayment from "./routes/postPaymenets";
import postAvUsername from "./routes/postAvUsername";
import updatePayments from "./routes/updatePayments";
import getPaymentData from "./routes/getPaymentData";
import getCoreAVData from "./routes/getAvEmailData";
import postUsernameData from "./routes/postUsername";
import getUsernameData from "./routes/getUsernameData";
import replaceSubscriptionID from "./routes/replaceSubscriptionID";
import extendSubscription from "./routes/extendSubscription";
import upgradeSubscription from "./routes/upgradeSubscription";
import replaceAvUsername from "./routes/replaceAvUsername";

dotenv.config({
  path: ".env",
});

const app = express();

// CORS configuration
app.use(
  cors({
    origin: "*", // Change to specific domains if needed
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

app.use(cookieParser()); // This will allow you to access cookies as req.cookies
// first db Should be connected properly then do other things

// Increase payload size limit to 50MB (adjust as needed)
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

connectDB()
  .then(() => {
    // expect response in json format

    // start using routes
    app.use("/api/postAccountData", postAccountData);
    app.use("/api/getAccountData", getAccountData);
    app.use("/api/postTrueGrowthData", postTrueGrowthData);
    app.use("/api/getTruwGrowthData", getTruwGrowthData);
    app.use("/api/deleteTrueGrowth", deleteTrueGrowth);
    app.use("/api/deleteActivityData", deleteActivityData);
    app.use("/api/updateUsername", updateUsername);
    app.use(
      "/api/updateUsernameInAcitivityData",
      updateUsernameInAcitivityData
    );
    app.use("/api/signup", signUp);
    app.use("/api/signIn", signIn);
    app.use("/api/userInfo", userInfo);
    app.use("/api/logout", logout);
    app.use("/api/addPlacement", addPlacement);
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
    // start the server

    app.listen(process.env.PORT, () => {
      console.log(
        `Server is running at ${process.env.PORT} and Path is http://localhost:${process.env.PORT}`
      );
    });
  })
  .catch((error) => {
    console.log(`Error : could not able to start server ${error.message}`);
  });
