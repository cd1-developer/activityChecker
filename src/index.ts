import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/index";
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
import postPassword from "./routes/postPaymenets";
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
    app.use("/api/postPassword", postPassword);
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
